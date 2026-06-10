import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Check, ChevronDown, Search, X } from 'lucide-react-native';
import { MotiView } from './Motion';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useLocationSearch } from '@/hooks/useLocationSearch';

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

export default function SearchableDropdown({
  label,
  placeholder,
  items,
  value,
  onSelect,
  disabled,
  disabledHint,
}: Props) {
  const sheetRef = useRef<BottomSheet>(null);
  const [query, setQuery] = useState('');
  const snapPoints = useMemo(() => ['65%', '90%'], []);
  const filtered = useLocationSearch(items, query);

  const open = useCallback(() => {
    if (disabled) return;
    setQuery('');
    sheetRef.current?.expand();
  }, [disabled]);

  const close = useCallback(() => sheetRef.current?.close(), []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.45} />
    ),
    []
  );

  return (
    <>
      <Pressable onPress={open} disabled={disabled}>
        <MotiView
          animate={{
            borderColor: value ? Colors.primary : Colors.border,
            opacity: disabled ? 0.55 : 1,
          }}
          style={styles.field}
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
        </MotiView>
      </Pressable>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: Colors.border }}
        backgroundStyle={styles.sheetBg}
      >
        <BottomSheetView style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Select {label}</Text>
          <View style={styles.searchBox}>
            <Search size={18} color={Colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={`Search ${label.toLowerCase()}...`}
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
              autoFocus
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <X size={18} color={Colors.textMuted} />
              </Pressable>
            )}
          </View>
        </BottomSheetView>
        <BottomSheetFlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.empty}>No results for “{query}”</Text>
          }
          renderItem={({ item }) => {
            const isSelected = value?.id === item.id;
            return (
              <Pressable
                style={[styles.row, isSelected && styles.rowSelected]}
                onPress={() => {
                  onSelect(item);
                  close();
                }}
              >
                <Text style={[styles.rowText, isSelected && styles.rowTextSelected]}>
                  {item.name}
                </Text>
                {isSelected && <Check size={18} color={Colors.primary} strokeWidth={3} />}
              </Pressable>
            );
          }}
        />
      </BottomSheet>
    </>
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
  sheetBg: { borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'] },
  fieldText: { flex: 1 },
  label: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  value: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  placeholder: { fontFamily: Typography.fontBody, color: Colors.textMuted },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetHeader: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  sheetTitle: {
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing['3xl'] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowSelected: {},
  rowText: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  rowTextSelected: { fontFamily: Typography.fontBodySemi, color: Colors.primary },
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontFamily: Typography.fontBody,
    marginTop: Spacing.xl,
  },
});
