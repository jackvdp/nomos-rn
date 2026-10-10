import { makeStyles, useTheme } from '@nomos/ui';
import { useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { NetworkMotif } from './NetworkMotif';

/** How far down the screen the band reaches on each screen that has one. */
export const bandShare = { onboarding: 0.56, signIn: 0.5 } as const;

const motifOpacity = 0.09;
// The motif grows with the window up to this width, so it is not huge on a tablet.
const motifMaxWindowWidth = 480;

// The band's lower edge is an arc of a circle twice as wide as the window,
// which leaves a shallow curve.
const edgeRadius = (width: number) => width;

/**
 * The share at which the band covers a whole window of this size, as the
 * splash screen does. It is a little over 1, because the band's edge is
 * higher at the sides than in the middle.
 */
export function coveringShare(width: number, height: number) {
  const radius = edgeRadius(width);
  const rise = radius - Math.sqrt(radius ** 2 - (width / 2) ** 2);
  return 1 + rise / height;
}

export interface BrandBandProps {
  /**
   * How far down the screen the band reaches, as a share of the screen's
   * height. Animate it to move the band's edge: the motif stays where it is.
   */
  share: SharedValue<number>;
  /** How much of the motif shows, from 0 to 1. All of it when left out. */
  motif?: SharedValue<number>;
}

/**
 * The brand-coloured band behind the top of a screen, with a curved lower
 * edge. It is dark in both colour schemes. Put it before the screen's
 * content, which then scrolls over it.
 */
export function BrandBand({ share, motif }: BrandBandProps) {
  const theme = useTheme();
  const styles = useStyles();
  const { width, height } = useWindowDimensions();
  const radius = edgeRadius(width);
  // Square at the top and a half circle at the bottom, and tall enough to
  // reach the top of the window from wherever its edge is.
  const bandWidth = 2 * radius;
  const bandHeight = radius + coveringShare(width, height) * height;
  const bandLeft = (width - bandWidth) / 2;
  const motifSize = Math.min(width, motifMaxWindowWidth) * 1.5;

  // The band is laid out just above the screen and moved down into it.
  const bandStyle = useAnimatedStyle(
    () => ({ transform: [{ translateY: share.value * height }] }),
    [share, height],
  );
  // Moved back by as much, so that the motif keeps its place on the screen
  // while the band's edge moves.
  const motifStyle = useAnimatedStyle(
    () => ({
      opacity: motifOpacity * (motif ? motif.value : 1),
      transform: [{ translateY: -share.value * height }],
    }),
    [share, height, motif],
  );

  return (
    <Animated.View
      aria-hidden
      style={[
        styles.band,
        {
          width: bandWidth,
          height: bandHeight,
          borderBottomLeftRadius: radius,
          borderBottomRightRadius: radius,
          left: bandLeft,
          top: -bandHeight,
        },
        bandStyle,
      ]}
    >
      {/*
        Centred on the screen's right edge, near the top, so only part of the
        ring shows. It is inside the band so that the curve clips it.
      */}
      <Animated.View
        style={[
          styles.motif,
          { left: width - motifSize * 0.5 - bandLeft, top: bandHeight - motifSize * 0.38 },
          motifStyle,
        ]}
      >
        <NetworkMotif size={motifSize} color={theme.colors.text.onBrand} />
      </Animated.View>
    </Animated.View>
  );
}

const useStyles = makeStyles((t) => ({
  band: {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: t.colors.bg.brand,
  },
  motif: {
    position: 'absolute',
  },
}));
