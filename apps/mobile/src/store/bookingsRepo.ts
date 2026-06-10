import { create } from 'zustand';
import type { Booking, BookingStatus } from '@/types';
import { getServiceById } from '@/constants/services';
import { calculateBookingCost } from '@/utils/pricing';
import { generateBookingId } from '@/utils/validators';

/**
 * Local in-memory bookings repository. Mirrors the backend `bookings`
 * collection so the app is fully navigable without a live Firebase backend.
 * Swap these methods for React Query calls to `/api/bookings` when wiring the API.
 */

interface NewBookingInput {
  userId: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  farmerName: string;
  cropType: string;
  areaValue: number;
  areaUnit: Booking['areaUnit'];
  areaInAcres: number;
  serviceId: string;
  preferredDate: string;
  preferredSlot: Booking['preferredSlot'];
  specialInstructions?: string;
}

interface BookingsRepo {
  bookings: Booking[];
  createBooking: (input: NewBookingInput) => Booking;
  markPaid: (bookingId: string, paymentId: string) => void;
  cancelBooking: (bookingId: string) => void;
  getById: (bookingId: string) => Booking | undefined;
  setStatus: (bookingId: string, status: BookingStatus) => void;
}

interface SeedSpec {
  bookingId: string;
  serviceId: string;
  district: string;
  mandal: string;
  village: string;
  state: string;
  farmerName: string;
  cropType: string;
  acres: number;
  daysFromNow: number;
  slot: Booking['preferredSlot'];
  status: BookingStatus;
  agent?: { name: string; phone: string };
  reportUrl?: string;
}

const SEEDS: SeedSpec[] = [
  {
    bookingId: 'SKY-7F2K4A',
    serviceId: 'spray_pesticide',
    state: 'Telangana',
    district: 'Khammam',
    mandal: 'Yellandu',
    village: 'Komararam',
    farmerName: 'Ravi Kumar',
    cropType: 'Cotton',
    acres: 3.5,
    daysFromNow: 1,
    slot: 'morning',
    status: 'IN_PROGRESS',
    agent: { name: 'Suresh Reddy', phone: '+919876543210' },
  },
  {
    bookingId: 'SKY-9M3X1B',
    serviceId: 'spray_fertilizer',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    mandal: 'Tenali',
    village: 'Angalakuduru',
    farmerName: 'Ravi Kumar',
    cropType: 'Chilli',
    acres: 5,
    daysFromNow: 2,
    slot: 'afternoon',
    status: 'ASSIGNED',
    agent: { name: 'Lakshmi Prasad', phone: '+919812345670' },
  },
  {
    bookingId: 'SKY-4D8N2C',
    serviceId: 'soil_testing',
    state: 'Telangana',
    district: 'Warangal',
    mandal: 'Wardhannapet',
    village: 'Vanchanagiri',
    farmerName: 'Ravi Kumar',
    cropType: 'Rice',
    acres: 2,
    daysFromNow: -6,
    slot: 'morning',
    status: 'COMPLETED',
    reportUrl: 'reports/SKY-4D8N2C.pdf',
  },
  {
    bookingId: 'SKY-1A5T9D',
    serviceId: 'land_survey',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    mandal: 'Gudivada',
    village: 'Dokiparru',
    farmerName: 'Ravi Kumar',
    cropType: 'Sugarcane',
    acres: 8,
    daysFromNow: -14,
    slot: 'evening',
    status: 'COMPLETED',
    reportUrl: 'reports/SKY-1A5T9D.pdf',
  },
  {
    bookingId: 'SKY-6P0R3E',
    serviceId: 'crop_management',
    state: 'Telangana',
    district: 'Nalgonda',
    mandal: 'Miryalaguda',
    village: 'Tungapadu',
    farmerName: 'Ravi Kumar',
    cropType: 'Maize',
    acres: 4,
    daysFromNow: -3,
    slot: 'afternoon',
    status: 'CANCELLED',
  },
];

const seedDemo = (): Booking[] =>
  SEEDS.map((s) => {
    const svc = getServiceById(s.serviceId)!;
    const cost = calculateBookingCost(svc.id, s.acres);
    const created = new Date(
      Date.now() + Math.min(s.daysFromNow, 0) * 86400000 - 86400000
    ).toISOString();
    return {
      bookingId: s.bookingId,
      userId: 'demo',
      state: s.state,
      district: s.district,
      mandal: s.mandal,
      village: s.village,
      farmerName: s.farmerName,
      cropType: s.cropType,
      areaValue: s.acres,
      areaUnit: 'acres',
      areaInAcres: s.acres,
      serviceId: svc.id,
      serviceName: svc.name,
      ratePerAcre: svc.ratePerAcre,
      preferredDate: new Date(Date.now() + s.daysFromNow * 86400000)
        .toISOString()
        .split('T')[0],
      preferredSlot: s.slot,
      baseAmount: cost.base,
      gstAmount: cost.gst,
      totalAmount: cost.total,
      paymentStatus: s.status === 'CANCELLED' ? 'refunded' : 'paid',
      status: s.status,
      assignedAgent: s.agent,
      reportUrl: s.reportUrl,
      createdAt: created,
      updatedAt: created,
    };
  });

export const useBookingsRepo = create<BookingsRepo>((set, get) => ({
  bookings: seedDemo(),
  createBooking: (input) => {
    const svc = getServiceById(input.serviceId)!;
    const cost = calculateBookingCost(input.serviceId, input.areaInAcres);
    const now = new Date().toISOString();
    const booking: Booking = {
      bookingId: generateBookingId(),
      userId: input.userId,
      state: input.state,
      district: input.district,
      mandal: input.mandal,
      village: input.village,
      farmerName: input.farmerName,
      cropType: input.cropType,
      areaValue: input.areaValue,
      areaUnit: input.areaUnit,
      areaInAcres: input.areaInAcres,
      serviceId: input.serviceId,
      serviceName: svc.name,
      ratePerAcre: svc.ratePerAcre,
      preferredDate: input.preferredDate,
      preferredSlot: input.preferredSlot,
      specialInstructions: input.specialInstructions,
      baseAmount: cost.base,
      gstAmount: cost.gst,
      totalAmount: cost.total,
      paymentStatus: 'pending',
      status: 'PENDING_PAYMENT',
      createdAt: now,
      updatedAt: now,
    };
    set({ bookings: [booking, ...get().bookings] });
    return booking;
  },
  markPaid: (bookingId, paymentId) =>
    set({
      bookings: get().bookings.map((b) =>
        b.bookingId === bookingId
          ? {
              ...b,
              paymentStatus: 'paid',
              razorpayPaymentId: paymentId,
              status: 'PAYMENT_CONFIRMED',
              updatedAt: new Date().toISOString(),
            }
          : b
      ),
    }),
  cancelBooking: (bookingId) =>
    set({
      bookings: get().bookings.map((b) =>
        b.bookingId === bookingId
          ? { ...b, status: 'CANCELLED', updatedAt: new Date().toISOString() }
          : b
      ),
    }),
  setStatus: (bookingId, status) =>
    set({
      bookings: get().bookings.map((b) =>
        b.bookingId === bookingId
          ? { ...b, status, updatedAt: new Date().toISOString() }
          : b
      ),
    }),
  getById: (bookingId) => get().bookings.find((b) => b.bookingId === bookingId),
}));
