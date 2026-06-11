import React from 'react';
import { Alert, ImageBackground, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, Download, MessageCircle } from 'lucide-react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '@/components/common/Header';
import StatusBadge from '@/components/ui/StatusBadge';
import Timeline from '@/components/ui/Timeline';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { getServiceById, SERVICE_IMAGES } from '@/constants/services';
import { useTranslation } from '@/hooks/useTranslation';
import { useBookingsRepo } from '@/store/bookingsRepo';
import { formatINR } from '@/utils/pricing';
import { formatDateLong } from '@/utils/date';
import type { BookingStatus, TimeSlot } from '@/types';
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

export default function BookingDetailScreen() {
  const { t, tService, tCrop, tAreaUnit, tTimeSlot, tTimeline, tPaymentStatus } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const booking = useBookingsRepo((s) => s.getById(params.bookingId));
  const cancelBooking = useBookingsRepo((s) => s.cancelBooking);

  if (!booking) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title={t('bookingTitle')} onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>{t('bookingNotFound')}</Text>
      </SafeAreaView>
    );
  }

  const svc = getServiceById(booking.serviceId);
  const slotLabel = booking.preferredSlot
    ? tTimeSlot(booking.preferredSlot as TimeSlot).label
    : '';
  const currentIndex = TIMELINE_ORDER.indexOf(booking.status);
  const isCancelled = booking.status === 'CANCELLED';

  const steps = TIMELINE_ORDER.map((s, i) => ({
    label: tTimeline(s),
    done: !isCancelled && i <= currentIndex,
    active: !isCancelled && i === currentIndex,
  }));

  const onCancel = () =>
    Alert.alert(t('cancelBookingTitle'), t('cancelBookingBody'), [
      { text: t('keep'), style: 'cancel' },
      {
        text: t('cancelBookingBtn'),
        style: 'destructive',
        onPress: () => cancelBooking(booking.bookingId),
      },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={booking.bookingId} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: SERVICE_IMAGES[booking.serviceId] ?? svc?.image }}
          style={styles.heroImage}
          imageStyle={{ borderRadius: Radius.lg }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={styles.heroGradient}
          >
            <Text style={styles.serviceNameHero}>
              {tService(booking.serviceId, booking.serviceName)}
            </Text>
            <StatusBadge status={booking.status} />
          </LinearGradient>
        </ImageBackground>

        <Section title={t('secLocationDetails')}>
          <Row label={t('lblState')} value={booking.state} />
          <Row label={t('lblDistrict')} value={booking.district} />
          <Row label={t('lblMandal')} value={booking.mandal} />
          <Row label={t('lblVillage')} value={booking.village} />
          <Row label={t('lblFarmer')} value={booking.farmerName} />
        </Section>

        <Section title={t('secCropArea')}>
          <Row label={t('lblCrop')} value={tCrop(booking.cropType)} />
          <Row
            label={t('lblAreaDetail')}
            value={t('areaDetailFormat', {
              value: booking.areaValue,
              unit: tAreaUnit(booking.areaUnit),
              acres: booking.areaInAcres,
              acresLabel: t('acres'),
            })}
          />
        </Section>

        <Section title={t('secServiceSchedule')}>
          <Row label={t('lblService')} value={tService(booking.serviceId, booking.serviceName)} />
          <Row label={t('lblDate')} value={formatDateLong(booking.preferredDate)} />
          <Row label={t('lblSlot')} value={slotLabel} />
          {booking.specialInstructions ? (
            <Row label={t('lblNotes')} value={booking.specialInstructions} />
          ) : null}
        </Section>

        {booking.assignedAgent ? (
          <Section title={t('secTeamAssigned')}>
            <Row label={t('lblAgent')} value={booking.assignedAgent.name} />
            <Row label={t('lblPhone')} value={booking.assignedAgent.phone} />
          </Section>
        ) : null}

        <Section title={t('secPayment')}>
          <Row label={t('lblBase')} value={formatINR(booking.baseAmount)} />
          <Row label={t('reviewGst')} value={formatINR(booking.gstAmount)} />
          <Row label={t('lblTotal')} value={formatINR(booking.totalAmount)} bold />
          <Row label={t('lblStatus')} value={tPaymentStatus(booking.paymentStatus)} />
        </Section>

        <Section title={t('secStatusTimeline')}>
          <Timeline steps={steps} />
        </Section>

        <View style={styles.actions}>
          {booking.status === 'PENDING_PAYMENT' ? (
            <AnimatedButton
              label={t('cancelBookingBtn')}
              variant="danger"
              shimmer={false}
              onPress={onCancel}
            />
          ) : null}
          {booking.status === 'COMPLETED' ? (
            <AnimatedButton
              label={t('downloadReport')}
              icon={<Download size={18} color={Colors.white} />}
              onPress={() => Alert.alert(t('downloadReport'), t('downloadReportMsg'))}
            />
          ) : null}
          <View style={styles.supportRow}>
            <AnimatedButton
              label={t('call')}
              variant="outline"
              shimmer={false}
              style={styles.supportBtn}
              icon={<Phone size={16} color={Colors.primary} />}
              onPress={() => Linking.openURL('tel:+919876543210')}
            />
            <AnimatedButton
              label={t('whatsapp')}
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
  heroImage: { height: 200, marginBottom: Spacing.sm, borderRadius: Radius.lg, overflow: 'hidden' },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderRadius: Radius.lg,
  },
  serviceNameHero: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.xl,
    color: Colors.textOnDark,
  },
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
