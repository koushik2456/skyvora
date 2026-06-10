import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MotiView } from '@/components/ui/Motion';
import ChipSelector from '@/components/ui/ChipSelector';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { CROP_TYPES, AREA_UNITS } from '@/constants/services';
import { toAcres, isAreaValid, MIN_ACRES, MAX_ACRES } from '@/utils/areaConverter';
import type { AreaUnit } from '@/types';

interface Props {
  cropType: string | null;
  areaValue: string;
  areaUnit: AreaUnit;
  onCrop: (c: string) => void;
  onAreaValue: (v: string) => void;
  onAreaUnit: (u: AreaUnit) => void;
}

export default function CropAreaStep({
  cropType,
  areaValue,
  areaUnit,
  onCrop,
  onAreaValue,
  onAreaUnit,
}: Props) {
  const [otherCrop, setOtherCrop] = useState('');
  const numeric = parseFloat(areaValue) || 0;
  const acres = toAcres(numeric, areaUnit);
  const valid = numeric > 0 && isAreaValid(acres);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Crop & Area</Text>

      <Text style={styles.section}>Crop Type</Text>
      <ChipSelector options={CROP_TYPES} value={cropType} onChange={onCrop} />
      {cropType === 'Other' ? (
        <TextInput
          value={otherCrop}
          onChangeText={(t) => {
            setOtherCrop(t);
            onCrop(t.length ? t : 'Other');
          }}
          placeholder="Enter crop name"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />
      ) : null}

      <Text style={styles.section}>Area</Text>
      <TextInput
        value={areaValue}
        onChangeText={(t) => onAreaValue(t.replace(/[^0-9.]/g, ''))}
        placeholder="Enter area"
        placeholderTextColor={Colors.textMuted}
        keyboardType="decimal-pad"
        style={[styles.input, numeric > 0 && (valid ? styles.inputValid : styles.inputError)]}
      />

      <SegmentedControl
        options={AREA_UNITS}
        value={areaUnit}
        onChange={(v) => onAreaUnit(v as AreaUnit)}
      />

      {numeric > 0 ? (
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={[styles.convCard, !valid && styles.convError]}
        >
          {valid ? (
            <Text style={styles.convText}>
              {numeric} {areaUnit} = <Text style={styles.convAcres}>{acres} Acres</Text>
            </Text>
          ) : (
            <Text style={styles.convErrorText}>
              Area must be between {MIN_ACRES} and {MAX_ACRES} acres ({acres} acres entered).
            </Text>
          )}
        </MotiView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.base },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.xl, color: Colors.textPrimary },
  section: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: Spacing.sm },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    minHeight: 54,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  inputValid: { borderColor: Colors.primary },
  inputError: { borderColor: Colors.danger },
  convCard: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.base,
    alignItems: 'center',
  },
  convError: { backgroundColor: '#FDECEC' },
  convText: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.base, color: Colors.textSecondary },
  convAcres: { fontFamily: Typography.fontDisplaySemi, color: Colors.primary },
  convErrorText: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.sm, color: Colors.danger, textAlign: 'center' },
});
