import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '@/constants/theme';
import { formatINRShort } from '@/utils/pricing';

interface Props {
  amount: number;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function PriceTag({ amount, suffix, size = 'md', color = Colors.primary }: Props) {
  const fontSize =
    size === 'lg' ? Typography.sizes.xl : size === 'sm' ? Typography.sizes.base : Typography.sizes.md;
  return (
    <View style={styles.row}>
      <Text style={[styles.price, { fontSize, color }]}>{formatINRShort(amount)}</Text>
      {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontFamily: Typography.fontDisplay },
  suffix: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginLeft: 2,
  },
});
