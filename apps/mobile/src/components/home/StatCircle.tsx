import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CountUp from '@/components/ui/CountUp';
import FadeUp from '@/components/ui/FadeUp';
import { Colors, Radius, Typography } from '@/constants/theme';

interface Props {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  delay?: number;
}

export default function StatCircle({ value, decimals, suffix, label, delay = 0 }: Props) {
  return (
    <FadeUp delay={delay} style={styles.wrap}>
      <View style={styles.circle}>
        <CountUp value={value} decimals={decimals} suffix={suffix} style={styles.value} />
        <Text style={styles.plus}>+</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </FadeUp>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', gap: 8 },
  circle: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    backgroundColor: Colors.dark.glassStrong,
    borderWidth: 1,
    borderColor: Colors.dark.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  value: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes.lg,
    color: Colors.dark.textPrimary,
  },
  plus: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes.sm,
    color: Colors.accent,
    marginTop: -4,
  },
  label: {
    fontFamily: Typography.fontBody,
    fontSize: 10,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
});
