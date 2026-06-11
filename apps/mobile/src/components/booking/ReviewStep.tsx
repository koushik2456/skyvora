import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MotiView } from '@/components/ui/Motion';
import { MapPin, Wheat, Plane, CalendarDays, Receipt, Pencil } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import { getServiceById } from '@/constants/services';
import { useTranslation } from '@/hooks/useTranslation';
import { formatINR } from '@/utils/pricing';
import { formatDateLong } from '@/utils/date';
import type { TimeSlot } from '@/types';

interface Props {
  onEdit: (step: number) => void;
}

export default function ReviewStep({ onEdit }: Props) {
  const { t, tService, tCrop, tTimeSlot, tAreaUnit } = useTranslation();
  const b = useBookingStore();
  const service = getServiceById(b.serviceId);
  const slotLabel = b.preferredSlot ? tTimeSlot(b.preferredSlot as TimeSlot).label : '';
  const cost = b.costBreakdown;
  const acresLabel = t('acres');

  const sections = [
    {
      icon: MapPin,
      title: t('reviewLocation'),
      step: 0,
      lines: [
        `${b.state} › ${b.district} › ${b.mandal}`,
        b.village,
        t('reviewFarmer', { name: b.farmerName }),
      ],
    },
    {
      icon: Wheat,
      title: t('reviewCropArea'),
      step: 1,
      lines: [`${tCrop(b.cropType ?? '')} · ${b.areaInAcres} ${acresLabel}`],
    },
    {
      icon: Plane,
      title: t('reviewService'),
      step: 2,
      lines: [
        tService(b.serviceId ?? '', service?.name),
        `${formatINR(service?.ratePerAcre ?? 0)}${t('perAcre')}`,
      ],
    },
    {
      icon: CalendarDays,
      title: t('reviewSchedule'),
      step: 3,
      lines: [
        b.preferredDate ? formatDateLong(b.preferredDate) : '',
        slotLabel ? `${slotLabel} ${t('slotSuffix')}` : '',
        ...(b.specialInstructions ? [t('reviewNote', { text: b.specialInstructions })] : []),
      ],
    },
  ];

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{t('reviewTitle')}</Text>

      {sections.map((sec, i) => {
        const Icon = sec.icon;
        return (
          <MotiView
            key={sec.title}
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 350, delay: i * 90 }}
            style={styles.card}
          >
            <View style={styles.cardHead}>
              <View style={styles.cardHeadLeft}>
                <Icon size={16} color={Colors.primary} />
                <Text style={styles.cardTitle}>{sec.title}</Text>
              </View>
              <Pressable onPress={() => onEdit(sec.step)} hitSlop={8} style={styles.editBtn}>
                <Pencil size={13} color={Colors.primary} />
                <Text style={styles.editText}>{t('reviewEdit')}</Text>
              </Pressable>
            </View>
            {sec.lines.filter(Boolean).map((line, idx) => (
              <Text key={idx} style={styles.cardLine}>
                {line}
              </Text>
            ))}
          </MotiView>
        );
      })}

      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 350, delay: sections.length * 90 }}
        style={[styles.card, styles.costCard]}
      >
        <View style={styles.cardHeadLeft}>
          <Receipt size={16} color={Colors.primary} />
          <Text style={styles.cardTitle}>{t('reviewCostBreakdown')}</Text>
        </View>
        <Row
          label={t('reviewAcresRate', {
            acres: b.areaInAcres ?? 0,
            acresLabel,
            rate: formatINR(service?.ratePerAcre ?? 0),
          })}
          value={formatINR(cost?.base ?? 0)}
        />
        <Row label={t('reviewGst')} value={formatINR(cost?.gst ?? 0)} />
        <View style={styles.totalDivider} />
        <Row label={t('reviewTotal')} value={formatINR(cost?.total ?? 0)} bold />
      </MotiView>
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.base },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.xl, color: Colors.textPrimary },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: 4,
  },
  costCard: { backgroundColor: Colors.surfaceAlt },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.xs, color: Colors.primary, letterSpacing: 1 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  editText: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.xs, color: Colors.primary },
  cardLine: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.base, color: Colors.textPrimary, lineHeight: 22 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  rowLabel: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  rowLabelBold: { fontFamily: Typography.fontDisplaySemi, fontSize: Typography.sizes.md, color: Colors.textPrimary },
  rowValue: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.sm, color: Colors.textPrimary },
  rowValueBold: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.md, color: Colors.primary },
  totalDivider: { height: 1, backgroundColor: Colors.border, marginTop: Spacing.sm },
});
