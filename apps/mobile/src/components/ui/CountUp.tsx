import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';
import {
  Easing,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface Props {
  value: number;
  duration?: number;
  style?: TextStyle | TextStyle[];
  decimals?: number;
  suffix?: string;
}

export default function CountUp({ value, duration = 1200, style, decimals = 0, suffix = '' }: Props) {
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration, progress]);

  useAnimatedReaction(
    () => progress.value,
    (v) => {
      runOnJS(setDisplay)(v.toFixed(decimals));
    }
  );

  return (
    <Text style={style}>
      {display}
      {suffix}
    </Text>
  );
}
