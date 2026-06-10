import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Motion, Radius, Shadow, Spacing } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  /** Dark "Drone Tech" card for dark sections. */
  dark?: boolean;
  /** Remove inner padding (for image-led cards). */
  flush?: boolean;
}

const EASE = Easing.bezier(...Motion.bezier);

export default function AnimatedCard({ children, onPress, style, disabled, dark, flush }: Props) {
  const scale = useSharedValue(1);
  const lift = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: lift.value }],
  }));

  return (
    <Animated.View
      style={[styles.card, dark ? styles.cardDark : Shadow.card, animatedStyle, style]}
    >
      <Pressable
        disabled={disabled || !onPress}
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 120, easing: EASE });
          lift.value = withTiming(-3, { duration: 120, easing: EASE });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: Motion.duration.fast, easing: EASE });
          lift.value = withTiming(0, { duration: Motion.duration.fast, easing: EASE });
        }}
        onPress={onPress}
        style={flush ? styles.flush : styles.press}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
  },
  press: { padding: Spacing.base },
  flush: { padding: 0 },
});
