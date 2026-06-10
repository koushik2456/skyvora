import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from '@/components/ui/Motion';
import { CreditCard, Smartphone, Building2, ShieldCheck, Check } from 'lucide-react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '@/components/common/Header';
import AnimatedButton from '@/components/ui/AnimatedButton';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useBookingsRepo } from '@/store/bookingsRepo';
import { formatINR } from '@/utils/pricing';
import type { BookingStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<BookingStackParamList, 'Payment'>;
type Rt = RouteProp<BookingStackParamList, 'Payment'>;

const METHODS = [
  { id: 'upi', label: 'UPI', sub: 'GPay, PhonePe, Paytm', icon: Smartphone },
  { id: 'card', label: 'Card', sub: 'Credit / Debit', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks', icon: Building2 },
];

export default function PaymentScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const booking = useBookingsRepo((s) => s.getById(params.bookingId));
  const markPaid = useBookingsRepo((s) => s.markPaid);
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  const pay = () => {
    setLoading(true);
    // Mock Razorpay checkout + signature verification
    setTimeout(() => {
      markPaid(booking.bookingId, `pay_${Date.now()}`);
      setLoading(false);
      navigation.replace('PaymentSuccess', { bookingId: booking.bookingId });
    }, 1400);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Payment" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>{booking.serviceName}</Text>
          <Text style={styles.summaryMeta}>
            {booking.areaInAcres} acres · {booking.village}, {booking.district}
          </Text>
          <View style={styles.divider} />
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Amount Payable</Text>
            <Text style={styles.amount}>{formatINR(booking.totalAmount)}</Text>
          </View>
        </View>

        <Text style={styles.section}>Choose Payment Method</Text>
        {METHODS.map((m) => {
          const active = method === m.id;
          const Icon = m.icon;
          return (
            <Pressable key={m.id} onPress={() => setMethod(m.id)}>
              <MotiView
                animate={{ borderColor: active ? Colors.primary : Colors.border }}
                style={styles.method}
              >
                <View style={[styles.methodIcon, active && styles.methodIconActive]}>
                  <Icon size={20} color={active ? Colors.white : Colors.textSecondary} />
                </View>
                <View style={styles.methodText}>
                  <Text style={styles.methodLabel}>{m.label}</Text>
                  <Text style={styles.methodSub}>{m.sub}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active ? <Check size={13} color={Colors.white} strokeWidth={3} /> : null}
                </View>
              </MotiView>
            </Pressable>
          );
        })}

        <View style={styles.secureRow}>
          <ShieldCheck size={16} color={Colors.success} />
          <Text style={styles.secureText}>Secured by Razorpay · 100% safe payments</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AnimatedButton label={`Pay ${formatINR(booking.totalAmount)}`} onPress={pay} />
      </View>
      <LoadingOverlay visible={loading} message="Processing payment..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.base },
  summary: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  summaryLabel: { fontFamily: Typography.fontDisplaySemi, fontSize: Typography.sizes.md, color: Colors.textPrimary },
  summaryMeta: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.base },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountLabel: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.base, color: Colors.textSecondary },
  amount: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.xl, color: Colors.primary },
  section: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: Spacing.sm },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    padding: Spacing.base,
  },
  methodIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconActive: { backgroundColor: Colors.primary },
  methodText: { flex: 1 },
  methodLabel: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  methodSub: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  secureRow: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: Spacing.base },
  secureText: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textSecondary },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
