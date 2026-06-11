import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MotiView } from '@/components/ui/Motion';
import ChipSelector from '@/components/ui/ChipSelector';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { CROP_TYPE_LABELS, AREA_UNITS } from '@/constants/services';
import { useTranslation } from '@/hooks/useTranslation';
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
  const { t, tCrop, tAreaUnit } = useTranslation();
  const [otherCrop, setOtherCrop] = useState('');
  const numeric = parseFloat(areaValue) || 0;
  const acres = toAcres(numeric, areaUnit);
  const valid = numeric > 0 && isAreaValid(acres);
  const acresLabel = t('acres');

  const cropOptions = useMemo(
    () => CROP_TYPE_LABELS.map((c) => ({ value: c, label: tCrop(c) })),
    [tCrop]
  );

  const unitOptions = useMemo(
    () => AREA_UNITS.map((u) => ({ value: u.value, label: tAreaUnit(u.value) })),
    [tAreaUnit]
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{t('cropAreaTitle')}</Text>

      <Text style={styles.section}>{t('lblCropType')}</Text>
      <ChipSelector options={cropOptions} value={cropType} onChange={onCrop} />
      {cropType === 'Other' ? (
        <TextInput
          value={otherCrop}
          onChangeText={(text) => {
            setOtherCrop(text);
            onCrop(text.length ? text : 'Other');
          }}
          placeholder={t('phEnterCropName')}
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />
      ) : null}

      <Text style={styles.section}>{t('lblArea')}</Text>
      <TextInput
        value={areaValue}
        onChangeText={(v) => onAreaValue(v.replace(/[^0-9.]/g, ''))}
        placeholder={t('phEnterArea')}
        placeholderTextColor={Colors.textMuted}
        keyboardType="decimal-pad"
        style={[styles.input, numeric > 0 && (valid ? styles.inputValid : styles.inputError)]}
      />

      <SegmentedControl
        options={unitOptions}
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
              {t('areaEquals', {
                value: numeric,
                unit: tAreaUnit(areaUnit),
                acres,
                acresLabel,
              })}
            </Text>
          ) : (
            <Text style={styles.convErrorText}>
              {t('areaInvalid', {
                min: MIN_ACRES,
                max: MAX_ACRES,
                acresLabel,
                entered: acres,
              })}
            </Text>
          )}
        </MotiView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.base,
    backgroundColor: Colors.sectionBg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
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
  convErrorText: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.sm, color: Colors.danger, textAlign: 'center' },
});
