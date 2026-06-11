import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
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
    width: withSpring(`${pct}%`, { damping: 18, stiffness: 120 }),
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
      {labels ? (
        <View style={styles.labelsRow}>
          {labels.map((label, i) => (
            <Text
              key={label}
              style={[styles.stepLabel, i === current && styles.stepLabelActive]}
              numberOfLines={1}
            >
              {label}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.caption}>
          Step {current + 1} of {total}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.sm },
  track: {
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  stepLabel: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  stepLabelActive: {
    fontFamily: Typography.bodyMed,
    color: Colors.primary,
  },
  caption: {
    fontFamily: Typography.bodyMed,
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
