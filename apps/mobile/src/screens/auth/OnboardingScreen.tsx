import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from '@/components/ui/Motion';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AnimatedButton from '@/components/ui/AnimatedButton';
import CoverImage from '@/components/ui/CoverImage';
import { Images } from '@/constants/images';
import { BotanicalGradient, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { AuthStackParamList } from '@/navigation/types';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const SLIDES = [
  {
    image: Images.onboard_1,
    fallback: Images.hero_green_fields,
    headline: 'Your Farm, Our Expertise',
    sub: 'Book drone services in minutes. Pesticides, fertilizers, surveys — all in one app.',
  },
  {
    image: Images.onboard_2,
    fallback: Images.drone_hero,
    headline: 'Precision at Every Acre',
    sub: 'Our drones cover your land with pinpoint accuracy, saving time and resources.',
  },
  {
    image: Images.onboard_3,
    fallback: Images.hero_farm_morning,
    headline: 'Grow More, Worry Less',
    sub: 'Get service reports, soil insights, and fertilizer plans delivered to your phone.',
  },
];

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      navigation.replace('Welcome');
    }
  };

  const skip = () => navigation.replace('Welcome');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlatList
        ref={listRef}
        style={styles.list}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(_, i) => ({ length: SCREEN_W, offset: SCREEN_W * i, index: i })}
        renderItem={({ item, index: i }) => (
          <View style={styles.slideWrap}>
            <CoverImage uri={item.image} fallbackUri={item.fallback} />
            <LinearGradient
              colors={[...BotanicalGradient.onboarding]}
              style={styles.gradient}
            />
            {i < SLIDES.length - 1 && (
              <SafeAreaView edges={['top']} style={styles.skipWrap}>
                <Pressable onPress={skip} hitSlop={12}>
                  <Text style={styles.skip}>Skip</Text>
                </Pressable>
              </SafeAreaView>
            )}
            <View style={styles.textContainer}>
              <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500 }}
              >
                <Text style={styles.headline}>{item.headline}</Text>
                <Text style={styles.subtext}>{item.sub}</Text>
              </MotiView>
            </View>
          </View>
        )}
      />

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <AnimatedButton
          label={index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={goNext}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDeep },
  list: { flex: 1 },
  slideWrap: {
    width: SCREEN_W,
    height: SCREEN_H,
    justifyContent: 'flex-end',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    top: '30%',
  },
  skipWrap: { position: 'absolute', top: 0, right: 0, padding: Spacing.lg, zIndex: 2 },
  skip: {
    fontFamily: Typography.bodyMed,
    fontSize: Typography.sizes.base,
    color: Colors.mint,
  },
  textContainer: {
    padding: Spacing.xl,
    paddingBottom: 140,
    gap: Spacing.md,
    zIndex: 1,
  },
  headline: {
    fontFamily: Typography.display,
    fontSize: Typography.sizes['2xl'],
    color: Colors.mint,
    lineHeight: 34,
  },
  subtext: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.base,
    color: Colors.sage,
    lineHeight: 22,
    marginTop: Spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    gap: Spacing.lg,
    zIndex: 3,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(142, 182, 155, 0.35)',
  },
  dotActive: { backgroundColor: Colors.sage, width: 24 },
});
