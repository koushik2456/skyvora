import { create } from 'zustand';
import type { District, Mandal, State, Village } from '@/types';

/**
 * Real LGD-derived datasets (lgdirectory.gov.in via ramSeraph/opendata, CC0).
 * Heavy per-state JSON is lazy-required only when a state is selected so app
 * startup never parses ~1 MB of villages it may not need.
 */
const STATE_META: { id: string; name: string }[] = [
  { id: '28', name: 'Andhra Pradesh' },
  { id: '36', name: 'Telangana' },
];

const stateCache = new Map<string, State>();

function loadFullState(id: string): State {
  const cached = stateCache.get(id);
  if (cached) return cached;
  let data: State;
  switch (id) {
    case '28':
      data = require('@/assets/data/andhra_pradesh.json') as State;
      break;
    case '36':
      data = require('@/assets/data/telangana.json') as State;
      break;
    default:
      throw new Error(`Unknown state id: ${id}`);
  }
  stateCache.set(id, data);
  return data;
}

/** Lightweight entries shown in the State dropdown before full data loads. */
const allStates: State[] = STATE_META.map((s) => ({ ...s, districts: [] }));

interface LocationStore {
  allStates: State[];
  selectedState: State | null;
  availableDistricts: District[];
  selectedDistrict: District | null;
  availableMandals: Mandal[];
  selectedMandal: Mandal | null;
  availableVillages: Village[];
  selectedVillage: Village | null;
  setSelectedState: (state: State) => void;
  setSelectedDistrict: (district: District) => void;
  setSelectedMandal: (mandal: Mandal) => void;
  setSelectedVillage: (village: Village) => void;
  reset: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  allStates,
  selectedState: null,
  availableDistricts: [],
  selectedDistrict: null,
  availableMandals: [],
  selectedMandal: null,
  availableVillages: [],
  selectedVillage: null,
  setSelectedState: (state) => {
    const full = loadFullState(state.id);
    set({
      selectedState: full,
      availableDistricts: full.districts,
      selectedDistrict: null,
      availableMandals: [],
      selectedMandal: null,
      availableVillages: [],
      selectedVillage: null,
    });
  },
  setSelectedDistrict: (district) =>
    set({
      selectedDistrict: district,
      availableMandals: district.mandals,
      selectedMandal: null,
      availableVillages: [],
      selectedVillage: null,
    }),
  setSelectedMandal: (mandal) =>
    set({
      selectedMandal: mandal,
      availableVillages: mandal.villages,
      selectedVillage: null,
    }),
  setSelectedVillage: (village) => set({ selectedVillage: village }),
  reset: () =>
    set({
      selectedState: null,
      availableDistricts: [],
      selectedDistrict: null,
      availableMandals: [],
      selectedMandal: null,
      availableVillages: [],
      selectedVillage: null,
    }),
}));
