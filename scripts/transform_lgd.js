/**
 * One-off transform: LGD CSV dumps -> per-state nested JSON
 * { id, name, districts: [{ id, name, mandals: [{ id, name, villages: [{ id, name }] }] }] }
 * Targets: Telangana (36), Andhra Pradesh (28)
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvDir = path.join(__dirname, 'lgd_csv');
const outDir = path.join(__dirname, '..', 'apps', 'mobile', 'src', 'assets', 'data');

const TARGETS = {
  '36': { file: 'telangana.json', name: 'Telangana' },
  '28': { file: 'andhra_pradesh.json', name: 'Andhra Pradesh' },
};

function readCsv(prefix) {
  const file = fs.readdirSync(csvDir).find((f) => f.startsWith(prefix + '.'));
  if (!file) throw new Error('missing csv for ' + prefix);
  return parse(fs.readFileSync(path.join(csvDir, file), 'utf8'), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  });
}

function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

const districts = readCsv('districts');
const subdistricts = readCsv('subdistricts');
const villages = readCsv('villages');

for (const [stateCode, target] of Object.entries(TARGETS)) {
  const distRows = districts.filter((r) => r['State Code'] === stateCode);
  const distMap = new Map(); // districtCode -> { id, name, mandals: Map }
  for (const r of distRows) {
    distMap.set(r['District Code'], {
      id: r['District Code'],
      name: titleCase(r['District Name(In English)']),
      mandals: new Map(),
    });
  }

  for (const r of subdistricts.filter((s) => s['State Code'] === stateCode)) {
    const d = distMap.get(r['District Code']);
    if (!d) continue;
    d.mandals.set(r['Sub-district Code'], {
      id: r['Sub-district Code'],
      name: titleCase(r['Sub-district Name']),
      villages: [],
    });
  }

  let vCount = 0;
  for (const r of villages) {
    if (r['State Code'] !== stateCode) continue;
    if (r['Village Status'] && r['Village Status'] !== 'Inhabitant') continue;
    const d = distMap.get(r['District Code']);
    if (!d) continue;
    const m = d.mandals.get(r['Sub-District Code']);
    if (!m) continue;
    m.villages.push({ id: r['Village Code'], name: titleCase(r['Village Name (In English)']) });
    vCount++;
  }

  const state = {
    id: stateCode,
    name: target.name,
    districts: [...distMap.values()]
      .map((d) => ({
        id: d.id,
        name: d.name,
        mandals: [...d.mandals.values()]
          .map((m) => ({
            ...m,
            villages: m.villages.sort((a, b) => a.name.localeCompare(b.name)),
          }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };

  const outPath = path.join(outDir, target.file);
  fs.writeFileSync(outPath, JSON.stringify(state));
  const sizeMb = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2);
  console.log(
    `${target.name}: ${state.districts.length} districts, ` +
      `${state.districts.reduce((n, d) => n + d.mandals.length, 0)} mandals, ${vCount} villages -> ${target.file} (${sizeMb} MB)`
  );
}
