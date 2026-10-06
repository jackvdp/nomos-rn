import { textVariants, type Radius, type TextVariant } from '@nomos/tokens';
import { useEffect, useState } from 'react';
import { Animated, Easing, View, type DimensionValue, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { useReducedMotion } from '../../utils';

export interface SkeletonProps extends Omit<ViewProps, 'children'> {
  /** Defaults to the full width of the container. */
  width?: DimensionValue;
  /** Defaults to one line of body text (16), or an avatar `md` (40) for a circle. */
  height?: DimensionValue;
  /** Corner radius from the scale. Defaults to `sm`. Ignored for circles. */
  radius?: Radius;
  /** A round placeholder for avatars: its diameter is `height`, and `width` is ignored. */
  circle?: boolean;
}

// A pulse is slower than UI motion: each half takes three `slow` steps (~1s).
const PULSE_STEPS = 3;

/**
 * A placeholder in the shape of content that is still loading, so the layout
 * doesn't jump when it arrives. Hidden from screen readers: mark the region
 * that is loading with `aria-busy` instead.
 */
export function Skeleton({
  width = '100%',
  height,
  radius = 'sm',
  circle = false,
  style,
  ...rest
}: SkeletonProps) {
  const theme = useTheme();
  const styles = useStyles();
  const reducedMotion = useReducedMotion();
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reducedMotion) {
      pulse.setValue(0);
      return;
    }
    const step = {
      duration: theme.duration.slow * PULSE_STEPS,
      easing: Easing.bezier(...theme.easing.standard),
      useNativeDriver: true,
    };
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { ...step, toValue: 1 }),
        Animated.timing(pulse, { ...step, toValue: 0 }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reducedMotion, theme]);

  const diameter = height ?? theme.sizes.avatar.md;
  return (
    <View
      aria-hidden
      style={[
        styles.base,
        circle
          ? { width: diameter, height: diameter, borderRadius: theme.radii.full }
          : { width, height: height ?? theme.space.lg, borderRadius: theme.radii[radius] },
        style,
      ]}
      {...rest}
    >
      <Animated.View style={[styles.highlight, { opacity: pulse }]} />
    </View>
  );
}

export interface SkeletonTextProps extends Omit<ViewProps, 'children'> {
  /** Number of lines. Defaults to 3. */
  lines?: number;
  /** Matches the height and spacing of this text variant. Defaults to `body`. */
  variant?: TextVariant;
  /** Width of the last line, so the block reads as a paragraph. Defaults to `60%`. */
  lastLineWidth?: DimensionValue;
}

/** Placeholder lines sized like a paragraph of `Text` in the given variant. */
export function SkeletonText({
  lines = 3,
  variant = 'body',
  lastLineWidth = '60%',
  style,
  ...rest
}: SkeletonTextProps) {
  const { fontSize, lineHeight } = textVariants[variant];
  const leading = lineHeight - fontSize;
  return (
    <View aria-hidden style={[{ gap: leading, paddingVertical: leading / 2 }, style]} {...rest}>
      {Array.from({ length: Math.max(1, lines) }, (_, index) => (
        <Skeleton
          key={index}
          height={fontSize}
          width={index === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
          radius="xs"
        />
      ))}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    backgroundColor: t.colors.skeleton.base,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    backgroundColor: t.colors.skeleton.highlight,
  },
}));
