import { SERVICE_RATES } from '@/constants/services';
import type { CostBreakdown } from '@/types';

export const GST_RATE = 0.18;

export function calculateBookingCost(
  serviceId: string,
  areaInAcres: number
): CostBreakdown {
  const rate = SERVICE_RATES[serviceId] ?? 0;
  const base = parseFloat((rate * areaInAcres).toFixed(2));
  const gst = parseFloat((base * GST_RATE).toFixed(2));
  return { base, gst, total: parseFloat((base + gst).toFixed(2)) };
}

export const formatINR = (amount: number): string =>
  '₹' +
  amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatINRShort = (amount: number): string =>
  '₹' + Math.round(amount).toLocaleString('en-IN');
