import type { AvatarSize, IconSize, Radius, TextVariant, ToneColors } from '@nomos/tokens';

import type { Theme } from '../../theme';

export type AvatarShape = 'circle' | 'rounded';

const roundedRadius = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const satisfies Record<AvatarSize, Radius>;

/** Initials are roughly 40% of the avatar's size. */
export const initialsVariant = {
  xs: 'caption',
  sm: 'labelSm',
  md: 'bodyStrong',
  lg: 'headingMd',
  xl: 'display',
} as const satisfies Record<AvatarSize, TextVariant>;

export const fallbackIconSize = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const satisfies Record<AvatarSize, IconSize>;

export function avatarRadius(theme: Theme, size: AvatarSize, shape: AvatarShape): number {
  return shape === 'circle' ? theme.radii.full : theme.radii[roundedRadius[size]];
}

/** First letter of the first and last words, e.g. "Amara Okafor" → "AO". */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = Array.from(words[0])[0];
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : '';
  return (first + last).toLocaleUpperCase();
}

/**
 * A stable colour pair for a name, so the same person always gets the same
 * initials colour. Danger is left out so an avatar never reads as an error.
 */
export function avatarColors(theme: Theme, name: string): ToneColors {
  const { tone, context } = theme.colors;
  const palette = [tone.brand, tone.info, tone.success, tone.warning, context.workspace, tone.neutral];
  let hash = 0;
  for (const char of name.trim().toLocaleLowerCase()) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  }
  return palette[hash % palette.length];
}
