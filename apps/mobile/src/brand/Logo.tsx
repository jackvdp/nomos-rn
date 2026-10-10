import { Image, Platform } from 'react-native';

// The copy of the logo with a white wordmark, for the brand-coloured band.
const source = require('../../assets/nomos-logo-on-dark.png');
const label = 'NOMOS';

export const logoAspectRatio = 1888 / 427;
/**
 * The logo's width at the top of the onboarding and sign-in screens. Both put
 * it in the same place, so it holds still as one gives way to the other.
 */
export const headerLogoWidth = 128;
/**
 * The logo's width on the splash screen, where it is in the middle. Keep it
 * the same as `imageWidth` for `expo-splash-screen` in `app.json`. Android
 * shows the splash screen's image inside a circle, which a wider logo would
 * not fit.
 */
export const splashLogoWidth = Platform.OS === 'android' ? 180 : 224;

export interface LogoProps {
  width: number;
  /** The image is ready to show, or has failed to load. */
  onLoadEnd?: () => void;
}

/** The NOMOS logo, for dark backgrounds. */
export function Logo({ width, onLoadEnd }: LogoProps) {
  return (
    <Image
      source={source}
      accessible
      aria-label={label}
      resizeMode="contain"
      onLoadEnd={onLoadEnd}
      // An image does not size itself from a width and a ratio alone.
      style={{ width, height: width / logoAspectRatio }}
    />
  );
}
