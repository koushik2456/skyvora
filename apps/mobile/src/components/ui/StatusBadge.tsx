import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MotiView } from './Motion';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { BookingStatus } from '@/types';

const CONFIG: Record<string, { label: string; color: string; bg: string; pulse?: boolean }> = {
  DRAFT: { label: 'Draft', color: Colors.textSecondary, bg: '#EDF0F3' },
  PENDING_PAYMENT: { label: 'Pending', color: Colors.warning, bg: '#FEF3E2' },
  PAYMENT_FAILED: { label: 'Payment Failed', color: Colors.danger, bg: '#FDECEC' },
  PAYMENT_CONFIRMED: { label: 'Confirmed', color: Colors.success, bg: '#E9F9EF' },
  ASSIGNED: { label: 'On the Way', color: Colors.info, bg: '#E7F6FE', pulse: true },
  IN_PROGRESS: { label: 'In Progress', color: Colors.primary, bg: '#E9F0FE', pulse: true },
  COMPLETED: { label: 'Fulfilled', color: Colors.success, bg: '#E9F9EF' },
  CANCELLED: { label: 'Cancelled', color: Colors.danger, bg: '#FDECEC' },
};

interface Props {
  status: BookingStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const cfg = CONFIG[status] ?? CONFIG.DRAFT;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, size === 'sm' && styles.sm]}>
      {cfg.pulse ? (
        <MotiView
          from={{ opacity: 0.4, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 700, loop: true }}
          style={[styles.dot, { backgroundColor: cfg.color }]}
        />
      ) : (
        <View style={[styles.dot, { backgroundColor: cfg.color }]} />
      )}
      <Text style={[styles.label, { color: cfg.color }, size === 'sm' && styles.labelSm]}>
        {cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  dot: { width: 7, height: 7, borderRadius: Radius.full },
  label: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.sm },
  labelSm: { fontSize: Typography.sizes.xs },
});
