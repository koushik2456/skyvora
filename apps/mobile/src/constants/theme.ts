/**
 * Skyvora hybrid design system.
 * Dark "Drone Tech" set for hero / home / footer sections,
 * light editorial set for content sections.
 */
export const Colors = {
  // Brand
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  accent: '#F97316',
  accentLight: '#FB923C',
  /** @deprecated alias of accent */
  secondary: '#F97316',
  /** @deprecated alias of info */
  sky: '#38BDF8',

  // Status
  danger: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#38BDF8',

  // Light content surfaces
  background: '#F5F6F7',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF0F3',
  textPrimary: '#0B1220',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#E4E9F0',

  // Dark "Drone Tech" surfaces (hero, home shell, footer)
  dark: {
    background: '#081120',
    surface: '#0D1A2F',
    surfaceAlt: '#122340',
    card: '#0F1E38',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.14)',
    glass: 'rgba(255,255,255,0.06)',
    glassStrong: 'rgba(255,255,255,0.10)',
    textPrimary: '#F8FAFC',
    textSecondary: '#9FB0C7',
    textMuted: '#5D6F8A',
    glow: 'rgba(37,99,235,0.45)',
    accentGlow: 'rgba(249,115,22,0.35)',
  },

  overlay: 'rgba(2,8,20,0.55)',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Typography = {
  // Plus Jakarta Sans for display / headings, Inter for body
  fontHero: 'PlusJakartaSans_800ExtraBold',
  fontDisplay: 'PlusJakartaSans_700Bold',
  fontDisplaySemi: 'PlusJakartaSans_600SemiBold',
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
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  '2xl': 28,
  full: 9999,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#0B1220',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 4,
  },
  floating: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  glow: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
  },
  accentGlow: {
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 8,
  },
} as const;

/** Motion language: smooth, weighted, never bouncy. */
export const Motion = {
  duration: { fast: 250, base: 350, slow: 500 },
  /** cubic-bezier(0.22, 1, 0.36, 1) — use with Reanimated Easing.bezier */
  bezier: [0.22, 1, 0.36, 1] as const,
} as const;
