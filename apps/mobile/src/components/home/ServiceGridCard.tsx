import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '@/components/ui/Motion';
import CoverImage from '@/components/ui/CoverImage';
import { useTranslation } from '@/hooks/useTranslation';
import { Images } from '@/constants/images';
import { BotanicalGradient, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { ServiceWithIcon } from '@/constants/services';

interface Props {
  service: ServiceWithIcon;
  index: number;
  onPress: () => void;
}

export default function ServiceGridCard({ service, index, onPress }: Props) {
  const { t, tService } = useTranslation();
  const Icon = service.Icon;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 80, type: 'spring' }}
      style={styles.wrap}
    >
      <Pressable onPress={onPress} style={styles.card}>
        <CoverImage uri={service.image} fallbackUri={Images.hero_farm_aerial} />
        <LinearGradient colors={[...BotanicalGradient.card]} style={styles.gradient}>
          <View style={styles.iconPill}>
            <Icon size={16} color={Colors.mint} />
          </View>
          <View style={styles.textRow}>
            <Text style={styles.name} numberOfLines={2}>
              {tService(service.id, service.name)}
            </Text>
            <Text style={styles.price}>₹{service.ratePerAcre.toLocaleString('en-IN')}/acre</Text>
          </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{t('bookNow')}</Text>
            </View>
        </LinearGradient>
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '48%', marginBottom: Spacing.base },
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    height: 200,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gradient: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  iconPill: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(11, 43, 38, 0.75)',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRow: { gap: 2 },
  name: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.base,
    color: Colors.mint,
  },
  price: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.sm,
    color: Colors.sage,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.jade,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(142, 182, 155, 0.2)',
  },
  chipText: {
    fontFamily: Typography.bodyMed,
    fontSize: 11,
    color: Colors.mint,
  },
});
