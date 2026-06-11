import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FadeUp from '@/components/ui/FadeUp';
import OTPInput from '@/components/ui/OTPInput';
import AnimatedButton from '@/components/ui/AnimatedButton';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { isValidOtp } from '@/utils/validators';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import type { AuthStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'OTP'>;
type Rt = RouteProp<AuthStackParamList, 'OTP'>;

export default function OTPScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { t } = useTranslation();
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const language = useLanguageStore((s) => s.language);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verify = () => {
    setLoading(true);
    setTimeout(() => {
      setToken('mock-id-token');
      setUser({
        uid: `user-${params.phone}`,
        phone: `+91${params.phone}`,
        name: params.name ?? 'Skyvora Farmer',
        language,
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
    }, 900);
  };

  const isSignup = params.mode === 'signup';
  const title =
    isSignup && params.name
      ? t('otpTitleHi', { name: params.name.split(' ')[0] })
      : t('verifyNumber');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.dark.background, '#0B1B38', Colors.dark.background]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={22} color={Colors.dark.textPrimary} />
        </Pressable>

        <View style={styles.body}>
          <FadeUp>
            <Text style={styles.kicker}>{isSignup ? t('almostThere') : t('welcomeBack')}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.sub}>
              {t('otpSub', { phone: `+91 ${params.phone}` })}
            </Text>
          </FadeUp>

          <FadeUp delay={150}>
            <View style={styles.otpCard}>
              <OTPInput value={otp} onChange={setOtp} dark />
              <View style={styles.resendRow}>
                {seconds > 0 ? (
                  <Text style={styles.resendMuted}>
                    {t('resendIn', { seconds: seconds.toString().padStart(2, '0') })}
                  </Text>
                ) : (
                  <Text style={styles.resend} onPress={() => setSeconds(30)}>
                    {t('resendOtp')}
                  </Text>
                )}
              </View>
            </View>
          </FadeUp>

          <AnimatedButton
            label={isSignup ? t('verifyCreateAccount') : t('verifySignIn')}
            disabled={!isValidOtp(otp)}
            onPress={verify}
          />
          <Text style={styles.devHint}>{t('demoHint')}</Text>
        </View>
      </SafeAreaView>
      <LoadingOverlay visible={loading} message={t('verifying')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  safe: { flex: 1 },
  back: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.lg,
    marginTop: Spacing.sm,
  },
  body: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing['2xl'], gap: Spacing.lg },
  kicker: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.xs,
    color: Colors.primaryLight,
    letterSpacing: Typography.tracking.wide,
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes['2xl'],
    color: Colors.dark.textPrimary,
    letterSpacing: Typography.tracking.tight,
  },
  sub: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.base,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  otpCard: {
    backgroundColor: Colors.dark.glassStrong,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: Colors.dark.borderStrong,
    padding: Spacing.lg,
    gap: Spacing.base,
    marginTop: Spacing.sm,
  },
  resendRow: { alignItems: 'center' },
  resendMuted: {
    fontFamily: Typography.fontBody,
    color: Colors.dark.textMuted,
    fontSize: Typography.sizes.sm,
  },
  resend: {
    fontFamily: Typography.fontBodySemi,
    color: Colors.primaryLight,
    fontSize: Typography.sizes.sm,
  },
  devHint: {
    textAlign: 'center',
    color: Colors.dark.textMuted,
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.xs,
  },
});
