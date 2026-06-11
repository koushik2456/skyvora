import {
  Droplets,
  FileBarChart,
  FlaskConical,
  Leaf,
  Map,
  Sprout,
  Waves,
  type LucideIcon,
} from 'lucide-react-native';
import { Images } from '@/constants/images';
import type { Service } from '@/types';

export interface ServiceWithIcon extends Service {
  image: string;
  Icon: LucideIcon;
}

export const SERVICES: ServiceWithIcon[] = [
  {
    id: 'spray_pesticide',
    name: 'Spray Pesticide',
    description: 'Precise drone pesticide application',
    icon: 'spray-can',
    ratePerAcre: 450,
    unit: 'acre',
    color: '#E74C3C',
    estimatedDuration: '1-2 hours/acre',
    image: Images.service_pesticide,
    Icon: Droplets,
  },
  {
    id: 'spray_fertilizer',
    name: 'Spray Fertilizer',
    description: 'Uniform liquid fertilizer from above',
    icon: 'leaf',
    ratePerAcre: 450,
    unit: 'acre',
    color: '#27AE60',
    estimatedDuration: '1-2 hours/acre',
    image: Images.service_fertilizer,
    Icon: Leaf,
  },
  {
    id: 'crop_management',
    name: 'Crop Management',
    description: 'Expert monitoring and advisory',
    icon: 'sprout',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#2ECC71',
    estimatedDuration: '2-3 hours/visit',
    image: Images.service_crop_mgmt,
    Icon: Sprout,
  },
  {
    id: 'land_survey',
    name: 'Land Survey',
    description: 'Accurate aerial mapping',
    icon: 'map',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#3498DB',
    estimatedDuration: '1 hour/5 acres',
    image: Images.service_land_survey,
    Icon: Map,
  },
  {
    id: 'water_management',
    name: 'Water Management',
    description: 'Irrigation planning & optimization',
    icon: 'droplets',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#1ABC9C',
    estimatedDuration: '2-4 hours/farm',
    image: Images.service_water_mgmt,
    Icon: Waves,
  },
  {
    id: 'soil_testing',
    name: 'Land & Soil Testing',
    description: 'Complete soil health analysis',
    icon: 'flask-conical',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#8B4513',
    estimatedDuration: '3-5 days (lab analysis)',
    image: Images.service_soil_test,
    Icon: FlaskConical,
  },
  {
    id: 'fertilizer_report',
    name: 'Fertilizer Requirement Report',
    description: 'Custom fertilizer plan for your land',
    icon: 'file-chart-column',
    ratePerAcre: 350,
    unit: 'acre',
    color: '#F39C12',
    estimatedDuration: '2-3 days (report delivery)',
    image: Images.service_fert_report,
    Icon: FileBarChart,
  },
];

export const SERVICE_IMAGES: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s.image])
);

export const SERVICE_RATES: Record<string, number> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s.ratePerAcre])
);

export const getServiceById = (id: string | null): ServiceWithIcon | undefined =>
  SERVICES.find((s) => s.id === id);

export const CROP_TYPE_LABELS = [
  'Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Soybean',
  'Groundnut', 'Chilli', 'Turmeric', 'Onion', 'Tomato', 'Mango',
  'Banana', 'Coconut', 'Other',
] as const;

export const CROP_TYPES = [
  { id: 'rice', label: 'Rice', emoji: '🌾' },
  { id: 'wheat', label: 'Wheat', emoji: '🌾' },
  { id: 'cotton', label: 'Cotton', emoji: '🪴' },
  { id: 'sugarcane', label: 'Sugarcane', emoji: '🌿' },
  { id: 'maize', label: 'Maize', emoji: '🌽' },
  { id: 'soybean', label: 'Soybean', emoji: '🫘' },
  { id: 'groundnut', label: 'Groundnut', emoji: '🥜' },
  { id: 'chilli', label: 'Chilli', emoji: '🌶️' },
  { id: 'turmeric', label: 'Turmeric', emoji: '🟡' },
  { id: 'onion', label: 'Onion', emoji: '🧅' },
  { id: 'tomato', label: 'Tomato', emoji: '🍅' },
  { id: 'mango', label: 'Mango', emoji: '🥭' },
  { id: 'banana', label: 'Banana', emoji: '🍌' },
  { id: 'coconut', label: 'Coconut', emoji: '🥥' },
  { id: 'other', label: 'Other', emoji: '🌱' },
];

export const AREA_UNITS: { label: string; value: import('@/types').AreaUnit }[] = [
  { label: 'Acres', value: 'acres' },
  { label: 'Guntas', value: 'guntas' },
  { label: 'Sq.ft', value: 'sqft' },
  { label: 'Sq.m', value: 'sqm' },
  { label: 'Cents', value: 'cents' },
  { label: 'Hectares', value: 'hectares' },
];

export const TIME_SLOTS: {
  label: string;
  sub: string;
  value: import('@/types').TimeSlot;
  icon: string;
}[] = [
  { label: 'Morning', sub: '6 AM – 11 AM', value: 'morning', icon: '🌅' },
  { label: 'Afternoon', sub: '11 AM – 2 PM', value: 'afternoon', icon: '☀️' },
  { label: 'Evening', sub: '2 PM – 5 PM', value: 'evening', icon: '🌤️' },
];
