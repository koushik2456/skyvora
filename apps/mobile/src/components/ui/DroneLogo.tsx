import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  accent?: string;
}

/** Minimal quad-rotor drone mark used across the Skyvora brand. */
export default function DroneLogo({ size = 96, color = '#FFFFFF', accent = '#F5A623' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* arms */}
      <Line x1="30" y1="40" x2="50" y2="52" stroke={color} strokeWidth={4} strokeLinecap="round" />
      <Line x1="70" y1="40" x2="50" y2="52" stroke={color} strokeWidth={4} strokeLinecap="round" />
      <Line x1="30" y1="72" x2="50" y2="58" stroke={color} strokeWidth={4} strokeLinecap="round" />
      <Line x1="70" y1="72" x2="50" y2="58" stroke={color} strokeWidth={4} strokeLinecap="round" />
      {/* rotors */}
      <Circle cx="30" cy="38" r="11" stroke={color} strokeWidth={4} />
      <Circle cx="70" cy="38" r="11" stroke={color} strokeWidth={4} />
      <Circle cx="30" cy="74" r="11" stroke={color} strokeWidth={4} />
      <Circle cx="70" cy="74" r="11" stroke={color} strokeWidth={4} />
      {/* body */}
      <Rect x="42" y="48" width="16" height="14" rx="5" fill={color} />
      {/* spray cone */}
      <Path d="M46 62 L40 76 L60 76 L54 62 Z" fill={accent} opacity={0.9} />
    </Svg>
  );
}
