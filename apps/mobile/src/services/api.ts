import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  'https://us-central1-skyvora-app.cloudfunctions.net/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().idToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CreateBookingPayload {
  state: string;
  district: string;
  mandal: string;
  village: string;
  farmerName: string;
  cropType: string;
  areaValue: number;
  areaUnit: string;
  serviceId: string;
  preferredDate: string;
  preferredSlot: string;
  specialInstructions?: string;
}

export const BookingsApi = {
  create: (payload: CreateBookingPayload) => api.post('/bookings', payload).then((r) => r.data),
  list: (status?: string) =>
    api.get('/bookings', { params: { status } }).then((r) => r.data.bookings),
  detail: (bookingId: string) => api.get(`/bookings/${bookingId}`).then((r) => r.data),
  cancel: (bookingId: string) => api.patch(`/bookings/${bookingId}/cancel`).then((r) => r.data),
};

export const PaymentsApi = {
  verify: (payload: {
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => api.post('/payments/verify', payload).then((r) => r.data),
};

export const ReportsApi = {
  list: () => api.get('/reports').then((r) => r.data.reports),
  url: (bookingId: string) => api.get(`/reports/${bookingId}`).then((r) => r.data.url),
};
