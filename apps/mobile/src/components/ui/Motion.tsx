/**
 * Platform-safe Moti wrapper.
 * Moti + Reanimated on react-native-web can throw "Invalid hook call";
 * native keeps full animations.
 */
import React from 'react';
import { Platform, View } from 'react-native';

const TRANSFORM_KEYS = [
  'perspective',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'translateX',
  'translateY',
  'skewX',
  'skewY',
];

function animateToStyle(animate: unknown) {
  if (!animate || typeof animate !== 'object') return undefined;
  const style: Record<string, unknown> = {};
  const transform: Record<string, unknown>[] = [];
  Object.entries(animate as Record<string, unknown>).forEach(([key, value]) => {
    if (TRANSFORM_KEYS.includes(key)) transform.push({ [key]: value });
    else style[key] = value;
  });
  if (transform.length) style.transform = transform;
  return style;
}

type AnyProps = Record<string, any>;

const WebMotiView = React.forwardRef<View, AnyProps>(function WebMotiView(
  { animate, style, children, ...rest },
  ref
) {
  return (
    <View ref={ref} style={[style, animateToStyle(animate)]} {...rest}>
      {children}
    </View>
  );
});

let Resolved: React.ComponentType<AnyProps>;
if (Platform.OS === 'web') {
  Resolved = WebMotiView;
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Resolved = require('moti').MotiView;
}

export const MotiView = Resolved;
