import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { MotiView } from './Motion';
import { Colors, Radius } from '@/constants/theme';

interface Props {
  size?: number;
  color?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export default function PulseRing({
  size = 64,
  color = Colors.primaryLight,
  children,
  style,
}: Props) {
  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      {[0, 1].map((i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.8 }}
          transition={{
            type: 'timing',
            duration: 1800,
            loop: true,
            delay: i * 900,
          }}
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: Radius.full, backgroundColor: color },
          ]}
        />
      ))}
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
});
