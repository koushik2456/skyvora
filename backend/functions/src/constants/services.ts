export interface ServiceDef {
  id: string;
  name: string;
  ratePerAcre: number;
}

export const SERVICES: ServiceDef[] = [
  { id: 'spray_pesticide', name: 'Spray Pesticide', ratePerAcre: 450 },
  { id: 'spray_fertilizer', name: 'Spray Fertilizer', ratePerAcre: 450 },
  { id: 'crop_management', name: 'Crop Management', ratePerAcre: 350 },
  { id: 'land_survey', name: 'Land Survey', ratePerAcre: 350 },
  { id: 'water_management', name: 'Water Management', ratePerAcre: 350 },
  { id: 'soil_testing', name: 'Land & Soil Testing', ratePerAcre: 350 },
  { id: 'fertilizer_report', name: 'Fertilizer Requirement Report', ratePerAcre: 350 },
];

export const getService = (id: string) => SERVICES.find((s) => s.id === id);

export const GST_RATE = 0.18;

const AREA_CONVERSIONS: Record<string, number> = {
  acres: 1,
  guntas: 1 / 40,
  sqft: 1 / 43560,
  sqm: 1 / 4046.86,
  cents: 1 / 100,
  hectares: 2.47105,
};

export const toAcres = (value: number, unit: string): number => {
  const factor = AREA_CONVERSIONS[unit] ?? 1;
  return parseFloat((value * factor).toFixed(4));
};

export const calculateCost = (serviceId: string, areaInAcres: number) => {
  const rate = getService(serviceId)?.ratePerAcre ?? 0;
  const base = parseFloat((rate * areaInAcres).toFixed(2));
  const gst = parseFloat((base * GST_RATE).toFixed(2));
  return { base, gst, total: parseFloat((base + gst).toFixed(2)) };
};

export const generateBookingId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i += 1) id += chars[Math.floor(Math.random() * chars.length)];
  return `SKY-${id}`;
};
