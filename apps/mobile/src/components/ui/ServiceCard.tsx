import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { MotiView } from './Motion';
import AnimatedCard from './AnimatedCard';
import ServiceIcon from './ServiceIcon';
import PriceTag from './PriceTag';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { Service } from '@/types';

interface Props {
  service: Service;
  onPress?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export default function ServiceCard({ service, onPress, selected, compact }: Props) {
  return (
    <AnimatedCard
      onPress={onPress}
      style={{
        ...(selected ? styles.selected : {}),
        ...(compact ? styles.compact : {}),
      }}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${service.color}1A` }]}>
          <ServiceIcon name={service.icon} color={service.color} size={22} />
        </View>
        {selected ? (
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            style={styles.check}
          >
            <Check size={14} color={Colors.white} strokeWidth={3} />
          </MotiView>
        ) : null}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {service.name}
      </Text>
      {!compact ? (
        <Text style={styles.desc} numberOfLines={2}>
          {service.description}
        </Text>
      ) : null}
      <View style={styles.priceRow}>
        <PriceTag amount={service.ratePerAcre} suffix="/acre" size="md" />
      </View>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  selected: { borderColor: Colors.primary, borderWidth: 2 },
  compact: { minHeight: 0 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  desc: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  priceRow: { marginTop: Spacing.sm },
});
