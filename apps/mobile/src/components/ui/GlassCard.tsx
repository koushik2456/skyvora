import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  strong?: boolean;
}

/** Glassmorphism panel for dark sections (translucent fill + hairline border). */
export default function GlassCard({ children, style, strong }: Props) {
  return (
    <View style={[styles.glass, strong && styles.strong, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: Radius.xl,
    padding: Spacing.base,
  },
  strong: {
    backgroundColor: Colors.dark.glassStrong,
    borderColor: Colors.dark.borderStrong,
  },
});
