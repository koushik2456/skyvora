import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MotiView } from './Motion';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export interface ChipOption {
  value: string;
  label: string;
}

interface Props {
  options: ChipOption[];
  value: string | null;
  onChange: (val: string) => void;
}

export default function ChipSelector({ options, value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Pressable key={opt.value} onPress={() => onChange(opt.value)}>
            <MotiView
              animate={{
                scale: selected ? 1.05 : 1,
                backgroundColor: selected ? Colors.primary : Colors.surface,
                borderColor: selected ? Colors.primary : Colors.border,
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              style={styles.chip}
            >
              <Text style={[styles.label, selected && styles.labelSelected]}>{opt.label}</Text>
            </MotiView>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingVertical: 4 },
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
