import React, { useState } from 'react';
import {
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
import { MotiView } from '@/components/ui/Motion';
import AnimatedButton from '@/components/ui/AnimatedButton';
import SegmentedControl from '@/components/ui/SegmentedControl';
import GlassCard from '@/components/ui/GlassCard';
import FadeUp from '@/components/ui/FadeUp';
import DroneLogo from '@/components/ui/DroneLogo';
import PulseRing from '@/components/ui/PulseRing';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { isValidFarmerName, isValidPhone } from '@/utils/validators';
import type { AuthMode } from '@/store/authStore';
import type { AuthStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
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

      {/* Cinematic dark hero backdrop */}
      <LinearGradient
        colors={[Colors.dark.background, '#0B1B38', Colors.dark.background]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, styles.orbBlue]} />
      <View style={[styles.orb, styles.orbOrange]} />

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
            <View style={styles.hero}>
              <PulseRing size={150} color={Colors.primary}>
                <MotiView
                  from={{ opacity: 0, scale: 0.7, translateY: 12 }}
                  animate={{ opacity: 1, scale: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 600 }}
                  style={styles.logoBadge}
                >
                  <DroneLogo size={64} color={Colors.white} accent={Colors.accent} />
                </MotiView>
              </PulseRing>

              <FadeUp delay={150}>
                <Text style={styles.brand}>SKYVORA</Text>
              </FadeUp>
              <FadeUp delay={280}>
                <Text style={styles.tagline}>
                  Precision drone services for the modern farm
                </Text>
              </FadeUp>
            </View>

            <FadeUp delay={400} distance={32}>
              <GlassCard style={styles.card} strong>
                <SegmentedControl<AuthMode>
                  dark
                  options={[
                    { label: 'Sign In', value: 'signin' },
                    { label: 'Sign Up', value: 'signup' },
                  ]}
                  value={mode}
                  onChange={setMode}
                />

                {mode === 'signup' && (
                  <View style={styles.field}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter your full name"
                      placeholderTextColor={Colors.dark.textMuted}
                      style={styles.input}
                      maxLength={80}
                    />
                  </View>
                )}

                <View style={styles.field}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <View style={[styles.phoneRow, phoneValid && styles.inputValid]}>
                    <Text style={styles.code}>+91</Text>
                    <View style={styles.divider} />
                    <TextInput
                      value={phone}
                      onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit number"
                      placeholderTextColor={Colors.dark.textMuted}
                      keyboardType="number-pad"
                      style={styles.phoneInput}
                      maxLength={10}
                    />
                  </View>
                </View>

                <Text style={styles.hint}>
                  We'll send a 6-digit OTP to verify your number.
                </Text>

                <AnimatedButton
                  label={mode === 'signin' ? 'Sign In with OTP' : 'Create Account'}
                  disabled={!canContinue}
                  onPress={submit}
                  style={{ marginTop: Spacing.base }}
                />
              </GlassCard>
            </FadeUp>

            <FadeUp delay={550}>
              <Text style={styles.terms}>
                By continuing you agree to our <Text style={styles.link}>Terms</Text> &{' '}
                <Text style={styles.link}>Privacy Policy</Text>.
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
  flex: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, justifyContent: 'center' },
  orb: { position: 'absolute', borderRadius: 999, opacity: 0.22 },
  orbBlue: {
    width: 320,
    height: 320,
    top: -90,
    right: -110,
    backgroundColor: Colors.primary,
  },
  orbOrange: {
    width: 240,
    height: 240,
    bottom: -70,
    left: -90,
    backgroundColor: Colors.accent,
    opacity: 0.14,
  },
  hero: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  logoBadge: {
    width: 108,
    height: 108,
    borderRadius: Radius['2xl'],
    backgroundColor: Colors.dark.glassStrong,
    borderWidth: 1,
    borderColor: Colors.dark.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: Typography.fontHero,
    fontSize: Typography.sizes['3xl'],
    color: Colors.dark.textPrimary,
    letterSpacing: 6,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.base,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  card: { padding: Spacing.lg, gap: Spacing.base },
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
    marginTop: Spacing.xl,
    lineHeight: 18,
  },
  link: { color: Colors.primaryLight, fontFamily: Typography.fontBodySemi },
});
