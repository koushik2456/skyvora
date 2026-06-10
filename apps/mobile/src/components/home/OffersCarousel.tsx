import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '@/components/ui/Motion';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { OFFERS } from '@/constants/content';

const SCREEN_W = Dimensions.get('window').width;
const PAGE_W = SCREEN_W - Spacing.lg * 2;
const AUTO_MS = 4000;

export default function OffersCarousel() {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (pausedRef.current) return;
      const next = (pageRef.current + 1) % OFFERS.length;
      scrollRef.current?.scrollTo({ x: next * PAGE_W, animated: true });
      pageRef.current = next;
      setPage(next);
    }, AUTO_MS);
    return () => clearInterval(t);
  }, []);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / PAGE_W);
    pageRef.current = p;
    setPage(p);
    pausedRef.current = false;
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        snapToInterval={PAGE_W}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          pausedRef.current = true;
        }}
        onMomentumScrollEnd={onScrollEnd}
      >
        {OFFERS.map((offer) => (
          <LinearGradient
            key={offer.id}
            colors={offer.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { width: PAGE_W }]}
          >
            <View style={styles.tagPill}>
              <Text style={styles.tag}>{offer.tag}</Text>
            </View>
            <Text style={styles.title}>{offer.title}</Text>
            <Text style={styles.body}>{offer.body}</Text>
          </LinearGradient>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {OFFERS.map((o, i) => (
          <MotiView
            key={o.id}
            animate={{
              width: i === page ? 22 : 7,
              opacity: i === page ? 1 : 0.4,
            }}
            transition={{ type: 'timing', duration: 250 }}
            style={styles.dot}
          />
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
