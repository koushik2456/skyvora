import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import SearchableDropdown from '@/components/ui/SearchableDropdown';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useLocationStore } from '@/store/locationStore';
import { isValidFarmerName } from '@/utils/validators';

interface Props {
  farmerName: string;
  onFarmerName: (name: string) => void;
}

export default function LocationStep({ farmerName, onFarmerName }: Props) {
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
      <Text style={styles.title}>Where is your farm?</Text>
      <Text style={styles.subtitle}>Select your location to find available services.</Text>

      <SearchableDropdown
        label="State"
        placeholder="Select your state"
        items={allStates}
        value={selectedState}
        onSelect={(item) => setSelectedState(item as any)}
      />
      <SearchableDropdown
        label="District"
        placeholder="Select your district"
        items={availableDistricts}
        value={selectedDistrict}
        onSelect={(item) => setSelectedDistrict(item as any)}
        disabled={!selectedState}
        disabledHint="Select State first"
      />
      <SearchableDropdown
        label="Mandal"
        placeholder="Select your mandal"
        items={availableMandals}
        value={selectedMandal}
        onSelect={(item) => setSelectedMandal(item as any)}
        disabled={!selectedDistrict}
        disabledHint="Select District first"
      />
      {selectedMandal && availableVillages.length === 0 ? (
        // LGD has no villages for some urban mandals — fall back to free text
        <View>
          <Text style={styles.fieldLabel}>Village / Locality</Text>
          <TextInput
            value={selectedVillage?.name ?? ''}
            onChangeText={(t) =>
              setSelectedVillage({ id: `custom-${selectedMandal.id}`, name: t })
            }
            placeholder="Type your village or locality name"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            maxLength={80}
          />
        </View>
      ) : (
        <SearchableDropdown
          label="Village"
          placeholder="Select your village"
          items={availableVillages}
          value={selectedVillage}
          onSelect={(item) => setSelectedVillage(item as any)}
          disabled={!selectedMandal}
          disabledHint="Select Mandal first"
        />
      )}

      <View>
        <Text style={styles.fieldLabel}>Farmer Name</Text>
        <TextInput
          value={farmerName}
          onChangeText={onFarmerName}
          onBlur={() => setTouched(true)}
          placeholder="Enter full name"
          placeholderTextColor={Colors.textMuted}
          style={[
            styles.input,
            farmerName.length > 0 && (nameValid ? styles.inputValid : styles.inputError),
          ]}
          maxLength={80}
        />
        {touched && farmerName.length > 0 && !nameValid ? (
          <Text style={styles.error}>Use 2-80 letters (spaces and dots allowed).</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.base },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.xl, color: Colors.textPrimary },
  subtitle: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: -Spacing.sm },
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
    color: Colors.textPrimary,
  },
  inputValid: { borderColor: Colors.primary },
  inputError: { borderColor: Colors.danger },
  error: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.danger, marginTop: 4 },
});
