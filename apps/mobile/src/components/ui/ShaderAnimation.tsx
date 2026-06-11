import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

/** Ambient animated background — Reanimated gradient fallback for React Native (no WebGL). */
export function ShaderAnimation() {
  const t = useSharedValue(0);
  const t2 = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
    t2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
  }, [t, t2]);

  const orb1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: t.value * 40 - 20 },
      { translateY: t2.value * 30 - 15 },
      { scale: 1 + t.value * 0.15 },
    ],
    opacity: 0.35 + t.value * 0.2,
  }));

  const orb2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: t2.value * -50 + 25 },
      { translateY: t.value * 40 - 20 },
      { scale: 1.1 + t2.value * 0.1 },
    ],
    opacity: 0.25 + t2.value * 0.15,
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[Colors.bgDeep, Colors.bgForest, Colors.bgEmerald]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <AnimatedGradient
        colors={['transparent', 'rgba(35, 83, 71, 0.35)', 'transparent']}
        style={[styles.orb, styles.orbGreen, orb1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <AnimatedGradient
        colors={['transparent', 'rgba(142, 182, 155, 0.2)', 'transparent']}
        style={[styles.orb, styles.orbAmber, orb2]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbGreen: {
    width: 320,
    height: 320,
    top: '15%',
    left: '-20%',
  },
  orbAmber: {
    width: 280,
    height: 280,
    bottom: '10%',
    right: '-15%',
  },
});
