import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useLocationPickerStore } from '@/store/locationPickerStore';

interface Item {
  id: string;
  name: string;
}

interface Props {
  label: string;
  placeholder: string;
  items: Item[];
  value: Item | null;
  onSelect: (item: Item) => void;
  disabled?: boolean;
  disabledHint?: string;
}

/** Field trigger only — list renders in GlobalLocationPicker at app root. */
export default function SearchableDropdown({
  label,
  placeholder,
  items,
  value,
  onSelect,
  disabled,
  disabledHint,
}: Props) {
  const open = useCallback(() => {
    if (disabled) return;
    useLocationPickerStore.getState().show({
      label,
      items,
      selectedId: value?.id ?? null,
      onSelect,
    });
  }, [disabled, items, label, onSelect, value?.id]);

  return (
    <Pressable
      onPress={open}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Select ${label}`}
      style={({ pressed }) => [
        styles.field,
        {
          borderColor: value ? Colors.primary : Colors.border,
          opacity: disabled ? 0.55 : pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.fieldText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value ? value.name : disabled ? disabledHint ?? placeholder : placeholder}
        </Text>
      </View>
      {value ? (
        <View style={styles.checkDot}>
          <Check size={14} color={Colors.white} strokeWidth={3} />
        </View>
      ) : (
        <ChevronDown size={20} color={Colors.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 56,
    gap: Spacing.sm,
  },
  fieldText: { flex: 1 },
  label: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  value: { fontFamily: Typography.bodyMed, fontSize: Typography.sizes.base, color: Colors.mint },
  placeholder: { fontFamily: Typography.fontBody, color: Colors.textMuted },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
