import type { ControlSize } from '@nomos/tokens';
import {
  ActivityIndicator,
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme, type Theme } from '../../theme';
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
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const styles = useStyles();
  const inactive = disabled || loading;
  const colors = disabled ? disabledColors(theme, variant) : theme.colors.action[variant];
  const height = theme.sizes.control[size];
  const iconSize = size === 'lg' ? 'lg' : 'md';
  // Small buttons stay small visually but keep a full-size touch area.
  const slop = hitSlop ?? Math.max(0, (theme.sizes.touchTarget - height) / 2);

  return (
    <Pressable
      role="button"
      aria-label={ariaLabel ?? label}
      aria-disabled={inactive}
      aria-busy={loading}
      disabled={inactive}
      hitSlop={slop}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: height,
          paddingHorizontal: variant === 'tertiary' ? paddingBySize[size] - 4 : paddingBySize[size],
          backgroundColor: pressed && !inactive ? theme.colors.action[variant].bgPressed : colors.bg,
          borderColor: colors.border,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.fg} />
      ) : leadingIcon ? (
        <Icon name={leadingIcon} size={iconSize} color={colors.fg} />
      ) : null}
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
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: t.space.sm,
    borderRadius: t.radii.md,
    borderWidth: t.borderWidths.thin,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
}));
