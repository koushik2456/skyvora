import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MotiView } from './Motion';
import { Colors, Radius, Typography } from '@/constants/theme';

interface Props {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  /** Render with dark-section styling. */
  dark?: boolean;
}

export default function OTPInput({ length = 6, value, onChange, dark }: Props) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const digits = value.split('');
  const activeIndex = value.length;

  return (
    <View style={styles.wrap}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.hidden}
        caretHidden
      />
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => {
          const isActive = focused && i === activeIndex;
          const filled = !!digits[i];
          return (
            <MotiView
              key={i}
              animate={{
                scale: filled ? 1.05 : 1,
                borderColor: isActive
                  ? Colors.primaryLight
                  : filled
                  ? Colors.primary
                  : dark
                  ? Colors.dark.borderStrong
                  : Colors.border,
              }}
              transition={{ type: 'timing', duration: 150 }}
              style={[styles.box, dark && styles.boxDark]}
              onTouchEnd={() => inputRef.current?.focus()}
            >
              {filled ? (
                <MotiView
                  from={{ opacity: 0, translateY: 6 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 120 }}
                >
                  <Text style={[styles.digitText, dark && styles.digitTextDark]}>
                    {digits[i]}
                  </Text>
                </MotiView>
              ) : null}
            </MotiView>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  box: {
    flex: 1,
    aspectRatio: 0.86,
    maxWidth: 54,
    borderRadius: Radius.md,
    borderWidth: 2,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxDark: { backgroundColor: Colors.dark.glass },
  digitText: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes.xl,
    color: Colors.textPrimary,
  },
  digitTextDark: { color: Colors.dark.textPrimary },
});
