import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import SearchableDropdown from '@/components/ui/SearchableDropdown';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocationStore } from '@/store/locationStore';
import { isValidFarmerName } from '@/utils/validators';

interface Props {
  farmerName: string;
  onFarmerName: (name: string) => void;
}

export default function LocationStep({ farmerName, onFarmerName }: Props) {
  const { t } = useTranslation();
  const {
    allStates,
    selectedState,
    availableDistricts,
    selectedDistrict,
    availableMandals,
    selectedMandal,
    availableVillages,
    selectedVillage,
    setSelectedState,
    setSelectedDistrict,
    setSelectedMandal,
    setSelectedVillage,
  } = useLocationStore();
  const [touched, setTouched] = useState(false);

  const nameValid = isValidFarmerName(farmerName);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{t('locationTitle')}</Text>
      <Text style={styles.subtitle}>{t('locationSub')}</Text>

      <SearchableDropdown
        label={t('lblState')}
        placeholder={t('phSelectState')}
        items={allStates}
        value={selectedState}
        onSelect={(item) => setSelectedState(item as any)}
      />
      <SearchableDropdown
        label={t('lblDistrict')}
        placeholder={t('phSelectDistrict')}
        items={availableDistricts}
        value={selectedDistrict}
        onSelect={(item) => setSelectedDistrict(item as any)}
        disabled={!selectedState}
        disabledHint={t('hintSelectStateFirst')}
      />
      <SearchableDropdown
        label={t('lblMandal')}
        placeholder={t('phSelectMandal')}
        items={availableMandals}
        value={selectedMandal}
        onSelect={(item) => setSelectedMandal(item as any)}
        disabled={!selectedDistrict}
        disabledHint={t('hintSelectDistrictFirst')}
      />
      {selectedMandal && availableVillages.length === 0 ? (
        <View>
          <Text style={styles.fieldLabel}>{t('lblVillageLocality')}</Text>
          <TextInput
            value={selectedVillage?.name ?? ''}
            onChangeText={(text) =>
              setSelectedVillage({ id: `custom-${selectedMandal.id}`, name: text })
            }
            placeholder={t('phVillageLocality')}
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            maxLength={80}
          />
        </View>
      ) : (
        <SearchableDropdown
          label={t('lblVillage')}
          placeholder={t('phSelectVillage')}
          items={availableVillages}
          value={selectedVillage}
          onSelect={(item) => setSelectedVillage(item as any)}
          disabled={!selectedMandal}
          disabledHint={t('hintSelectMandalFirst')}
        />
      )}

      <View>
        <Text style={styles.fieldLabel}>{t('lblFarmerName')}</Text>
        <TextInput
          value={farmerName}
          onChangeText={onFarmerName}
          onBlur={() => setTouched(true)}
          placeholder={t('phEnterFullName')}
          placeholderTextColor={Colors.textMuted}
          style={[
            styles.input,
            farmerName.length > 0 && (nameValid ? styles.inputValid : styles.inputError),
          ]}
          maxLength={80}
        />
        {touched && farmerName.length > 0 && !nameValid ? (
          <Text style={styles.error}>{t('nameValidationError')}</Text>
        ) : null}
      </View>
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
  title: { fontFamily: Typography.heading, fontSize: Typography.sizes.xl, color: Colors.mint },
  subtitle: { fontFamily: Typography.body, fontSize: Typography.sizes.sm, color: Colors.sage, marginTop: -Spacing.sm },
  fieldLabel: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
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
    color: Colors.mint,
  },
  inputValid: { borderColor: Colors.sage },
  inputError: { borderColor: Colors.danger },
  error: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.danger, marginTop: 4 },
});
