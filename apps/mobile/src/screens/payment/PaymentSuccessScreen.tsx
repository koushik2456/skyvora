import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from '@/components/ui/Motion';
import {
  useNavigation,
  useRoute,
  type RouteProp,
  CommonActions,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SuccessBlast from '@/components/ui/SuccessBlast';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import { useLocationStore } from '@/store/locationStore';
import type { BookingStackParamList, RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<BookingStackParamList, 'PaymentSuccess'>;

export default function PaymentSuccessScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const resetBooking = useBookingStore((s) => s.resetBooking);
  const resetLocation = useLocationStore((s) => s.reset);

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
    const t = setTimeout(goHome, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <SuccessBlast />
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', delay: 500 }}
          style={styles.textBlock}
        >
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.sub}>Your booking has been confirmed.</Text>
          <View style={styles.idChip}>
            <Text style={styles.idLabel}>Booking ID</Text>
            <Text style={styles.idValue}>{params.bookingId}</Text>
          </View>
        </MotiView>
      </View>

      <View style={styles.footer}>
        <AnimatedButton label="View Booking" onPress={viewBooking} />
        <AnimatedButton label="Go Home" variant="outline" shimmer={false} onPress={goHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing['2xl'] },
  textBlock: { alignItems: 'center', gap: Spacing.sm },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes['2xl'], color: Colors.textPrimary },
  sub: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.base, color: Colors.textSecondary },
  idChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    marginTop: Spacing.md,
  },
  idLabel: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  idValue: { fontFamily: Typography.fontDisplaySemi, fontSize: Typography.sizes.base, color: Colors.primary },
  footer: { padding: Spacing.lg, gap: Spacing.md },
});
