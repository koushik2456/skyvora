import React, { useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface Option<T> {
  label: string;
  value: T;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (val: T) => void;
  /** Render with translucent dark-section styling. */
  dark?: boolean;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  dark,
}: Props<T>) {
  const [width, setWidth] = useState(0);
  const segWidth = width / options.length;
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(index * segWidth, { duration: 220 }) }],
    width: segWidth,
  }));

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View style={[styles.track, dark && styles.trackDark]} onLayout={onLayout}>
      {width > 0 && (
        <Animated.View style={[styles.indicator, dark && styles.indicatorDark, indicatorStyle]} />
      )}
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable key={opt.value} style={styles.segment} onPress={() => onChange(opt.value)}>
            <Text
              style={[
                styles.label,
                dark && styles.labelDark,
                active && (dark ? styles.labelActiveDark : styles.labelActive),
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: 4,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  trackDark: { backgroundColor: Colors.dark.glass, borderWidth: 1, borderColor: Colors.dark.border },
  indicatorDark: { backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOpacity: 0.5 },
  segment: { flex: 1, paddingVertical: Spacing.sm + 2, alignItems: 'center', zIndex: 1 },
  label: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  labelDark: { color: Colors.dark.textSecondary },
  labelActive: { color: Colors.primary, fontFamily: Typography.fontBodySemi },
  labelActiveDark: { color: Colors.white, fontFamily: Typography.fontBodySemi },
});
