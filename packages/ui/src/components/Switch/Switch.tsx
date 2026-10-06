import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  I18nManager,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme, type Theme } from '../../theme';
import { useReducedMotion } from '../../utils';
import { Icon } from '../Icon';
import { Text } from '../Text';

export interface SwitchProps
  extends Omit<PressableProps, 'children' | 'style' | 'onPress' | 'disabled'> {
  /** Visible text. Also the accessibility label unless you pass one. */
  label: string;
  /** Secondary text under the label, read to screen readers as a hint. */
  description?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * A setting that takes effect immediately, such as a notification
 * preference. The whole row is pressable. Drawn in JS rather than with the
 * platform switch so it looks the same on iOS, Android and web. For choices
 * submitted with a form, use Checkbox.
 */
export function Switch({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
  style,
  'aria-label': ariaLabel,
  accessibilityHint,
  ...rest
}: SwitchProps) {
  const theme = useTheme();
  const styles = useStyles();
  const reducedMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    const toValue = value ? 1 : 0;
    if (reducedMotion) {
      progress.setValue(toValue);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue,
      duration: theme.duration.fast,
      easing: Easing.bezier(...theme.easing.standard),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [value, reducedMotion, progress, theme]);

  const travel = trackWidth(theme) - theme.sizes.icon.lg - 2 * theme.space.xxs;
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, I18nManager.isRTL ? -travel : travel],
  });

  return (
    <Pressable
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel ?? label}
      accessibilityHint={accessibilityHint ?? description}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[styles.row, disabled && styles.disabled, style]}
      {...rest}
    >
      <View style={styles.text}>
        <Text>{label}</Text>
        {description ? (
          <Text variant="bodySm" color="secondary">
            {description}
          </Text>
        ) : null}
      </View>
      <View style={styles.track}>
        {/* Cross-fading the "on" colour keeps the animation on the native driver. */}
        <Animated.View style={[styles.trackOn, { opacity: progress }]} />
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]}>
          <Animated.View style={{ opacity: progress }}>
            <Icon name="check" size="xs" color={theme.colors.control.checked} />
          </Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

/** Room for two thumbs side by side, plus the padding around them. */
const trackWidth = (t: Theme) => 2 * t.sizes.icon.lg + 2 * t.space.xxs;

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.md,
    minHeight: t.sizes.touchTarget,
    paddingVertical: t.space.sm,
  },
  disabled: {
    opacity: t.opacity.disabled,
  },
  text: {
    flex: 1,
    gap: t.space.xxs,
  },
  track: {
    width: trackWidth(t),
    height: t.sizes.icon.lg + 2 * t.space.xxs,
    padding: t.space.xxs,
    borderRadius: t.radii.full,
    backgroundColor: t.colors.control.track,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackOn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    borderRadius: t.radii.full,
    backgroundColor: t.colors.control.checked,
  },
  thumb: {
    width: t.sizes.icon.lg,
    height: t.sizes.icon.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radii.full,
    backgroundColor: t.colors.control.thumb,
    boxShadow: t.shadows.sm,
  },
}));
