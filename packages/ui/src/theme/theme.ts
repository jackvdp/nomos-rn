import {
  borderWidths,
  breakpoints,
  dark,
  duration,
  easing,
  light,
  opacity,
  radii,
  sizes,
  space,
  textVariants,
  zIndex,
  type TextStyleToken,
  type TextVariant,
  type ThemeTokens,
} from '@nomos/tokens';
import type { TextStyle } from 'react-native';

import { fontFace } from './fonts';

/**
 * Everything a component needs to style itself: the colour scheme's tokens
 * plus the scheme-independent scales. Components read it through
 * `useTheme()` or `makeStyles()` and never import raw palette values.
 */
export interface Theme extends ThemeTokens {
  space: typeof space;
  radii: typeof radii;
  borderWidths: typeof borderWidths;
  sizes: typeof sizes;
  opacity: typeof opacity;
  duration: typeof duration;
  easing: typeof easing;
  zIndex: typeof zIndex;
  breakpoints: typeof breakpoints;
  typography: Record<TextVariant, TextStyle>;
}

function resolveTypography(): Record<TextVariant, TextStyle> {
  const entries = (Object.keys(textVariants) as TextVariant[]).map((variant) => {
    // The font file carries the weight; see fonts.ts.
    const { family, fontWeight, ...style }: TextStyleToken = textVariants[variant];
    return [variant, { ...style, fontFamily: fontFace(variant) }];
  });
  return Object.fromEntries(entries) as Record<TextVariant, TextStyle>;
}

export function createTheme(tokens: ThemeTokens): Theme {
  return {
    ...tokens,
    space,
    radii,
    borderWidths,
    sizes,
    opacity,
    duration,
    easing,
    zIndex,
    breakpoints,
    typography: resolveTypography(),
  };
}

// Created once so theme identity is stable, which lets makeStyles cache per theme.
export const lightTheme = createTheme(light);
export const darkTheme = createTheme(dark);
