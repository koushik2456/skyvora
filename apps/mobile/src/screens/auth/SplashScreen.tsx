import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from '@/components/ui/Motion';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DroneLogo from '@/components/ui/DroneLogo';
import { ShaderAnimation } from '@/components/ui/ShaderAnimation';
import { GooeyText } from '@/components/ui/GooeyText';
import LoadingBar from '@/components/ui/LoadingBar';
import { Colors, Spacing, Typography } from '@/constants/theme';
import type { AuthStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ShaderAnimation />

      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', delay: 300 }}
        style={styles.logoContainer}
      >
        <DroneLogo size={80} color={Colors.mint} accent={Colors.sage} />
        <Text style={styles.brandName}>SKYVORA</Text>

        <GooeyText
          texts={['Precision', 'Agriculture', 'Services', 'Skyvora']}
          morphTime={1.2}
          cooldownTime={0.4}
          color={Colors.sage}
        />

        <View style={styles.taglineWrap}>
          <Text style={styles.tagline}>Powered by Drone Technology</Text>
          <View style={styles.underline} />
        </View>
      </MotiView>

      <LoadingBar color={Colors.sage} duration={2500} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skyTop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  brandName: {
    fontFamily: Typography.display,
    fontSize: Typography.sizes['3xl'],
    color: Colors.textOnDark,
    letterSpacing: 6,
    marginTop: Spacing.sm,
  },
  taglineWrap: { alignItems: 'center', marginTop: Spacing.sm },
  tagline: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.sm,
    color: Colors.textOnDarkMuted,
  },
  underline: {
    width: 48,
    height: 2,
    backgroundColor: Colors.sage,
    marginTop: Spacing.sm,
    borderRadius: 2,
  },
});
