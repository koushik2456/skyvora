import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewBookingScreen from '@/screens/booking/NewBookingScreen';
import PaymentScreen from '@/screens/payment/PaymentScreen';
import PaymentSuccessScreen from '@/screens/payment/PaymentSuccessScreen';
import type { BookingStackParamList } from './types';

const Stack = createNativeStackNavigator<BookingStackParamList>();

export default function BookingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="NewBooking" component={NewBookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
