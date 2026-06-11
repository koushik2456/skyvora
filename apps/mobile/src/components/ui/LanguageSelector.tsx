import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LANGUAGES, type AppLanguage } from '@/i18n/types';
import { useLanguageStore } from '@/store/languageStore';
import { useAuthStore } from '@/store/authStore';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface Props {
  /** For dark auth screens. */
  dark?: boolean;
  /** Show section label above pills. */
  showLabel?: boolean;
  label?: string;
}

export default function LanguageSelector({ dark, showLabel, label }: Props) {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const user = useAuthStore((s) => s.user);
  const updateUserLanguage = useAuthStore((s) => s.updateUserLanguage);

  const onSelect = useCallback(
    (code: AppLanguage) => {
      setLanguage(code);
      if (user) updateUserLanguage(code);
    },
    [setLanguage, updateUserLanguage, user]
  );

  return (
    <View style={styles.wrap}>
      {showLabel && label ? (
        <Text style={[styles.sectionLabel, dark && styles.sectionLabelDark]}>{label}</Text>
      ) : null}
      <View style={styles.row}>
        {LANGUAGES.map((opt) => {
          const active = language === opt.code;
          return (
            <Pressable
              key={opt.code}
              onPress={() => onSelect(opt.code)}
              style={[
                styles.pill,
                dark ? styles.pillDark : styles.pillLight,
                active && (dark ? styles.pillActiveDark : styles.pillActiveLight),
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  dark ? styles.pillTextDark : styles.pillTextLight,
                  active && styles.pillTextActive,
                ]}
              >
                {opt.nativeLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  sectionLabel: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.tracking.wide,
    textTransform: 'uppercase',
  },
  sectionLabelDark: { color: Colors.dark.textSecondary },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  pill: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  pillLight: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  pillDark: {
    backgroundColor: Colors.dark.glass,
    borderColor: Colors.dark.border,
  },
  pillActiveLight: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillActiveDark: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.sm },
  pillTextLight: { color: Colors.textSecondary },
  pillTextDark: { color: Colors.dark.textSecondary },
  pillTextActive: { color: Colors.mint, fontFamily: Typography.bodyMed },
});
