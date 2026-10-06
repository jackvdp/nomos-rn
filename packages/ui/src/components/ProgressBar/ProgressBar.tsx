import type { Tone } from '@nomos/tokens';
import { useEffect, useState } from 'react';
import { Animated, Easing, I18nManager, View, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { useReducedMotion } from '../../utils';
import { Text } from '../Text';

export type ProgressBarTone = Extract<Tone, 'brand' | 'success' | 'warning' | 'danger'>;

export interface ProgressBarProps extends Omit<ViewProps, 'children'> {
  /** Progress from 0 to 1. Values outside that range are clamped. Ignored when `indeterminate`. */
  value?: number;
  /** Visible text above the bar. Also the accessibility label unless you pass one. */
  label?: string;
  /** Shows the percentage at the end of the label row. */
  showValue?: boolean;
  /**
   * Replaces the percentage with your own text, such as "3 of 5 modules".
   * Shown whenever it is set, and read by screen readers.
   */
  valueText?: string;
  /** Defaults to `brand`. */
  tone?: ProgressBarTone;
  /** For work of unknown length: an animated bar with no value. */
  indeterminate?: boolean;
  'aria-label'?: string;
}

/** Fraction of the track the indeterminate segment covers. */
const SEGMENT = 0.4;

/**
 * Shows how far along a task is, such as an upload or a training course.
 * Use `indeterminate` when the length is unknown; for short waits prefer
 * `Spinner`.
 */
export function ProgressBar({
  value = 0,
  label,
  showValue = false,
  valueText,
  tone = 'brand',
  indeterminate = false,
  'aria-label': ariaLabel,
  style,
  ...rest
}: ProgressBarProps) {
  const theme = useTheme();
  const styles = useStyles();
  const reducedMotion = useReducedMotion();
  const colors = theme.colors.tone[tone];
  const percent = Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100);
  const shownValue = indeterminate ? undefined : (valueText ?? (showValue ? `${percent}%` : undefined));

  const [trackWidth, setTrackWidth] = useState(0);
  const [sweep] = useState(() => new Animated.Value(0));
  const animate = indeterminate && !reducedMotion;

  useEffect(() => {
    if (!animate) return;
    sweep.setValue(0);
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        // One sweep is deliberately slower than UI motion so it reads as "working", not "flashing".
        duration: theme.duration.slow * 4,
        easing: Easing.bezier(...theme.easing.standard),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, sweep, theme]);

  const direction = I18nManager.isRTL ? -1 : 1;
  const translateX = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-SEGMENT * trackWidth * direction, trackWidth * direction],
  });

  return (
    <View
      accessible
      role="progressbar"
      aria-label={ariaLabel ?? label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : percent}
      aria-valuetext={indeterminate ? undefined : valueText}
      aria-busy={indeterminate}
      style={[styles.base, style]}
      {...rest}
    >
      {label || shownValue ? (
        <View style={styles.header}>
          <Text variant="labelSm" style={styles.label}>
            {label}
          </Text>
          {shownValue ? (
            <Text variant="caption" color="secondary">
              {shownValue}
            </Text>
          ) : null}
        </View>
      ) : null}
      <View
        style={[styles.track, { backgroundColor: colors.subtle }]}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      >
        {indeterminate ? (
          animate ? (
            <Animated.View
              style={[
                styles.segment,
                { backgroundColor: colors.onSubtle, transform: [{ translateX }] },
              ]}
            />
          ) : (
            <View
              style={[
                styles.fill,
                { width: '100%', backgroundColor: colors.onSubtle, opacity: theme.opacity.disabled },
              ]}
            />
          )
        ) : (
          <View style={[styles.fill, { width: `${percent}%`, backgroundColor: colors.onSubtle }]} />
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    gap: t.space.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: t.space.sm,
  },
  label: {
    flex: 1,
  },
  // The fill uses the tone's `onSubtle` on its `subtle` track: that pair keeps
  // 3:1 contrast in both schemes, including the light amber of `warning`.
  track: {
    height: t.space.sm,
    borderRadius: t.radii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: t.radii.full,
  },
  segment: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    width: `${SEGMENT * 100}%`,
    borderRadius: t.radii.full,
  },
}));
