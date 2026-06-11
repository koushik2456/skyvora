import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FadeUp from '@/components/ui/FadeUp';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80';

interface Props {
  onBook: () => void;
  onExplore: () => void;
}

export default function HeroImageCard({ onBook, onExplore }: Props) {
  const { t } = useTranslation();

  return (
    <FadeUp>
      <View style={styles.wrap}>
        <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.image} imageStyle={styles.imageRadius}>
          <LinearGradient
            colors={['rgba(8,17,32,0.15)', 'rgba(8,17,32,0.88)']}
            style={styles.overlay}
          >
            <Text style={styles.kicker}>{t('heroKicker')}</Text>
            <Text style={styles.title}>{t('heroTitle')}</Text>
            <Text style={styles.sub}>{t('heroSub')}</Text>
            <View style={styles.ctaRow}>
              <AnimatedButton label={t('bookService')} onPress={onBook} size="md" style={styles.ctaPrimary} />
              <AnimatedButton
                label={t('exploreServices')}
                variant="outline"
                onDark
                size="md"
                onPress={onExplore}
                style={styles.ctaSecondary}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </FadeUp>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: Spacing.lg },
  image: { minHeight: 340, justifyContent: 'flex-end' },
  imageRadius: { borderRadius: Radius['2xl'] },
  overlay: {
    borderRadius: Radius['2xl'],
    padding: Spacing.xl,
    gap: Spacing.sm,
    minHeight: 340,
    justifyContent: 'flex-end',
  },
  kicker: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.xs,
    color: Colors.primaryLight,
    letterSpacing: Typography.tracking.wide,
  },
  title: {
    fontFamily: Typography.fontHero,
    fontSize: Typography.sizes['2xl'],
    lineHeight: 34,
    color: Colors.dark.textPrimary,
    letterSpacing: Typography.tracking.tight,
  },
  sub: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.sm,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  ctaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  ctaPrimary: { flexGrow: 1, minWidth: 140 },
  ctaSecondary: { flexGrow: 1, minWidth: 140 },
});
