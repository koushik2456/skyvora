import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '@/components/ui/Motion';
import { useTranslation } from '@/hooks/useTranslation';
import type { TranslationKey } from '@/i18n/strings';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { OFFERS } from '@/constants/content';

export default function OffersCarousel() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const offer = OFFERS[page];
  const prefix = `offer_${offer.id}` as const;

  return (
    <View>
      <Pressable onPress={() => setPage((p) => (p + 1) % OFFERS.length)}>
        <LinearGradient
          colors={offer.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.tagPill}>
            <Text style={styles.tag}>{t(`${prefix}_tag` as TranslationKey)}</Text>
          </View>
          <Text style={styles.title}>{t(`${prefix}_title` as TranslationKey)}</Text>
          <Text style={styles.body}>{t(`${prefix}_body` as TranslationKey)}</Text>
          <Text style={styles.tapHint}>{t('tapNextOffer')}</Text>
        </LinearGradient>
      </Pressable>

      <View style={styles.dots}>
        {OFFERS.map((o, i) => (
          <Pressable key={o.id} onPress={() => setPage(i)}>
            <MotiView
              animate={{
                width: i === page ? 22 : 7,
                opacity: i === page ? 1 : 0.4,
              }}
              transition={{ type: 'timing', duration: 250 }}
              style={styles.dot}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
    minHeight: 132,
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  tag: {
    fontFamily: Typography.fontBodySemi,
    fontSize: 10,
    color: Colors.white,
    letterSpacing: Typography.tracking.wide,
  },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes.lg,
    color: Colors.white,
  },
  body: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.sm,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 19,
  },
  tapHint: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  dot: {
    height: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
  },
});
