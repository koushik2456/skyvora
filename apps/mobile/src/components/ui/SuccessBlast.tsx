import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MotiView } from './Motion';
import { Check } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

const PIECES = Array.from({ length: 24 });
const COLORS = [Colors.primary, Colors.primaryLight, Colors.secondary, Colors.sky, Colors.success];

export default function SuccessBlast({ size = 120 }: { size?: number }) {
  return (
    <View style={styles.wrap}>
      {PIECES.map((_, i) => {
        const angle = (i / PIECES.length) * Math.PI * 2;
        const dist = 120 + (i % 3) * 24;
        return (
          <MotiView
            key={i}
            from={{ opacity: 1, translateX: 0, translateY: 0, scale: 1 }}
            animate={{
              opacity: 0,
              translateX: Math.cos(angle) * dist,
              translateY: Math.sin(angle) * dist,
              scale: 0.4,
            }}
            transition={{ type: 'timing', duration: 1100, delay: 200 }}
            style={[
              styles.piece,
              { backgroundColor: COLORS[i % COLORS.length], borderRadius: i % 2 ? 2 : 8 },
            ]}
          />
        );
      })}
      <MotiView
        from={{ scale: 0, rotate: '-30deg' }}
        animate={{ scale: 1, rotate: '0deg' }}
        transition={{ type: 'spring', damping: 10, stiffness: 120, delay: 150 }}
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Check size={size * 0.5} color={Colors.white} strokeWidth={3} />
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  piece: { position: 'absolute', width: 10, height: 10 },
  circle: {
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
});
