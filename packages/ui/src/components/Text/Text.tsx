import type { ColorTokens, FontWeight, TextVariant } from '@nomos/tokens';
import type { Ref } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '../../theme';
import { fontFace } from '../../theme/fonts';

export type TextColor = keyof ColorTokens['text'];

export interface TextProps extends RNTextProps {
  /** Type style from the scale. Defaults to `body`. */
  variant?: TextVariant;
  /** Semantic text colour. Defaults to `primary`. */
  color?: TextColor;
  /** Overrides the variant's weight. */
  weight?: FontWeight;
  align?: 'auto' | 'left' | 'center' | 'right' | 'justify';
  ref?: Ref<RNText>;
}

const headingVariants: ReadonlySet<TextVariant> = new Set([
  'display',
  'headingLg',
  'headingMd',
  'headingSm',
]);

/**
 * All text in the app goes through this component, so type and colour stay
 * on the scale. Headings get `role="heading"` automatically, which
 * screen readers use for navigation.
 */
export function Text({
  variant = 'body',
  color = 'primary',
  weight,
  align,
  style,
  role,
  ...rest
}: TextProps) {
  const theme = useTheme();
  return (
    <RNText
      role={role ?? (headingVariants.has(variant) ? 'heading' : undefined)}
      style={[
        theme.typography[variant],
        { color: theme.colors.text[color] },
        weight && { fontFamily: fontFace(variant, weight) },
        align && { textAlign: align },
        style,
      ]}
      {...rest}
    />
  );
}
