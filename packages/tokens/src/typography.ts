/**
 * Type scale. The typefaces are the two trustnomos.com uses: Inter for body
 * text and the interface, Cormorant Garamond for the large headings. This
 * file only names them; `@nomos/ui` holds the font files and each app loads
 * them.
 *
 * Weights are strings because React Native only accepts string weights.
 */

export const fontFamily = {
  sans: 'Inter',
  serif: 'Cormorant Garamond',
  /** `undefined` means the platform default. */
  mono: undefined as string | undefined,
};

export type FontFamily = 'sans' | 'serif';

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type FontWeight = keyof typeof fontWeight;

export interface TextStyleToken {
  /** Defaults to `sans`. */
  family?: FontFamily;
  fontSize: number;
  lineHeight: number;
  fontWeight: (typeof fontWeight)[FontWeight];
  letterSpacing?: number;
  textTransform?: 'uppercase';
}

export const textVariants = {
  /** One per screen at most: hero numbers, onboarding. */
  display: {
    family: 'serif',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.4,
  },
  /** Screen titles. */
  headingLg: {
    family: 'serif',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.2,
  },
  /** Section headings. */
  headingMd: { fontSize: 20, lineHeight: 28, fontWeight: fontWeight.semibold },
  /** Card and dialog titles. */
  headingSm: { fontSize: 17, lineHeight: 24, fontWeight: fontWeight.semibold },
  bodyLg: { fontSize: 17, lineHeight: 26, fontWeight: fontWeight.regular },
  body: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.semibold },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.regular },
  /** Buttons, tabs, field labels. */
  label: { fontSize: 15, lineHeight: 20, fontWeight: fontWeight.semibold },
  labelSm: { fontSize: 13, lineHeight: 18, fontWeight: fontWeight.semibold },
  /** Timestamps, helper text, metadata. */
  caption: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular },
  overline: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, TextStyleToken>;

export type TextVariant = keyof typeof textVariants;
