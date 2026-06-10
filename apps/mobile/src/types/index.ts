export type AreaUnit = 'acres' | 'guntas' | 'sqft' | 'sqm' | 'cents' | 'hectares';

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export type BookingStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Village {
  id: string;
  name: string;
}

export interface Mandal {
  id: string;
  name: string;
  villages: Village[];
}

export interface District {
  id: string;
  name: string;
  mandals: Mandal[];
}

export interface State {
  id: string;
  name: string;
  districts: District[];
}

export interface LocationData {
  states: State[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  ratePerAcre: number;
  unit: string;
  color: string;
  estimatedDuration: string;
}

export interface CostBreakdown {
  base: number;
  gst: number;
  total: number;
}

export interface User {
  uid: string;
  phone: string;
  name: string;
  language: 'en' | 'te' | 'hi';
  createdAt?: string;
}

export interface Booking {
  bookingId: string;
  userId: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  farmerName: string;
  cropType: string;
  areaValue: number;
  areaUnit: AreaUnit;
  areaInAcres: number;
  serviceId: string;
  serviceName: string;
  ratePerAcre: number;
  preferredDate: string;
  preferredSlot: TimeSlot;
  specialInstructions?: string;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: BookingStatus;
  assignedAgent?: {
    name: string;
    phone: string;
  };
  reportUrl?: string;
  createdAt: string;
  updatedAt: string;
}
