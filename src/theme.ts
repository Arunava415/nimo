/**
 * NIMO design tokens.
 *
 * Colours were sampled from the shipped production build so the rebuilt source
 * renders identically to the `dist/` export that was already in this repo.
 */

export const colors = {
  // Brand
  teal: '#176F6A',
  tealDeep: '#136B63',
  tealSoft: '#C4DFD7',
  tealMist: '#EDF6F4',
  tealLine: '#D9E8E3',
  coral: '#F08068',
  coralSoft: '#FBE3DC',

  // Surfaces
  cream: '#FFFEFA',
  surface: '#FFFFFF',
  surfaceAlt: '#E2EBE8',

  // Text
  ink: '#18383B',
  inkSoft: '#2A3B37',
  muted: '#5E6E6B',
  onTeal: '#FFFFFF',

  // Status
  success: '#2E8B6F',
  warning: '#E0A33E',
  danger: '#C4553D',
} as const;

/**
 * The whole app is built for elderly users, so every size here is a step or two
 * larger than a typical mobile app. `scale` is driven by the accessibility
 * setting on the profile screen.
 */
export const textScales = {
  normal: 1,
  large: 1.15,
  xlarge: 1.32,
} as const;

export type TextScaleKey = keyof typeof textScales;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#0B3B36',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#0B3B36',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
} as const;

/** Minimum touch target. Elderly users need a generously sized hit area. */
export const MIN_TAP = 56;
