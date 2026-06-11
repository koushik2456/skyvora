import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MotiView } from './Motion';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { BookingStatus } from '@/types';

const CONFIG: Record<string, { color: string; bg: string; pulse?: boolean }> = {
  DRAFT: { color: Colors.sage, bg: 'rgba(22, 56, 50, 0.9)' },
  PENDING_PAYMENT: { color: Colors.warning, bg: 'rgba(166, 139, 91, 0.22)' },
  PAYMENT_FAILED: { color: Colors.danger, bg: 'rgba(184, 92, 92, 0.22)' },
  PAYMENT_CONFIRMED: { color: Colors.mint, bg: 'rgba(35, 83, 71, 0.85)' },
  ASSIGNED: { color: Colors.mint, bg: 'rgba(35, 83, 71, 0.75)', pulse: true },
  IN_PROGRESS: { color: Colors.mint, bg: 'rgba(35, 83, 71, 0.85)', pulse: true },
  COMPLETED: { color: Colors.mint, bg: 'rgba(90, 158, 114, 0.28)' },
  CANCELLED: { color: Colors.danger, bg: 'rgba(184, 92, 92, 0.22)' },
};

interface Props {
  status: BookingStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const { tStatus } = useTranslation();
  const cfg = CONFIG[status] ?? CONFIG.DRAFT;

  return (
    <View style={styles.badgeWrapper}>
      {cfg.pulse ? (
        <MotiView
          from={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ loop: true, duration: 1200 }}
          style={[styles.pulseRing, { backgroundColor: cfg.color }]}
        />
      ) : null}
      <View style={[styles.badge, { backgroundColor: cfg.bg }, size === 'sm' && styles.sm]}>
        <View style={[styles.dot, { backgroundColor: cfg.color }]} />
        <Text style={[styles.label, { color: cfg.color }, size === 'sm' && styles.labelSm]}>
          {tStatus(status)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeWrapper: { alignSelf: 'flex-start', position: 'relative' },
  pulseRing: {
    position: 'absolute',
    top: '50%',
    left: 12,
    width: 7,
    height: 7,
    marginTop: -3.5,
    borderRadius: Radius.full,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sm: { paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  dot: { width: 7, height: 7, borderRadius: Radius.full },
  label: { fontFamily: Typography.bodyMed, fontSize: Typography.sizes.sm },
  labelSm: { fontSize: Typography.sizes.xs },
});
