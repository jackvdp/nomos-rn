import type { ControlSize } from '@nomos/tokens';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { makeStyles, useTheme, type Theme } from '../../theme';
import { useReducedMotion } from '../../utils';
import { usePressFeedback } from '../../utils/usePressFeedback';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Visible text. Also the accessibility label unless you pass one. */
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * - `primary`: the one main action on a screen.
   * - `secondary`: outlined, for alternatives alongside a primary.
   * - `tertiary`: text-only, for low-emphasis actions.
   * - `danger`: destructive actions such as revoke or delete.
   */
  variant?: ButtonVariant;
  size?: ControlSize;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  /** Shows a spinner, blocks presses and tells screen readers the button is busy. */
  loading?: boolean;
  disabled?: boolean;
  /** Stretches to the width of its container. */
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const paddingBySize = { sm: 12, md: 16, lg: 20 } as const;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// A disabled text-only button stays unfilled so it doesn't read as a filled button.
function disabledColors(theme: Theme, variant: ButtonVariant) {
  const { disabled } = theme.colors.action;
  return variant === 'tertiary'
    ? { ...disabled, bg: 'transparent', border: 'transparent' }
    : disabled;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  'aria-label': ariaLabel,
  hitSlop,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const styles = useStyles();
  const inactive = disabled || loading;
  const press = usePressFeedback(inactive);
  const spinner = useSpinnerMotion(loading);
  const colors = disabled ? disabledColors(theme, variant) : theme.colors.action[variant];
  const height = theme.sizes.control[size];
  const iconSize = size === 'lg' ? 'lg' : 'md';
  // Small buttons stay small visually but keep a full-size touch area.
  const slop = hitSlop ?? Math.max(0, (theme.sizes.touchTarget - height) / 2);

  return (
    <AnimatedPressable
      role="button"
      aria-label={ariaLabel ?? label}
      aria-disabled={inactive}
      aria-busy={loading}
      disabled={inactive}
      hitSlop={slop}
      onPressIn={(event) => {
        press.onPressIn();
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        press.onPressOut();
        onPressOut?.(event);
      }}
      style={[
        styles.base,
        {
          minHeight: height,
          paddingHorizontal: variant === 'tertiary' ? paddingBySize[size] - 4 : paddingBySize[size],
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        fullWidth && styles.fullWidth,
        style,
        press.scaleStyle,
      ]}
      {...rest}
    >
      {/* The pressed colour fades in over the resting one. */}
      <Animated.View
        style={[
          styles.pressed,
          { backgroundColor: theme.colors.action[variant].bgPressed },
          press.pressedStyle,
        ]}
      />
      {leadingIcon ? (
        loading ? (
          <Animated.View style={spinner.fadeStyle}>
            <ActivityIndicator size="small" color={colors.fg} />
          </Animated.View>
        ) : (
          <Icon name={leadingIcon} size={iconSize} color={colors.fg} />
        )
      ) : (
        // Always here, and no width at rest, so that it can open up for the spinner.
        <Animated.View style={[styles.spinnerRoom, spinner.roomStyle]}>
          {loading ? <ActivityIndicator size="small" color={colors.fg} /> : null}
        </Animated.View>
      )}
      <Text
        variant={size === 'sm' ? 'labelSm' : 'label'}
        style={{ color: colors.fg }}
        numberOfLines={1}
      >
        {label}
      </Text>
      {trailingIcon && !loading ? (
        <Icon name={trailingIcon} size={iconSize} color={colors.fg} />
      ) : (
        trailingIcon && <View style={{ width: theme.sizes.icon[iconSize] }} />
      )}
    </AnimatedPressable>
  );
}

/**
 * How the spinner arrives and leaves. A button with no leading icon makes
 * room for it: `roomStyle` opens a gap before the label, so the label slides
 * over and a button sized to its content widens, and closes it again
 * afterwards. Where the spinner takes an icon's place it only fades in, with
 * `fadeStyle`. With reduced motion both happen at once.
 */
function useSpinnerMotion(loading: boolean) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  // 0 with no spinner, 1 with the spinner fully in.
  const progress = useSharedValue(loading ? 1 : 0);
  const duration = reducedMotion ? 0 : theme.duration.normal;
  const [x1, y1, x2, y2] = theme.easing.standard;
  // The platform's small spinner is the size of a medium icon.
  const width = theme.sizes.icon.md;
  const gap = theme.space.sm;

  useEffect(() => {
    progress.value = withTiming(loading ? 1 : 0, {
      duration,
      easing: Easing.bezier(x1, y1, x2, y2),
    });
  }, [loading, progress, duration, x1, y1, x2, y2]);

  const roomStyle = useAnimatedStyle(
    () => ({
      width: progress.value * width,
      // At rest this cancels the gap the button puts after it.
      marginEnd: (progress.value - 1) * gap,
      opacity: progress.value,
    }),
    [progress, width, gap],
  );
  const fadeStyle = useAnimatedStyle(() => ({ opacity: progress.value }), [progress]);

  return { roomStyle, fadeStyle };
}

const useStyles = makeStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: t.space.sm,
    // A capsule: fully rounded ends at every size.
    borderRadius: t.radii.full,
    borderWidth: t.borderWidths.thin,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  // The spinner keeps its size and is centred while its room opens around it.
  spinnerRoom: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  // Covers the button inside its border.
  pressed: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    borderRadius: t.radii.full,
  },
}));
