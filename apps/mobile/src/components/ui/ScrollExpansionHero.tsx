import React, { ReactNode, useCallback } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing, TextStyles, Typography } from '@/constants/theme';

const { height: SCREEN_H } = Dimensions.get('window');
const HERO_MIN = SCREEN_H * 0.55;
const HERO_MAX = SCREEN_H;

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function ScrollExpandMedia({
  mediaSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand = 'Scroll to explore',
  children,
}: ScrollExpandMediaProps) {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const heroStyle = useAnimatedStyle(() => {
    const h = interpolate(scrollY.value, [0, HERO_MAX * 0.5], [HERO_MIN, HERO_MAX], Extrapolation.CLAMP);
    return { height: h };
  });

  const mediaStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, HERO_MAX * 0.5], [1, 1.12], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [0, HERO_MAX * 0.4], [1, 0.85], Extrapolation.CLAMP);
    return { transform: [{ scale }], opacity };
  });

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 120], [1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(scrollY.value, [0, 120], [0, -30], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <View style={styles.root}>
      <AnimatedScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <Animated.View style={[styles.hero, heroStyle]}>
          <Animated.View style={[StyleSheet.absoluteFill, mediaStyle]}>
            <ImageBackground source={{ uri: mediaSrc }} style={StyleSheet.absoluteFill} resizeMode="cover">
              <ImageBackground
                source={{ uri: bgImageSrc }}
                style={[StyleSheet.absoluteFill, { opacity: 0.35 }]}
                resizeMode="cover"
              />
            </ImageBackground>
          </Animated.View>
          <LinearGradient
            colors={['rgba(10,22,40,0.2)', 'rgba(10,22,40,0.92)']}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View style={[styles.heroText, titleStyle]}>
            {date ? <Text style={styles.date}>{date}</Text> : null}
            {title ? <Text style={styles.title}>{title}</Text> : null}
            <Text style={styles.hint}>{scrollToExpand}</Text>
          </Animated.View>
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </AnimatedScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  hero: { overflow: 'hidden', justifyContent: 'flex-end' },
  heroText: {
    padding: Spacing.xl,
    paddingBottom: Spacing['2xl'],
    gap: Spacing.sm,
  },
  date: {
    fontFamily: Typography.bodyMed,
    fontSize: 13,
    color: Colors.accent,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    ...TextStyles.heroTitle,
    fontSize: 32,
    lineHeight: 40,
  },
  hint: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textOnDarkMuted,
    marginTop: Spacing.sm,
  },
  content: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    marginTop: -Radius['2xl'],
    paddingTop: Spacing.xl,
    minHeight: SCREEN_H * 0.5,
  },
});
