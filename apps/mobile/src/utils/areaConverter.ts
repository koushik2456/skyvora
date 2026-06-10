import type { AreaUnit } from '@/types';

const conversions: Record<AreaUnit, number> = {
  acres: 1,
  guntas: 1 / 40,
  sqft: 1 / 43560,
  sqm: 1 / 4046.86,
  cents: 1 / 100,
  hectares: 2.47105,
};

export const toAcres = (value: number, unit: AreaUnit): number => {
  if (!value || Number.isNaN(value)) return 0;
  return parseFloat((value * conversions[unit]).toFixed(4));
};

export const MIN_ACRES = 0.25;
export const MAX_ACRES = 500;

export const isAreaValid = (acres: number): boolean =>
  acres >= MIN_ACRES && acres <= MAX_ACRES;
