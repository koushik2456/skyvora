import React from 'react';
import { ViewStyle } from 'react-native';
import { MotiView } from './Motion';

interface Props {
  children: React.ReactNode;
  delay?: number;
  from?: number;
  style?: ViewStyle;
  translateY?: number;
}

export default function FadeScale({
  children,
  delay = 0,
  from = 0.7,
  style,
  translateY = 0,
}: Props) {
  return (
    <MotiView
      from={{ opacity: 0, scale: from, translateY }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 14, stiffness: 120, delay }}
      style={style}
    >
      {children}
    </MotiView>
  );
}
