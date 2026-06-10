import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MotiView } from './Motion';
import { Check } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface Step {
  label: string;
  done: boolean;
  active?: boolean;
}

interface Props {
  steps: Step[];
}

export default function Timeline({ steps }: Props) {
  return (
    <View>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <View key={step.label} style={styles.row}>
            <View style={styles.indicatorCol}>
              <MotiView
                from={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: i * 120, damping: 13 }}
                style={[
                  styles.dot,
                  step.done && styles.dotDone,
                  step.active && styles.dotActive,
                ]}
              >
                {step.done ? <Check size={12} color={Colors.white} strokeWidth={3} /> : null}
              </MotiView>
              {!last && <View style={[styles.line, step.done && styles.lineDone]} />}
            </View>
            <Text
              style={[
                styles.label,
                (step.done || step.active) && styles.labelActive,
                last && { marginBottom: 0 },
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md },
  indicatorCol: { alignItems: 'center' },
  dot: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: Colors.primary },
  dotActive: { backgroundColor: Colors.primaryLight, borderWidth: 3, borderColor: '#C9E8D6' },
  line: { width: 2, flex: 1, minHeight: 26, backgroundColor: Colors.border, marginVertical: 2 },
  lineDone: { backgroundColor: Colors.primary },
  label: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
    paddingTop: 1,
    marginBottom: Spacing.sm,
  },
  labelActive: { fontFamily: Typography.fontBodySemi, color: Colors.textPrimary },
});
