import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from '@/components/ui/Motion';
import { CheckCircle2 } from 'lucide-react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
  CommonActions,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShaderAnimation } from '@/components/ui/ShaderAnimation';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import { useLocationStore } from '@/store/locationStore';
import { useBookingsRepo } from '@/store/bookingsRepo';
import { TIME_SLOTS } from '@/constants/services';
import { formatDate } from '@/utils/date';
import { formatBookingId } from '@/utils/validators';
import type { BookingStackParamList, RootStackParamList } from '@/navigation/types';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<BookingStackParamList, 'PaymentSuccess'>;

export default function PaymentSuccessScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const resetBooking = useBookingStore((s) => s.resetBooking);
  const resetLocation = useLocationStore((s) => s.reset);
  const booking = useBookingsRepo((s) => s.getById(params.bookingId));

  const goHome = () => {
    resetBooking();
    resetLocation();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'App' }],
      })
    );
  };

  const viewBooking = () => {
    resetBooking();
    resetLocation();
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'App' },
          { name: 'BookingDetail', params: { bookingId: params.bookingId } },
        ],
      })
    );
  };

  useEffect(() => {
    const timer = setTimeout(goHome, 8000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slotLabel =
    TIME_SLOTS.find((s) => s.value === booking?.preferredSlot)?.label ?? '';

  return (
    <View style={styles.container}>
      <ShaderAnimation />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 200 }}
          style={styles.successCard}
        >
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 400 }}
          >
            <CheckCircle2 size={80} color={Colors.success} />
          </MotiView>

          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successId}>{formatBookingId(params.bookingId)}</Text>

          {booking ? (
            <View style={styles.successDetail}>
              <Text style={styles.detailLine}>{booking.serviceName}</Text>
              <Text style={styles.detailLine}>
                {booking.village}, {booking.district}
              </Text>
              <Text style={styles.detailLine}>
                {formatDate(booking.preferredDate)} · {slotLabel}
              </Text>
              <Text style={styles.detailAmount}>
                ₹{booking.totalAmount.toLocaleString('en-IN')} Paid
              </Text>
            </View>
          ) : null}

          <AnimatedButton label="View Booking" onPress={viewBooking} style={styles.btn} />
          <AnimatedButton
            label="Back to Home"
            variant="outline"
            onDark
            shimmer={false}
            onPress={goHome}
            style={styles.btn}
          />
        </MotiView>

        {/* Confetti-like particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <MotiView
            key={i}
            from={{ opacity: 1, translateY: -20, translateX: (i - 6) * 24 }}
            animate={{ opacity: 0, translateY: 400 }}
            transition={{ loop: true, duration: 2000 + i * 100, delay: i * 80 }}
            style={[
              styles.confetti,
              {
                left: width / 2 + (i - 6) * 20,
                backgroundColor: i % 3 === 0 ? Colors.primary : i % 3 === 1 ? Colors.accent : Colors.white,
              },
            ]}
          />
        ))}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.skyTop },
  safe: { flex: 1, justifyContent: 'center', padding: Spacing.lg },
  successCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius['2xl'],
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  successTitle: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  successId: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  successDetail: {
    alignItems: 'center',
    gap: 4,
    marginVertical: Spacing.sm,
  },
  detailLine: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  detailAmount: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.lg,
    color: Colors.primary,
    marginTop: Spacing.sm,
  },
  btn: { width: '100%', marginTop: Spacing.sm },
  confetti: {
    position: 'absolute',
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 2,
  },
});
