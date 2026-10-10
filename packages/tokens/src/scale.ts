/** Spacing on a 4-point grid. Use for padding, margin and gap. */
export const space = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export type Space = keyof typeof space;

export const radii = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  /** Cards. */
  lg: 12,
  xl: 16,
  /** Sheets and dialogs. */
  xxl: 24,
  full: 9999,
} as const;

export type Radius = keyof typeof radii;

export const borderWidths = {
  none: 0,
  thin: 1,
  thick: 2,
} as const;

export const sizes = {
  /**
   * Smallest tappable area. 44 is Apple's minimum; Android asks for 48dp,
   * which components reach with hitSlop rather than by growing visually.
   */
  touchTarget: 44,
  control: { sm: 36, md: 44, lg: 52 },
  icon: { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 },
  avatar: { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 },
} as const;

export type ControlSize = keyof typeof sizes.control;
export type IconSize = keyof typeof sizes.icon;
export type AvatarSize = keyof typeof sizes.avatar;

export const opacity = {
  disabled: 0.4,
  pressed: 0.7,
} as const;

/** Size multipliers, for a `scale` transform. */
export const scale = {
  /** A button while it is held down. */
  pressed: 0.97,
} as const;

/** Durations in milliseconds. Keep motion short: many users are on low-end phones. */
export const duration = {
  instant: 0,
  fast: 120,
  normal: 200,
  slow: 320,
} as const;

/** Cubic-bezier control points, usable as `Easing.bezier(...easing.standard)`. */
export const easing = {
  standard: [0.2, 0, 0, 1],
  enter: [0, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const zIndex = {
  base: 0,
  raised: 1,
  sticky: 10,
  overlay: 20,
  modal: 30,
  toast: 40,
} as const;

/** Window widths (dp) at which layouts change. Matches Material's window size classes. */
export const breakpoints = {
  compact: 0,
  medium: 600,
  expanded: 840,
} as const;

export type Breakpoint = keyof typeof breakpoints;
