import type { ReportDetail } from '@/constants/reports';
import { getReportDetail } from '@/constants/reports';
import { SOIL_METRIC_KEYS } from './contentMaps';
import type { TranslationKey } from './strings';

type TFn = (key: TranslationKey, params?: Record<string, string | number>) => string;

const SOIL_NATURE_KEYS: Record<string, TranslationKey> = {
  SKY4D8N2C: 'reportSoilNatureSky4D8N2C',
  SKY1A5T9D: 'reportSoilNatureSky1A5T9D',
};

const OBS_OVERRIDE_KEYS: Record<string, TranslationKey[]> = {
  SKY1A5T9D: ['reportObsSky1A5T9D0', 'reportObsSky1A5T9D1', 'reportObsSky1A5T9D2'],
};

const DEFAULT_OBS_KEYS: TranslationKey[] = ['reportObs0', 'reportObs1', 'reportObs2'];

const LEVEL_KEYS: Record<string, TranslationKey> = {
  low: 'level_low',
  optimal: 'level_optimal',
  high: 'level_high',
};

function bookingKey(bookingId: string) {
  return bookingId.replace(/-/g, '');
}

export function getLocalizedReportDetail(t: TFn, bookingId: string): ReportDetail {
  const base = getReportDetail(bookingId);
  const bKey = bookingKey(bookingId);

  const soilNatureKey = SOIL_NATURE_KEYS[bKey] ?? 'reportSoilNatureDefault';
  const obsKeys = OBS_OVERRIDE_KEYS[bKey] ?? DEFAULT_OBS_KEYS;

  return {
    ...base,
    soilNature: t(soilNatureKey),
    soil: base.soil.map((m, i) => ({
      ...m,
      label: t(SOIL_METRIC_KEYS[i] ?? 'soilNitrogen'),
      level: m.level,
    })),
    recommendations: base.recommendations.map((r, i) => ({
      ...r,
      type: r.type,
      name: t(i === 0 ? 'reportRec0Name' : 'reportRec1Name'),
      note: t(i === 0 ? 'reportRec0Note' : 'reportRec1Note'),
    })),
    observations: base.observations.map((_, i) => t(obsKeys[i] ?? DEFAULT_OBS_KEYS[i] ?? 'reportObs0')),
    sprayCoverage: base.sprayCoverage,
    healthScore: base.healthScore,
  };
}

export function tSoilLevel(t: TFn, level: 'low' | 'optimal' | 'high') {
  return t(LEVEL_KEYS[level]);
}

export function tRecType(t: TFn, type: 'Pesticide' | 'Fertilizer') {
  return t(type === 'Fertilizer' ? 'recFertilizer' : 'recPesticide');
}
