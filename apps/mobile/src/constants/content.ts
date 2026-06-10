/** Premium placeholder content for the home dashboard. */

export interface DroneSpec {
  id: string;
  name: string;
  role: string;
  payload: string;
  coverage: string;
  battery: string;
  accent: string;
}

export const DRONE_FLEET: DroneSpec[] = [
  {
    id: 'sky-x10',
    name: 'Skyvora X10',
    role: 'Precision Sprayer',
    payload: '10 L tank',
    coverage: '14 acres/hr',
    battery: '28 min flight',
    accent: '#2563EB',
  },
  {
    id: 'sky-a16',
    name: 'Skyvora A16',
    role: 'Heavy-Lift Agri Drone',
    payload: '16 L tank',
    coverage: '20 acres/hr',
    battery: '24 min flight',
    accent: '#F97316',
  },
  {
    id: 'sky-s2',
    name: 'Skyvora S2 Scout',
    role: 'Survey & Mapping',
    payload: '4K multispectral',
    coverage: '60 acres/hr',
    battery: '38 min flight',
    accent: '#38BDF8',
  },
];

export interface Offer {
  id: string;
  title: string;
  body: string;
  tag: string;
  colors: [string, string];
}

export const OFFERS: Offer[] = [
  {
    id: 'monsoon10',
    title: 'Monsoon Special',
    body: '10% off all pesticide spraying booked this season.',
    tag: 'LIMITED TIME',
    colors: ['#1D4ED8', '#3B82F6'],
  },
  {
    id: 'firstfly',
    title: 'First Flight Free Survey',
    body: 'Free land survey with your first spraying booking.',
    tag: 'NEW FARMERS',
    colors: ['#C2410C', '#F97316'],
  },
  {
    id: 'bundle',
    title: 'Soil + Fertilizer Bundle',
    body: 'Book soil testing and get the fertilizer report at half price.',
    tag: 'BUNDLE & SAVE',
    colors: ['#0E7490', '#22D3EE'],
  },
];

export interface UpdateItem {
  id: string;
  title: string;
  body: string;
  date: string;
  tag: string;
}

export const UPDATES: UpdateItem[] = [
  {
    id: 'u1',
    title: 'Skyvora expands to all of Andhra Pradesh',
    body: 'Every district, mandal and village in AP is now serviceable alongside Telangana.',
    date: 'Jun 2026',
    tag: 'Coverage',
  },
  {
    id: 'u2',
    title: 'New X10 fleet joins the skies',
    body: 'Faster turnarounds with our upgraded 10-litre precision sprayers.',
    date: 'May 2026',
    tag: 'Fleet',
  },
  {
    id: 'u3',
    title: 'Soil health reports go digital',
    body: 'Get lab-grade soil analysis with fertilizer recommendations in the app.',
    date: 'Apr 2026',
    tag: 'Product',
  },
];

export const COMPANY = {
  name: 'Skyvora Agri Tech Pvt. Ltd.',
  tagline: 'Precision agriculture, delivered from the sky.',
  about:
    'Skyvora brings drone-powered spraying, surveying and crop intelligence to farms across Telangana and Andhra Pradesh — saving water, chemicals and time on every acre.',
  phone: '+91 90000 12345',
  email: 'support@skyvora.in',
  address: 'Plot 42, T-Hub, Madhapur, Hyderabad 500081',
  stats: {
    acresServiced: 48200,
    deliveries: 12600,
    farmers: 7400,
  },
} as const;
