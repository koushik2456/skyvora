/** Mock report analytics shown in the in-app report detail view. */

export interface SoilMetric {
  label: string;
  value: string;
  level: 'low' | 'optimal' | 'high';
}

export interface ReportDetail {
  soil: SoilMetric[];
  soilNature: string;
  recommendations: { type: 'Pesticide' | 'Fertilizer'; name: string; dosage: string; note: string }[];
  sprayCoverage: number; // 0..1 of the field covered
  healthScore: number; // 0..100 crop health index
  observations: string[];
}

const DEFAULT_REPORT: ReportDetail = {
  soilNature: 'Red sandy loam · slightly acidic',
  soil: [
    { label: 'Nitrogen (N)', value: '210 kg/ha', level: 'low' },
    { label: 'Phosphorus (P)', value: '28 kg/ha', level: 'optimal' },
    { label: 'Potassium (K)', value: '340 kg/ha', level: 'high' },
    { label: 'pH', value: '6.2', level: 'optimal' },
    { label: 'Moisture', value: '18%', level: 'low' },
    { label: 'Organic Carbon', value: '0.58%', level: 'optimal' },
  ],
  recommendations: [
    {
      type: 'Fertilizer',
      name: 'Urea (46-0-0)',
      dosage: '35 kg/acre',
      note: 'Split into two applications, 20 days apart, to correct nitrogen deficit.',
    },
    {
      type: 'Pesticide',
      name: 'Neem-based bio pesticide',
      dosage: '1.2 L/acre',
      note: 'Preventive spray for sucking pests observed on field edges.',
    },
  ],
  sprayCoverage: 0.94,
  healthScore: 82,
  observations: [
    'Uniform canopy growth across 90% of the surveyed area.',
    'Mild moisture stress detected in the north-east strip.',
    'No major pest hotspots; minor aphid presence on boundary rows.',
  ],
};

const REPORTS: Record<string, Partial<ReportDetail>> = {
  'SKY-4D8N2C': {
    soilNature: 'Black cotton soil · neutral pH',
    healthScore: 76,
    sprayCoverage: 0.91,
  },
  'SKY-1A5T9D': {
    soilNature: 'Alluvial loam · well drained',
    healthScore: 88,
    sprayCoverage: 0.97,
    observations: [
      'Field boundary mapped to ±0.3 m accuracy across 8 acres.',
      'Two low-lying patches identified for drainage correction.',
      'Recommended plot split for staggered sugarcane planting.',
    ],
  },
};

export function getReportDetail(bookingId: string): ReportDetail {
  return { ...DEFAULT_REPORT, ...REPORTS[bookingId] };
}

export const CROP_VISUALS: Record<string, { colors: [string, string]; icon: string }> = {
  Rice: { colors: ['#16A34A', '#86EFAC'], icon: 'sprout' },
  Wheat: { colors: ['#CA8A04', '#FDE68A'], icon: 'wheat' },
  Cotton: { colors: ['#0E7490', '#A5F3FC'], icon: 'flower' },
  Sugarcane: { colors: ['#15803D', '#BBF7D0'], icon: 'sprout' },
  Maize: { colors: ['#D97706', '#FDE68A'], icon: 'wheat' },
  Chilli: { colors: ['#B91C1C', '#FCA5A5'], icon: 'flame' },
  default: { colors: ['#1D4ED8', '#93C5FD'], icon: 'leaf' },
};

export function getCropVisual(crop: string) {
  return CROP_VISUALS[crop] ?? CROP_VISUALS.default;
}
