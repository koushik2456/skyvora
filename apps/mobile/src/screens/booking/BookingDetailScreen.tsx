import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, Download, MessageCircle } from 'lucide-react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '@/components/common/Header';
import ServiceIcon from '@/components/ui/ServiceIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import Timeline from '@/components/ui/Timeline';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { getServiceById, TIME_SLOTS } from '@/constants/services';
import { useBookingsRepo } from '@/store/bookingsRepo';
import { formatINR } from '@/utils/pricing';
import { formatDateLong } from '@/utils/date';
import type { BookingStatus } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'BookingDetail'>;

const TIMELINE_ORDER: BookingStatus[] = [
  'PENDING_PAYMENT',
  'PAYMENT_CONFIRMED',
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
];

const TIMELINE_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Booking Placed',
  PAYMENT_CONFIRMED: 'Payment Confirmed',
  ASSIGNED: 'Team Assigned',
  IN_PROGRESS: 'Service In Progress',
  COMPLETED: 'Completed',
};

export default function BookingDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const booking = useBookingsRepo((s) => s.getById(params.bookingId));
  const cancelBooking = useBookingsRepo((s) => s.cancelBooking);

  if (!booking) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Booking" onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>Booking not found.</Text>
      </SafeAreaView>
    );
  }

  const svc = getServiceById(booking.serviceId);
  const slotLabel = TIME_SLOTS.find((s) => s.value === booking.preferredSlot)?.label ?? '';
  const currentIndex = TIMELINE_ORDER.indexOf(booking.status);
  const isCancelled = booking.status === 'CANCELLED';

  const steps = TIMELINE_ORDER.map((s, i) => ({
    label: TIMELINE_LABELS[s],
    done: !isCancelled && i <= currentIndex,
    active: !isCancelled && i === currentIndex,
  }));

  const onCancel = () =>
    Alert.alert('Cancel booking?', 'This action cannot be undone.', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Cancel Booking', style: 'destructive', onPress: () => cancelBooking(booking.bookingId) },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={booking.bookingId} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={[styles.iconWrap, { backgroundColor: `${svc?.color}1A` }]}>
            <ServiceIcon name={svc?.icon ?? 'leaf'} color={svc?.color} size={30} />
          </View>
          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          <StatusBadge status={booking.status} />
        </View>

        <Section title="Location Details">
          <Row label="State" value={booking.state} />
          <Row label="District" value={booking.district} />
          <Row label="Mandal" value={booking.mandal} />
          <Row label="Village" value={booking.village} />
          <Row label="Farmer" value={booking.farmerName} />
        </Section>

        <Section title="Crop & Area">
          <Row label="Crop" value={booking.cropType} />
          <Row label="Area" value={`${booking.areaValue} ${booking.areaUnit} (${booking.areaInAcres} acres)`} />
        </Section>

        <Section title="Service & Schedule">
          <Row label="Service" value={booking.serviceName} />
          <Row label="Date" value={formatDateLong(booking.preferredDate)} />
          <Row label="Slot" value={slotLabel} />
          {booking.specialInstructions ? <Row label="Notes" value={booking.specialInstructions} /> : null}
        </Section>

        {booking.assignedAgent ? (
          <Section title="Team Assigned">
            <Row label="Agent" value={booking.assignedAgent.name} />
            <Row label="Phone" value={booking.assignedAgent.phone} />
          </Section>
        ) : null}

        <Section title="Payment">
          <Row label="Base" value={formatINR(booking.baseAmount)} />
          <Row label="GST (18%)" value={formatINR(booking.gstAmount)} />
          <Row label="Total" value={formatINR(booking.totalAmount)} bold />
          <Row label="Status" value={booking.paymentStatus.toUpperCase()} />
        </Section>

        <Section title="Status Timeline">
          <Timeline steps={steps} />
        </Section>

        <View style={styles.actions}>
          {booking.status === 'PENDING_PAYMENT' ? (
            <AnimatedButton label="Cancel Booking" variant="danger" shimmer={false} onPress={onCancel} />
          ) : null}
          {booking.status === 'COMPLETED' ? (
            <AnimatedButton
              label="Download Report"
              icon={<Download size={18} color={Colors.white} />}
              onPress={() => Alert.alert('Report', 'Report download will open the PDF viewer.')}
            />
          ) : null}
          <View style={styles.supportRow}>
            <AnimatedButton
              label="Call"
              variant="outline"
              shimmer={false}
              style={styles.supportBtn}
              icon={<Phone size={16} color={Colors.primary} />}
              onPress={() => Linking.openURL('tel:+919876543210')}
            />
            <AnimatedButton
              label="WhatsApp"
              variant="outline"
              shimmer={false}
              style={styles.supportBtn}
              icon={<MessageCircle size={16} color={Colors.primary} />}
              onPress={() => Linking.openURL('https://wa.me/919876543210')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  missing: { textAlign: 'center', marginTop: Spacing.xl, fontFamily: Typography.fontBody, color: Colors.textMuted },
  scroll: { padding: Spacing.lg, gap: Spacing.base, paddingBottom: Spacing['3xl'] },
  hero: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.xl, color: Colors.textPrimary },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  sectionTitle: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  sectionBody: { gap: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.base },
  rowLabel: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  rowValue: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.sm, color: Colors.textPrimary, flexShrink: 1, textAlign: 'right' },
  rowValueBold: { fontFamily: Typography.fontDisplaySemi, color: Colors.primary },
  actions: { gap: Spacing.md, marginTop: Spacing.sm },
  supportRow: { flexDirection: 'row', gap: Spacing.md },
  supportBtn: { flex: 1 },
});
