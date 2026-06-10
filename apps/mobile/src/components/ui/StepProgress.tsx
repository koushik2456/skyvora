import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface Props {
  current: number;
  total: number;
  labels?: string[];
}

export default function StepProgress({ current, total, labels }: Props) {
  const pct = ((current + 1) / total) * 100;
  const fillStyle = useAnimatedStyle(() => ({
    width: withTiming(`${pct}%`, { duration: 350 }),
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.step}>
          Step {current + 1} of {total}
        </Text>
        {labels?.[current] ? <Text style={styles.label}>{labels[current]}</Text> : null}
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  step: { fontFamily: Typography.fontBodySemi, color: Colors.primary, fontSize: Typography.sizes.sm },
  label: { fontFamily: Typography.fontBody, color: Colors.textSecondary, fontSize: Typography.sizes.sm },
  track: {
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
  },
});
