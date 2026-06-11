import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Search, X } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocationPickerStore, type PickerItem } from '@/store/locationPickerStore';

export default function GlobalLocationPicker() {
  const { t } = useTranslation();
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['88%'], []);
  const [query, setQuery] = useState('');

  const open = useLocationPickerStore((s) => s.open);
  const label = useLocationPickerStore((s) => s.label);
  const items = useLocationPickerStore((s) => s.items);
  const selectedId = useLocationPickerStore((s) => s.selectedId);
  const onSelect = useLocationPickerStore((s) => s.onSelect);
  const hide = useLocationPickerStore((s) => s.hide);

  const filtered = useLocationSearch(items, query);

  const close = useCallback(() => {
    setQuery('');
    hide();
  }, [hide]);

  const pick = useCallback(
    (item: PickerItem) => {
      onSelect?.(item);
      close();
    },
    [close, onSelect]
  );

  useEffect(() => {
    if (Platform.OS === 'web' || !open) return;
    setQuery('');
    const timer = setTimeout(() => sheetRef.current?.present(), 50);
    return () => clearTimeout(timer);
  }, [open]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.65} />
    ),
    []
  );

  const renderRow = useCallback(
    ({ item }: { item: PickerItem }) => {
      const isSelected = selectedId === item.id;
      return (
        <Pressable
          style={[styles.row, isSelected && styles.rowSelected]}
          onPress={() => pick(item)}
        >
          <Text style={[styles.rowText, isSelected && styles.rowTextSelected]}>{item.name}</Text>
          {isSelected ? <Check size={18} color={Colors.sage} strokeWidth={3} /> : null}
        </Pressable>
      );
    },
    [pick, selectedId]
  );

  const SearchHeader = useMemo(
    () => (
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>{t('selectItem', { label })}</Text>
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.sage} />
          {Platform.OS === 'web' ? (
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('searchItem', { label: label.toLowerCase() })}
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
              autoFocus
            />
          ) : (
            <BottomSheetTextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('searchItem', { label: label.toLowerCase() })}
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
            />
          )}
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <X size={18} color={Colors.sage} />
            </Pressable>
          ) : null}
        </View>
      </View>
    ),
    [label, query, t]
  );

  if (!open) return null;

  if (Platform.OS === 'web') {
    return (
      <Modal visible transparent animationType="slide" onRequestClose={close}>
        <View style={styles.webRoot}>
          <Pressable style={styles.webBackdrop} onPress={close} />
          <View style={[styles.webSheet, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
            {SearchHeader}
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              renderItem={renderRow}
              keyboardShouldPersistTaps="handled"
              style={styles.listFlex}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.empty}>{t('noResultsFor', { query })}</Text>
              }
            />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: Colors.sage, width: 40 }}
      backgroundStyle={styles.sheetBg}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      topInset={insets.top}
      onDismiss={close}
    >
      <BottomSheetFlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        ListHeaderComponent={SearchHeader}
        keyboardShouldPersistTaps="handled"
        style={styles.listFlex}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{t('noResultsFor', { query })}</Text>}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: Colors.bgForest,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
  },
  sheetHeader: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  sheetTitle: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.lg,
    color: Colors.mint,
    marginBottom: Spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgEmerald,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontFamily: Typography.body,
    fontSize: Typography.sizes.base,
    color: Colors.mint,
  },
  listFlex: { flex: 1 },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing['3xl'] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowSelected: { backgroundColor: 'rgba(35, 83, 71, 0.35)', borderRadius: Radius.sm },
  rowText: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.base,
    color: Colors.mint,
    flex: 1,
  },
  rowTextSelected: { fontFamily: Typography.bodyMed, color: Colors.sage },
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontFamily: Typography.body,
    marginTop: Spacing.xl,
  },
  webRoot: { flex: 1, justifyContent: 'flex-end' },
  webBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.overlay },
  webSheet: {
    height: '88%',
    backgroundColor: Colors.bgForest,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    paddingTop: Spacing.lg,
  },
});
