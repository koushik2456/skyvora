import { create } from 'zustand';

export interface PickerItem {
  id: string;
  name: string;
}

interface PickerStore {
  open: boolean;
  label: string;
  items: PickerItem[];
  selectedId: string | null;
  onSelect: ((item: PickerItem) => void) | null;
  show: (args: {
    label: string;
    items: PickerItem[];
    selectedId: string | null;
    onSelect: (item: PickerItem) => void;
  }) => void;
  hide: () => void;
}

export const useLocationPickerStore = create<PickerStore>((set) => ({
  open: false,
  label: '',
  items: [],
  selectedId: null,
  onSelect: null,
  show: ({ label, items, selectedId, onSelect }) =>
    set({ open: true, label, items, selectedId, onSelect }),
  hide: () => set({ open: false, onSelect: null }),
}));
