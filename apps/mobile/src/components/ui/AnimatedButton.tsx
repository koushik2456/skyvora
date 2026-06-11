import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Motion, Radius, Shadow, Spacing, Typography, resolveShadow } from '@/constants/theme';

type Variant = 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  shimmer?: boolean;
  /** Renders outline/ghost variants with light-on-dark colors. */
  onDark?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);
const PRESS_EASE = Easing.bezier(...Motion.bezier);

export default function AnimatedButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  size = 'lg',
  shimmer = true,
  onDark = false,
  style,
  icon,
}: Props) {
  const scale = useSharedValue(1);
  const shimmerX = useSharedValue(-1);

  useEffect(() => {
    if (shimmer && !disabled && (variant === 'primary' || variant === 'accent')) {
      shimmerX.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
          withTiming(-1, { duration: 0 })
        ),
        -1
      );
    }
  }, [shimmer, disabled, variant, shimmerX]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value * 240 }, { rotate: '20deg' }],
    opacity: 0.3,
  }));

  const isFilled = variant === 'primary' || variant === 'accent' || variant === 'danger';
  const textColor = isFilled
    ? Colors.white
    : onDark
      ? Colors.dark.textPrimary
      : Colors.primary;

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, size === 'md' && styles.labelMd, { color: textColor }]}>
            {label}
          </Text>
        </>
      )}
    </View>
  );

  const heightStyle = size === 'md' ? styles.innerMd : styles.innerLg;

  const body = () => {
    if (variant === 'primary' || variant === 'accent') {
      const grad: [string, string] =
        variant === 'primary'
          ? [Colors.bgForest, Colors.jade]
          : [Colors.jade, Colors.sage];
      return (
        <LinearGradient
          colors={grad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.inner, heightStyle]}
        >
          {shimmer && (
            <Animated.View style={[styles.shimmer, shimmerStyle]}>
              <AnimatedLG
                colors={['transparent', 'rgba(255,255,255,0.9)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          )}
          {content}
        </LinearGradient>
      );
    }
    if (variant === 'danger') {
      return (
        <View style={[styles.inner, heightStyle, { backgroundColor: Colors.danger }]}>
          {content}
        </View>
      );
    }
    if (variant === 'secondary') {
      return (
        <View
          style={[
            styles.inner,
            heightStyle,
            { backgroundColor: onDark ? Colors.dark.glassStrong : Colors.surfaceAlt },
          ]}
        >
          {content}
        </View>
      );
    }
    if (variant === 'ghost') {
      return <View style={[styles.inner, heightStyle]}>{content}</View>;
    }
    return (
      <View
        style={[
          styles.inner,
          heightStyle,
          styles.outline,
          onDark && { borderColor: Colors.dark.borderStrong },
        ]}
      >
        {content}
      </View>
    );
  };

  const glow =
    variant === 'primary'
      ? resolveShadow(Shadow.glow)
      : variant === 'accent'
        ? resolveShadow(Shadow.accentGlow)
        : undefined;

  return (
    <Animated.View style={[pressStyle, !disabled && glow, style, disabled && styles.disabled]}>
      <Pressable
        disabled={disabled || loading}
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 120, easing: PRESS_EASE });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: Motion.duration.fast, easing: PRESS_EASE });
        }}
        onPress={onPress}
        style={styles.press}
      >
        {body()}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  press: { borderRadius: Radius.full, overflow: 'hidden' },
  inner: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    overflow: 'hidden',
  },
  innerLg: { minHeight: 56 },
  innerMd: { minHeight: 48 },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  label: {
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.md,
  },
  labelMd: { fontSize: Typography.sizes.base },
  shimmer: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 60,
  },
  disabled: { opacity: 0.5 },
});
