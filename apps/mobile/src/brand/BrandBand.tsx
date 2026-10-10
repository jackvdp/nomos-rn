import { makeStyles, useTheme } from '@nomos/ui';
import { useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { NetworkMotif } from './NetworkMotif';

/** How far down the screen the band reaches on each screen that has one. */
export const bandShare = { onboarding: 0.56, signIn: 0.5 } as const;
const largestShare = Math.max(...Object.values(bandShare));

const motifOpacity = 0.09;
// The motif grows with the window up to this width, so it is not huge on a tablet.
const motifMaxWindowWidth = 480;

export interface BrandBandProps {
  /**
   * How far down the screen the band reaches, as a share of the screen's
   * height. Animate it to move the band's edge: the motif stays where it is.
   */
  share: SharedValue<number>;
}

/**
 * The brand-coloured band behind the top of a screen, with a curved lower
 * edge. It is dark in both colour schemes. Put it before the screen's
 * content, which then scrolls over it.
 */
export function BrandBand({ share }: BrandBandProps) {
  const theme = useTheme();
  const styles = useStyles();
  const { width, height } = useWindowDimensions();
  // The band is the bottom of a circle much wider than the screen, which
  // leaves a shallow curve.
  const circle = Math.max(2 * width, height * largestShare);
  const circleLeft = (width - circle) / 2;
  const motifSize = Math.min(width, motifMaxWindowWidth) * 1.5;

  // The circle is laid out just above the screen and moved down into it.
  const bandStyle = useAnimatedStyle(
    () => ({ transform: [{ translateY: share.value * height }] }),
    [share, height],
  );
  // Moved back by as much, so that the motif keeps its place on the screen
  // while the band's edge moves.
  const motifStyle = useAnimatedStyle(
    () => ({ transform: [{ translateY: -share.value * height }] }),
    [share, height],
  );

  return (
    <Animated.View
      aria-hidden
      style={[
        styles.band,
        {
          width: circle,
          height: circle,
          borderRadius: circle / 2,
          left: circleLeft,
          top: -circle,
        },
        bandStyle,
      ]}
    >
      {/*
        Centred on the screen's right edge, near the top, so only part of the
        ring shows. It is inside the circle so that the curve clips it.
      */}
      <Animated.View
        style={[
          styles.motif,
          { left: width - motifSize * 0.5 - circleLeft, top: circle - motifSize * 0.38 },
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
    opacity: motifOpacity,
  },
}));
