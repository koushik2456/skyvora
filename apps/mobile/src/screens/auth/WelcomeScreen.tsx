import React, { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AnimatedButton from '@/components/ui/AnimatedButton';
import SegmentedControl from '@/components/ui/SegmentedControl';
import FadeUp from '@/components/ui/FadeUp';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { isValidFarmerName, isValidPhone } from '@/utils/validators';
import type { AuthMode } from '@/store/authStore';
import type { AuthStackParamList } from '@/navigation/types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const phoneValid = isValidPhone(phone);
  const nameValid = isValidFarmerName(name);
  const canContinue = mode === 'signin' ? phoneValid : phoneValid && nameValid;

  const submit = () => {
    navigation.navigate('OTP', {
      phone,
      mode,
      name: mode === 'signup' ? name.trim() : undefined,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.heroBg}>
        <LinearGradient
          colors={['rgba(8,17,32,0.55)', 'rgba(8,17,32,0.92)', Colors.dark.background]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FadeUp>
              <LanguageSelector dark showLabel label={t('language')} />
            </FadeUp>

            <View style={styles.hero}>
              <FadeUp delay={100}>
                <Text style={styles.kicker}>{t('welcomeKicker')}</Text>
                <Text style={styles.brand}>SKYVORA</Text>
              </FadeUp>
              <FadeUp delay={200}>
                <Text style={styles.tagline}>{t('welcomeTagline')}</Text>
              </FadeUp>
            </View>

            <FadeUp delay={350} distance={24}>
              <View style={styles.card}>
                <SegmentedControl<AuthMode>
                  dark
                  options={[
                    { label: t('signIn'), value: 'signin' },
                    { label: t('signUp'), value: 'signup' },
                  ]}
                  value={mode}
                  onChange={setMode}
                />

                {mode === 'signup' && (
                  <View style={styles.field}>
                    <Text style={styles.label}>{t('fullName')}</Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder={t('fullNamePlaceholder')}
                      placeholderTextColor={Colors.dark.textMuted}
                      style={styles.input}
                      maxLength={80}
                    />
                  </View>
                )}

                <View style={styles.field}>
                  <Text style={styles.label}>{t('mobileNumber')}</Text>
                  <View style={[styles.phoneRow, phoneValid && styles.inputValid]}>
                    <Text style={styles.code}>+91</Text>
                    <View style={styles.divider} />
                    <TextInput
                      value={phone}
                      onChangeText={(v) => setPhone(v.replace(/\D/g, '').slice(0, 10))}
                      placeholder={t('phonePlaceholder')}
                      placeholderTextColor={Colors.dark.textMuted}
                      keyboardType="number-pad"
                      style={styles.phoneInput}
                      maxLength={10}
                    />
                  </View>
                </View>

                <Text style={styles.hint}>{t('otpHint')}</Text>

                <AnimatedButton
                  label={mode === 'signin' ? t('continueWithOtp') : t('createAccount')}
                  disabled={!canContinue}
                  onPress={submit}
                  style={{ marginTop: Spacing.sm }}
                />
              </View>
            </FadeUp>

            <FadeUp delay={500}>
              <Text style={styles.terms}>
                {t('termsAgree', { terms: t('terms'), privacy: t('privacyPolicy') })}
              </Text>
            </FadeUp>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  heroBg: { ...StyleSheet.absoluteFillObject },
  flex: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.lg,
  },
  hero: { alignItems: 'center', marginBottom: Spacing.md },
  kicker: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.xs,
    color: Colors.primaryLight,
    letterSpacing: Typography.tracking.wide,
    textAlign: 'center',
  },
  brand: {
    fontFamily: Typography.fontHero,
    fontSize: Typography.sizes['3xl'],
    color: Colors.dark.textPrimary,
    letterSpacing: 6,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.base,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  card: {
    backgroundColor: Colors.dark.glassStrong,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: Colors.dark.borderStrong,
    padding: Spacing.lg,
    gap: Spacing.base,
  },
  field: { gap: Spacing.sm },
  label: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: Typography.tracking.wide,
  },
  input: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: Radius.full,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizes.md,
    color: Colors.dark.textPrimary,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: Radius.full,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
  },
  inputValid: { borderColor: Colors.primary },
  code: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.md,
    color: Colors.dark.textPrimary,
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: Colors.dark.borderStrong,
    marginHorizontal: Spacing.md,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizes.md,
    color: Colors.dark.textPrimary,
    letterSpacing: 1,
  },
  hint: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textMuted,
  },
  terms: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
