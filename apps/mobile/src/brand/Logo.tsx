import { Image } from 'react-native';

// The copy of the logo with a white wordmark, for the brand-coloured band.
const source = require('../../assets/nomos-logo-on-dark.png');
const label = 'NOMOS';

export const logoAspectRatio = 1888 / 427;

export interface LogoProps {
  width: number;
}

/** The NOMOS logo, for dark backgrounds. */
export function Logo({ width }: LogoProps) {
  return (
    <Image
      source={source}
      accessible
      aria-label={label}
      resizeMode="contain"
      // An image does not size itself from a width and a ratio alone.
      style={{ width, height: width / logoAspectRatio }}
    />
  );
}
