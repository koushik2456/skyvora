import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { MotiView } from './Motion';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface Props {
  options: string[];
  value: string | null;
  onChange: (val: string) => void;
}

export default function ChipSelector({ options, value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <Pressable key={opt} onPress={() => onChange(opt)}>
            <MotiView
              animate={{
                scale: selected ? 1.05 : 1,
                backgroundColor: selected ? Colors.primary : Colors.surface,
                borderColor: selected ? Colors.primary : Colors.border,
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              style={styles.chip}
            >
              <Text style={[styles.label, selected && styles.labelSelected]}>{opt}</Text>
            </MotiView>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.sm, paddingHorizontal: 2, paddingVertical: 4 },
  chip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  label: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  labelSelected: { color: Colors.white, fontFamily: Typography.fontBodySemi },
});
