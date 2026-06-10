import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from '@/components/ui/Motion';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FadeScale from '@/components/ui/FadeScale';
import TypewriterText from '@/components/ui/TypewriterText';
import DroneLogo from '@/components/ui/DroneLogo';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { AuthStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2400);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.dark.background, '#0B1B38', Colors.dark.background]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, styles.orbBlue]} />
      <View style={[styles.orb, styles.orbOrange]} />

      <MotiView
        from={{ translateY: 40, opacity: 0 }}
        animate={{ translateY: -340, opacity: 0.16 }}
        transition={{ type: 'timing', duration: 2400 }}
        style={styles.flyingDrone}
      >
        <DroneLogo size={70} color={Colors.primaryLight} accent={Colors.accent} />
      </MotiView>

      <FadeScale delay={150}>
        <View style={styles.logoBadge}>
          <DroneLogo size={88} color={Colors.white} accent={Colors.accent} />
        </View>
      </FadeScale>

      <FadeScale delay={450}>
        <Text style={styles.brand}>SKYVORA</Text>
      </FadeScale>

      <TypewriterText
        text="Precision Agriculture at Your Fingertips"
        startDelay={900}
        style={styles.tagline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.dark.background,
  },
  orb: { position: 'absolute', borderRadius: 999 },
  orbBlue: {
    width: 320,
    height: 320,
    top: -90,
    right: -110,
    backgroundColor: Colors.primary,
    opacity: 0.2,
  },
  orbOrange: {
    width: 240,
    height: 240,
    bottom: -70,
    left: -90,
    backgroundColor: Colors.accent,
    opacity: 0.12,
  },
  flyingDrone: { position: 'absolute', bottom: 80 },
  logoBadge: {
    width: 140,
    height: 140,
    borderRadius: Radius['2xl'],
    backgroundColor: Colors.dark.glassStrong,
    borderWidth: 1,
    borderColor: Colors.dark.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  brand: {
    fontFamily: Typography.fontHero,
    fontSize: Typography.sizes['3xl'],
    color: Colors.dark.textPrimary,
    letterSpacing: 6,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.base,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    minHeight: 22,
  },
});
