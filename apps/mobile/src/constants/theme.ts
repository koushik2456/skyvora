import { Platform, type ViewStyle } from 'react-native';

/**
 * Dark botanical luxury palette.
 * Soft matte greens — near-black → sage → mint. No neon or pure black.
 */
export const Palette = {
  bgDeep: '#051F20',
  bgForest: '#0B2B26',
  bgEmerald: '#163832',
  jade: '#235347',
  sage: '#8EB69B',
  mint: '#DAF1DE',
} as const;

export const Colors = {
  // Botanical brand
  primary: Palette.jade,
  primaryLight: Palette.sage,
  primaryDark: Palette.bgForest,
  accent: Palette.sage,
  accentDark: Palette.jade,
  accentLight: Palette.mint,
  secondary: Palette.sage,
  sky: Palette.sage,

  // Status — muted, not neon
  success: '#5A9E72',
  warning: '#A68B5B',
  danger: '#B85C5C',
  info: Palette.sage,

  // Surfaces
  background: Palette.bgDeep,
  sectionBg: Palette.bgEmerald,
  cardSoft: Palette.bgEmerald,
  surface: Palette.bgForest,
  surfaceAlt: Palette.bgEmerald,
  surfaceDark: Palette.bgForest,

  // Text
  textPrimary: Palette.mint,
  textSecondary: Palette.sage,
  textMuted: 'rgba(142, 182, 155, 0.75)',
  /** Higher-contrast secondary on dark cards (bookings, lists). */
  textSubtle: 'rgba(218, 241, 222, 0.82)',
  textOnDark: Palette.mint,
  textOnDarkMuted: Palette.sage,

  // UI
  border: 'rgba(142, 182, 155, 0.18)',
  borderDark: 'rgba(35, 83, 71, 0.5)',
  overlay: 'rgba(5, 31, 32, 0.72)',

  skyTop: Palette.bgDeep,
  skyBottom: Palette.bgEmerald,

  white: Palette.mint,
  black: Palette.bgDeep,

  // Named palette shortcuts
  ...Palette,

  dark: {
    background: Palette.bgDeep,
    surface: Palette.bgForest,
    surfaceAlt: Palette.bgEmerald,
    card: Palette.bgEmerald,
    border: 'rgba(142, 182, 155, 0.12)',
    borderStrong: 'rgba(142, 182, 155, 0.22)',
    glass: 'rgba(22, 56, 50, 0.55)',
    glassStrong: 'rgba(22, 56, 50, 0.75)',
    textPrimary: Palette.mint,
    textSecondary: Palette.sage,
    textMuted: 'rgba(142, 182, 155, 0.55)',
    glow: 'rgba(142, 182, 155, 0.35)',
    accentGlow: 'rgba(218, 241, 222, 0.2)',
  },
} as const;

export const Typography = {
  display: 'Poppins_700Bold',
  heading: 'Poppins_600SemiBold',
  body: 'Inter_400Regular',
  bodyMed: 'Inter_500Medium',
  mono: 'JetBrainsMono_400Regular',

  fontHero: 'Poppins_700Bold',
  fontDisplay: 'Poppins_700Bold',
  fontDisplaySemi: 'Poppins_600SemiBold',
  fontBody: 'Inter_400Regular',
  fontBodyMedium: 'Inter_500Medium',
  fontBodySemi: 'Inter_600SemiBold',
  fontBodyBold: 'Inter_700Bold',

  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    hero: 42,
  },
  tracking: {
    tight: -0.8,
    normal: 0,
    wide: 1.2,
  },
} as const;

export const TextStyles = {
  heroTitle: {
    fontFamily: Typography.display,
    fontSize: 36,
    color: Colors.mint,
    lineHeight: 44,
  },
  sectionHead: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.mint,
  },
  cardTitle: {
    fontFamily: Typography.heading,
    fontSize: 16,
    color: Colors.mint,
  },
  body: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.sage,
  },
  price: {
    fontFamily: Typography.mono,
    fontSize: 18,
    color: Colors.sage,
  },
  caption: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textMuted,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#051F20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#051F20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#051F20',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  hero: {
    shadowColor: Palette.jade,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  card: {
    shadowColor: '#051F20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  floating: {
    shadowColor: Palette.jade,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  glow: {
    shadowColor: Palette.sage,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  accentGlow: {
    shadowColor: Palette.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
} as const;

type NativeShadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation?: number;
};

export function resolveShadow(style: NativeShadow): ViewStyle {
  if (Platform.OS === 'web') {
    const { shadowColor, shadowOffset, shadowOpacity, shadowRadius } = style;
    const hex = shadowColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16) || 0;
    const g = parseInt(hex.slice(2, 4), 16) || 0;
    const b = parseInt(hex.slice(4, 6), 16) || 0;
    return {
      boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(${r},${g},${b},${shadowOpacity})`,
    };
  }
  return style;
}

export const Motion = {
  duration: { fast: 250, base: 350, slow: 500 },
  bezier: [0.22, 1, 0.36, 1] as const,
} as const;

/** Botanical hero gradient stops for overlays. */
export const BotanicalGradient = {
  hero: ['rgba(5,31,32,0.15)', 'rgba(5,31,32,0.55)', 'rgba(5,31,32,0.92)'] as const,
  card: ['transparent', 'rgba(5,31,32,0.85)'] as const,
  onboarding: ['transparent', 'rgba(5,31,32,0.88)'] as const,
};
