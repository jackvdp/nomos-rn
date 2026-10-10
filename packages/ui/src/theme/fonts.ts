import { CormorantGaramond_400Regular } from '@expo-google-fonts/cormorant-garamond/400Regular';
import { CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond/500Medium';
import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond/600SemiBold';
import { CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond/700Bold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import {
  fontWeight,
  textVariants,
  type FontFamily,
  type FontWeight,
  type TextStyleToken,
  type TextVariant,
} from '@nomos/tokens';

/**
 * The NOMOS font files, keyed by the name text styles refer to them by. Each
 * app loads them once at start-up, before rendering any text:
 *
 *   const [loaded, error] = useFonts(fonts); // from expo-font
 */
export const fonts = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
};

type Weight = (typeof fontWeight)[FontWeight];

// Every weight is its own font file, so a style picks its weight by naming
// the file, not with `fontWeight`. Setting both makes Android and the web
// embolden a face that is already bold.
const faces: Record<FontFamily, Record<Weight, keyof typeof fonts>> = {
  sans: {
    '400': 'Inter_400Regular',
    '500': 'Inter_500Medium',
    '600': 'Inter_600SemiBold',
    '700': 'Inter_700Bold',
  },
  serif: {
    '400': 'CormorantGaramond_400Regular',
    '500': 'CormorantGaramond_500Medium',
    '600': 'CormorantGaramond_600SemiBold',
    '700': 'CormorantGaramond_700Bold',
  },
};

/** The `fontFamily` for a text variant, at its own weight or the one given. */
export function fontFace(variant: TextVariant, weight?: FontWeight): string {
  const token: TextStyleToken = textVariants[variant];
  return faces[token.family ?? 'sans'][weight ? fontWeight[weight] : token.fontWeight];
}
