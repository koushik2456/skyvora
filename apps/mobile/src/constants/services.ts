import type { Service } from '@/types';

export const SERVICES: Service[] = [
  {
    id: 'spray_pesticide',
    name: 'Spray Pesticide',
    description: 'Drone-assisted pesticide spraying for precise pest control',
    icon: 'spray-can',
    ratePerAcre: 450,
    unit: 'acre',
    color: '#E74C3C',
    estimatedDuration: '1-2 hours/acre',
  },
  {
    id: 'spray_fertilizer',
    name: 'Spray Fertilizer',
    description: 'Uniform liquid fertilizer application via drone',
    icon: 'leaf',
    ratePerAcre: 450,
    unit: 'acre',
    color: '#27AE60',
    estimatedDuration: '1-2 hours/acre',
  },
  {
    id: 'crop_management',
    name: 'Crop Management',
    description: 'Expert advisory and monitoring for optimal crop yield',
    icon: 'sprout',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#2ECC71',
    estimatedDuration: '2-3 hours/visit',
  },
  {
    id: 'land_survey',
    name: 'Land Survey',
    description: 'Aerial drone survey with precise acreage mapping',
    icon: 'map',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#3498DB',
    estimatedDuration: '1 hour/5 acres',
  },
  {
    id: 'water_management',
    name: 'Water Management',
    description: 'Irrigation planning and water usage optimization',
    icon: 'droplets',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#1ABC9C',
    estimatedDuration: '2-4 hours/farm',
  },
  {
    id: 'soil_testing',
    name: 'Land & Soil Testing',
    description: 'Comprehensive soil health analysis and report',
    icon: 'flask-conical',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#8B4513',
    estimatedDuration: '3-5 days (lab analysis)',
  },
  {
    id: 'fertilizer_report',
    name: 'Fertilizer Requirement Report',
    description: 'Personalized fertilizer plan based on soil and crop data',
    icon: 'file-chart-column',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#F39C12',
    estimatedDuration: '2-3 days (report delivery)',
  },
];

export const SERVICE_RATES: Record<string, number> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s.ratePerAcre])
);

export const getServiceById = (id: string | null): Service | undefined =>
  SERVICES.find((s) => s.id === id);

export const CROP_TYPES = [
  'Rice',
  'Wheat',
  'Cotton',
  'Sugarcane',
  'Maize',
  'Soybean',
  'Groundnut',
  'Chilli',
  'Turmeric',
  'Onion',
  'Tomato',
  'Mango',
  'Banana',
  'Coconut',
  'Other',
];

export const AREA_UNITS: { label: string; value: import('@/types').AreaUnit }[] = [
  { label: 'Acres', value: 'acres' },
  { label: 'Guntas', value: 'guntas' },
  { label: 'Sq.ft', value: 'sqft' },
  { label: 'Sq.m', value: 'sqm' },
  { label: 'Cents', value: 'cents' },
  { label: 'Hectares', value: 'hectares' },
];

export const TIME_SLOTS: { label: string; sub: string; value: import('@/types').TimeSlot }[] = [
  { label: 'Morning', sub: '6:00 AM – 11:00 AM', value: 'morning' },
  { label: 'Afternoon', sub: '11:00 AM – 2:00 PM', value: 'afternoon' },
  { label: 'Evening', sub: '2:00 PM – 5:00 PM', value: 'evening' },
];
