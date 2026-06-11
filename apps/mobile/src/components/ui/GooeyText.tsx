import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { MotiView } from '@/components/ui/Motion';
import { Colors, Typography } from '@/constants/theme';

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: string;
}

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.3,
  style,
  textStyle,
  color = Colors.primaryLight,
}: GooeyTextProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      timerRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % texts.length);
        setVisible(true);
        timerRef.current = setTimeout(cycle, (morphTime + cooldownTime) * 1000);
      }, morphTime * 500);
    };
    timerRef.current = setTimeout(cycle, (morphTime + cooldownTime) * 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [texts.length, morphTime, cooldownTime]);

  return (
    <View style={[styles.wrap, style]}>
      <MotiView
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.92,
          translateY: visible ? 0 : -6,
        }}
        transition={{ type: 'timing', duration: morphTime * 500 }}
      >
        <Text style={[styles.text, { color }, textStyle]}>{texts[index]}</Text>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontFamily: Typography.heading,
    fontSize: 22,
    letterSpacing: 0.5,
  },
});
