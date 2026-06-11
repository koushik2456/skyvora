import type { TranslationKey } from './strings';
import type { AreaUnit, BookingStatus, TimeSlot } from '@/types';

export const CROP_KEY_MAP: Record<string, TranslationKey> = {
  Rice: 'crop_Rice',
  Wheat: 'crop_Wheat',
  Cotton: 'crop_Cotton',
  Sugarcane: 'crop_Sugarcane',
  Maize: 'crop_Maize',
  Soybean: 'crop_Soybean',
  Groundnut: 'crop_Groundnut',
  Chilli: 'crop_Chilli',
  Turmeric: 'crop_Turmeric',
  Onion: 'crop_Onion',
  Tomato: 'crop_Tomato',
  Mango: 'crop_Mango',
  Banana: 'crop_Banana',
  Coconut: 'crop_Coconut',
  Other: 'crop_Other',
};

export const AREA_UNIT_KEYS: Record<AreaUnit, TranslationKey> = {
  acres: 'unit_acres',
  guntas: 'unit_guntas',
  sqft: 'unit_sqft',
  sqm: 'unit_sqm',
  cents: 'unit_cents',
  hectares: 'unit_hectares',
};

export const SLOT_KEYS: Record<TimeSlot, { label: TranslationKey; sub: TranslationKey }> = {
  morning: { label: 'slot_morning', sub: 'slot_morning_sub' },
  afternoon: { label: 'slot_afternoon', sub: 'slot_afternoon_sub' },
  evening: { label: 'slot_evening', sub: 'slot_evening_sub' },
};

export const TIMELINE_STATUS_KEYS: Record<BookingStatus, TranslationKey | null> = {
  DRAFT: null,
  PENDING_PAYMENT: 'timelineBookingPlaced',
  PAYMENT_CONFIRMED: 'timelinePaymentConfirmed',
  PAYMENT_FAILED: null,
  ASSIGNED: 'timelineTeamAssigned',
  IN_PROGRESS: 'timelineInProgress',
  COMPLETED: 'timelineCompleted',
  CANCELLED: null,
};

export const PAYMENT_STATUS_KEYS: Record<string, TranslationKey> = {
  pending: 'paymentStatusPending',
  paid: 'paymentStatusPaid',
  failed: 'paymentStatusFailed',
  refunded: 'paymentStatusRefunded',
};

export const SOIL_METRIC_KEYS = [
  'soilNitrogen',
  'soilPhosphorus',
  'soilPotassium',
  'soilPh',
  'soilMoisture',
  'soilOrganicCarbon',
] as const;
