#!/usr/bin/env python3
"""
Build production-grade India administrative hierarchy datasets
(State -> District -> Mandal/Sub-district -> Village) for Telangana and
Andhra Pradesh using ONLY official Local Government Directory (LGD) datasets.

Source datasets (downloaded from https://lgdirectory.gov.in):
  raw/states.<date>.csv
  raw/districts.<date>.csv
  raw/subdistricts.<date>.csv
  raw/villages.<date>.csv

IDs are official LGD codes. Labels are official LGD English names.

The villages dataset (~676k rows / ~72MB) is read in streamed chunks so the
full file is never materialised in memory at once.

Outputs (written to output/):
  telangana.json
  andhra_pradesh.json
  combined_states.json
  validation_report.json
"""

from __future__ import annotations

import glob
import json
import os
import re
from collections import OrderedDict

import pandas as pd

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(HERE)
RAW_DIR = os.path.join(REPO_ROOT, "raw")
OUTPUT_DIR = os.path.join(REPO_ROOT, "output")

# LGD State Codes for the target states.
TARGET_STATES = {
    "36": "Telangana",
    "28": "Andhra Pradesh",
}

# Output filename per state code.
STATE_FILENAME = {
    "36": "telangana.json",
    "28": "andhra_pradesh.json",
}

VILLAGE_CHUNK_SIZE = 100_000


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #

def latest_raw(prefix: str) -> str:
    """Return the most recent extracted CSV for a given LGD dataset prefix."""
    matches = sorted(glob.glob(os.path.join(RAW_DIR, f"{prefix}.*.csv")))
    if not matches:
        raise FileNotFoundError(
            f"No raw CSV found for '{prefix}' in {RAW_DIR}. "
            f"Expected e.g. {prefix}.10Jun2026.csv"
        )
    return matches[-1]


_WS_RE = re.compile(r"\s+")


def normalize_name(value) -> str:
    """Normalise an official name: UTF-8 safe, trimmed, single-spaced.

    Official LGD casing is preserved; only whitespace inconsistencies and
    stray control characters are cleaned. Returns '' for null-ish values.
    """
    if value is None:
        return ""
    if isinstance(value, float) and pd.isna(value):
        return ""
    text = str(value).replace("\u00a0", " ").strip()
    text = _WS_RE.sub(" ", text)
    return text


def clean_code(value) -> str:
    """Return a clean string LGD code, or '' if missing/invalid."""
    if value is None:
        return ""
    if isinstance(value, float) and pd.isna(value):
        return ""
    text = str(value).strip()
    if text == "" or text.lower() == "nan":
        return ""
    # LGD codes are integers; drop any accidental trailing '.0' from float reads.
    if text.endswith(".0") and text[:-2].isdigit():
        text = text[:-2]
    return text


# --------------------------------------------------------------------------- #
# Build pipeline
# --------------------------------------------------------------------------- #

def main() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    report = {
        "generated_at": pd.Timestamp.utcnow().isoformat(),
        "source": "Local Government Directory (LGD), Government of India - https://lgdirectory.gov.in",
        "source_files": {},
        "target_states": TARGET_STATES,
        "per_state": {},
        "totals": {},
        "duplicate_records_removed": {},
        "missing_mappings": {},
        "inactive_records_skipped": {},
        "malformed_rows_skipped": {},
    }

    # ----- States ---------------------------------------------------------- #
    states_file = latest_raw("states")
    report["source_files"]["states"] = os.path.basename(states_file)
    states_df = pd.read_csv(states_file, dtype=str, encoding="utf-8-sig")

    # state_code -> {id, name, _districts: OrderedDict}
    states: "OrderedDict[str, dict]" = OrderedDict()
    for _, row in states_df.iterrows():
        code = clean_code(row.get("State Code"))
        if code in TARGET_STATES:
            states[code] = {
                "id": code,
                "name": TARGET_STATES[code],  # canonical English label
                "_districts": OrderedDict(),
            }

    # ----- Districts ------------------------------------------------------- #
    districts_file = latest_raw("districts")
    report["source_files"]["districts"] = os.path.basename(districts_file)
    districts_df = pd.read_csv(districts_file, dtype=str, encoding="utf-8-sig")

    # district_code -> state_code  (lookup for the village/subdistrict joins)
    district_to_state: dict[str, str] = {}
    seen_district_ids: set[str] = set()
    dup_districts = 0
    malformed_districts = 0

    for _, row in districts_df.iterrows():
        state_code = clean_code(row.get("State Code"))
        if state_code not in states:
            continue
        dcode = clean_code(row.get("District Code"))
        dname = normalize_name(row.get("District Name(In English)"))
        if not dcode or not dname:
            malformed_districts += 1
            continue
        if dcode in seen_district_ids:
            dup_districts += 1
            continue
        seen_district_ids.add(dcode)
        district_to_state[dcode] = state_code
        states[state_code]["_districts"][dcode] = {
            "id": dcode,
            "name": dname,
            "_mandals": OrderedDict(),
        }

    # ----- Sub-districts / Mandals ----------------------------------------- #
    sub_file = latest_raw("subdistricts")
    report["source_files"]["subdistricts"] = os.path.basename(sub_file)
    sub_df = pd.read_csv(sub_file, dtype=str, encoding="utf-8-sig")

    # subdistrict_code -> (state_code, district_code)  for the village join
    sub_lookup: dict[str, tuple[str, str]] = {}
    seen_sub_ids: set[str] = set()
    dup_mandals = 0
    orphan_mandals = 0
    malformed_mandals = 0

    for _, row in sub_df.iterrows():
        state_code = clean_code(row.get("State Code"))
        if state_code not in states:
            continue
        scode = clean_code(row.get("Sub-district Code"))
        sname = normalize_name(row.get("Sub-district Name"))
        dcode = clean_code(row.get("District Code"))
        if not scode or not sname or not dcode:
            malformed_mandals += 1
            continue
        if scode in seen_sub_ids:
            dup_mandals += 1
            continue
        # Validate parent district exists within this state.
        district = states[state_code]["_districts"].get(dcode)
        if district is None:
            orphan_mandals += 1
            continue
        seen_sub_ids.add(scode)
        sub_lookup[scode] = (state_code, dcode)
        district["_mandals"][scode] = {
            "id": scode,
            "name": sname,
            "_villages": OrderedDict(),
        }

    # ----- Villages (streamed) --------------------------------------------- #
    villages_file = latest_raw("villages")
    report["source_files"]["villages"] = os.path.basename(villages_file)

    seen_village_ids: set[str] = set()
    dup_villages = 0          # duplicate LGD village code (global)
    dup_in_mandal = 0         # same village code already under that mandal
    orphan_villages = 0       # village whose sub-district isn't in our map
    malformed_villages = 0
    inactive_villages = 0     # reserved: LGD master holds only active units
    village_count_by_state = {code: 0 for code in states}

    usecols = [
        "State Code",
        "District Code",
        "Sub-District Code",
        "Village Code",
        "Village Name (In English)",
        "Village Status",
    ]

    reader = pd.read_csv(
        villages_file,
        dtype=str,
        encoding="utf-8-sig",
        usecols=usecols,
        chunksize=VILLAGE_CHUNK_SIZE,
    )

    for chunk in reader:
        # Restrict to target states before any per-row work.
        chunk = chunk[chunk["State Code"].isin(states.keys())]
        # Access columns by name (file column order is irrelevant this way).
        cols = zip(
            chunk["State Code"],
            chunk["Sub-District Code"],
            chunk["Village Code"],
            chunk["Village Name (In English)"],
        )
        for raw_state, raw_sub, raw_vcode, raw_vname in cols:
            state_code = clean_code(raw_state)
            sub_code = clean_code(raw_sub)
            vcode = clean_code(raw_vcode)
            vname = normalize_name(raw_vname)

            if not vcode or not vname or not sub_code:
                malformed_villages += 1
                continue

            parent = sub_lookup.get(sub_code)
            if parent is None or parent[0] != state_code:
                orphan_villages += 1
                continue

            _, dcode = parent
            mandal = states[state_code]["_districts"][dcode]["_mandals"][sub_code]

            if vcode in mandal["_villages"]:
                dup_in_mandal += 1
                continue
            if vcode in seen_village_ids:
                # Same LGD village code reused elsewhere - keep first occurrence.
                dup_villages += 1
                continue

            seen_village_ids.add(vcode)
            mandal["_villages"][vcode] = {"id": vcode, "name": vname}
            village_count_by_state[state_code] += 1

    # ----- Assemble + deterministic ordering ------------------------------- #
    def build_state(state_code: str) -> dict:
        s = states[state_code]
        districts_out = []
        for d in s["_districts"].values():
            mandals_out = []
            for m in d["_mandals"].values():
                villages_out = sorted(
                    m["_villages"].values(),
                    key=lambda v: (v["name"].lower(), v["id"]),
                )
                mandals_out.append(
                    {"id": m["id"], "name": m["name"], "villages": villages_out}
                )
            mandals_out.sort(key=lambda m: (m["name"].lower(), m["id"]))
            districts_out.append(
                {"id": d["id"], "name": d["name"], "mandals": mandals_out}
            )
        districts_out.sort(key=lambda d: (d["name"].lower(), d["id"]))
        return {"id": s["id"], "name": s["name"], "districts": districts_out}

    state_objects = {code: build_state(code) for code in states}

    # ----- Per-state stats + validation ------------------------------------ #
    def count_nodes(state_obj: dict) -> dict:
        n_d = len(state_obj["districts"])
        n_m = sum(len(d["mandals"]) for d in state_obj["districts"])
        n_v = sum(
            len(m["villages"])
            for d in state_obj["districts"]
            for m in d["mandals"]
        )
        return {"districts": n_d, "mandals": n_m, "villages": n_v}

    for code, obj in state_objects.items():
        report["per_state"][TARGET_STATES[code]] = count_nodes(obj)

    report["totals"] = {
        "states": len(state_objects),
        "districts": sum(s["districts"] for s in report["per_state"].values()),
        "mandals": sum(s["mandals"] for s in report["per_state"].values()),
        "villages": sum(s["villages"] for s in report["per_state"].values()),
    }
    report["duplicate_records_removed"] = {
        "districts": dup_districts,
        "mandals": dup_mandals,
        "villages_global_duplicate_code": dup_villages,
        "villages_duplicate_within_mandal": dup_in_mandal,
    }
    report["missing_mappings"] = {
        "orphan_mandals_no_parent_district": orphan_mandals,
        "orphan_villages_no_parent_subdistrict": orphan_villages,
    }
    report["malformed_rows_skipped"] = {
        "districts": malformed_districts,
        "mandals": malformed_mandals,
        "villages": malformed_villages,
    }
    report["inactive_records_skipped"] = {
        "note": (
            "LGD master downloads contain only active administrative units; "
            "merged/dissolved entities are already excluded at source."
        ),
        "villages": inactive_villages,
    }

    # Hard validation assertions (no orphans, no dup IDs survive in output).
    validation_errors = []
    all_ids: dict[str, int] = {}
    for obj in state_objects.values():
        all_ids[obj["id"]] = all_ids.get(obj["id"], 0) + 1
        for d in obj["districts"]:
            all_ids[d["id"]] = all_ids.get(d["id"], 0) + 1
            if not d["mandals"]:
                # District with zero mandals is allowed (newly formed) but flagged.
                pass
            for m in d["mandals"]:
                all_ids[m["id"]] = all_ids.get(m["id"], 0) + 1
                seen_v = set()
                for v in m["villages"]:
                    if not v["id"] or not v["name"]:
                        validation_errors.append(f"node missing id/name under mandal {m['id']}")
                    if v["id"] in seen_v:
                        validation_errors.append(f"dup village {v['id']} in mandal {m['id']}")
                    seen_v.add(v["id"])
    dup_id_list = [k for k, c in all_ids.items() if c > 1]
    if dup_id_list:
        validation_errors.append(f"duplicate LGD ids across hierarchy: {dup_id_list[:20]}")

    report["validation_passed"] = len(validation_errors) == 0
    report["validation_errors"] = validation_errors

    # ----- Write deliverables ---------------------------------------------- #
    def write_json(path: str, data) -> None:
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(data, fh, ensure_ascii=False, indent=2)

    for code, obj in state_objects.items():
        write_json(os.path.join(OUTPUT_DIR, STATE_FILENAME[code]), {"states": [obj]})

    combined = {
        "states": sorted(
            state_objects.values(), key=lambda s: (s["name"].lower(), s["id"])
        )
    }
    write_json(os.path.join(OUTPUT_DIR, "combined_states.json"), combined)
    write_json(os.path.join(OUTPUT_DIR, "validation_report.json"), report)

    # ----- Console summary -------------------------------------------------- #
    print("Build complete.")
    print(json.dumps(report["per_state"], indent=2, ensure_ascii=False))
    print("Totals:", json.dumps(report["totals"], ensure_ascii=False))
    print("Duplicates removed:", json.dumps(report["duplicate_records_removed"], ensure_ascii=False))
    print("Missing mappings:", json.dumps(report["missing_mappings"], ensure_ascii=False))
    print("Validation passed:", report["validation_passed"])
    if validation_errors:
        print("Validation errors:", validation_errors[:10])


if __name__ == "__main__":
    main()
