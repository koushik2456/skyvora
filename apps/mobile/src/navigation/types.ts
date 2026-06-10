import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  OTP: { phone: string; mode: 'signin' | 'signup'; name?: string };
};

export type BookingStackParamList = {
  NewBooking: { presetServiceId?: string } | undefined;
  Payment: { bookingId: string };
  PaymentSuccess: { bookingId: string };
};

export type AppTabParamList = {
  Home: undefined;
  Bookings: undefined;
  NewBookingTab: undefined;
  Reports: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
  BookingFlow: NavigatorScreenParams<BookingStackParamList>;
  BookingDetail: { bookingId: string };
  ReportDetail: { bookingId: string };
};
