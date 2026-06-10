import { create } from 'zustand';
import { calculateBookingCost } from '@/utils/pricing';
import { toAcres } from '@/utils/areaConverter';
import type { AreaUnit, CostBreakdown, TimeSlot } from '@/types';

interface BookingStore {
  state: string | null;
  district: string | null;
  mandal: string | null;
  village: string | null;
  farmerName: string;

  cropType: string | null;
  areaValue: number | null;
  areaUnit: AreaUnit;
  areaInAcres: number | null;

  serviceId: string | null;

  preferredDate: string | null;
  preferredSlot: TimeSlot | null;
  specialInstructions: string;

  costBreakdown: CostBreakdown | null;

  setLocation: (fields: {
    state: string;
    district: string;
    mandal: string;
    village: string;
    farmerName: string;
  }) => void;
  setFarmerName: (name: string) => void;
  setCropArea: (crop: string, value: number, unit: AreaUnit) => void;
  setService: (serviceId: string) => void;
  setSchedule: (date: string, slot: TimeSlot, instructions?: string) => void;
  recomputeCost: () => void;
  resetBooking: () => void;
}

const recompute = (
  serviceId: string | null,
  areaInAcres: number | null
): CostBreakdown | null => {
  if (!serviceId || !areaInAcres) return null;
  return calculateBookingCost(serviceId, areaInAcres);
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  state: null,
  district: null,
  mandal: null,
  village: null,
  farmerName: '',
  cropType: null,
  areaValue: null,
  areaUnit: 'acres',
  areaInAcres: null,
  serviceId: null,
  preferredDate: null,
  preferredSlot: null,
  specialInstructions: '',
  costBreakdown: null,

  setLocation: (fields) => set({ ...fields }),
  setFarmerName: (farmerName) => set({ farmerName }),
  setCropArea: (cropType, areaValue, areaUnit) => {
    const areaInAcres = toAcres(areaValue, areaUnit);
    set({
      cropType,
      areaValue,
      areaUnit,
      areaInAcres,
      costBreakdown: recompute(get().serviceId, areaInAcres),
    });
  },
  setService: (serviceId) =>
    set({
      serviceId,
      costBreakdown: recompute(serviceId, get().areaInAcres),
    }),
  setSchedule: (preferredDate, preferredSlot, specialInstructions) =>
    set({
      preferredDate,
      preferredSlot,
      specialInstructions: specialInstructions ?? get().specialInstructions,
    }),
  recomputeCost: () =>
    set({ costBreakdown: recompute(get().serviceId, get().areaInAcres) }),
  resetBooking: () =>
    set({
      state: null,
      district: null,
      mandal: null,
      village: null,
      farmerName: '',
      cropType: null,
      areaValue: null,
      areaUnit: 'acres',
      areaInAcres: null,
      serviceId: null,
      preferredDate: null,
      preferredSlot: null,
      specialInstructions: '',
      costBreakdown: null,
    }),
}));
