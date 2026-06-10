import React from 'react';
import { ViewStyle } from 'react-native';
import { MotiView } from '@/components/ui/Motion';
import { Motion } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  delay?: number;
  /** Initial vertical offset. */
  distance?: number;
  duration?: number;
  style?: ViewStyle;
}

/** Signature entrance: fade in while drifting up, weighted bezier easing. */
export default function FadeUp({
  children,
  delay = 0,
  distance = 24,
  duration = Motion.duration.base,
  style,
}: Props) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: distance }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration, delay }}
      style={style}
    >
      {children}
    </MotiView>
  );
}
