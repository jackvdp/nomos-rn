import {
  ActivityIndicator,
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Badge } from '../Badge';
import { Icon, type IconName } from '../Icon';

export type IconButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonShape = 'circle' | 'square';

export interface IconButtonProps extends Omit<PressableProps, 'children' | 'style' | 'aria-label'> {
  icon: IconName;
  /**
   * What the button does, e.g. "Notifications" or "Close". Required: the icon
   * is the only visible content, so this is the button's only name.
   */
  'aria-label': string;
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * - `tertiary` (default): no fill, for app bars, toolbars and card corners.
   * - `primary`, `secondary`, `danger`: filled or outlined, as on `Button`.
   */
  variant?: IconButtonVariant;
  /** Visual size: 32, 40 or 48. The touch area is always at least 44. */
  size?: IconButtonSize;
  shape?: IconButtonShape;
  /** Shows a spinner, blocks presses and tells screen readers the button is busy. */
  loading?: boolean;
  disabled?: boolean;
  /** Count shown in a bubble at the top-end corner, e.g. unread notifications. Hidden when 0. */
  badge?: number;
  /** Highest count shown in full; larger counts show as e.g. "99+". */
  badgeMax?: number;
  /**
   * Builds the accessibility label while a badge is shown, so screen readers
   * hear the count. Override to translate.
   */
  formatBadgeLabel?: (label: string, count: number) => string;
  style?: StyleProp<ViewStyle>;
}

const dimensionBySize = { sm: 32, md: 40, lg: 48 } as const;
const iconSizeBySize = { sm: 'md', md: 'lg', lg: 'lg' } as const;

const defaultFormatBadgeLabel = (label: string, count: number) => `${label}, ${count} new`;

/**
 * An icon-only button, for compact actions whose icon is universally
 * understood (close, more, notifications). Prefer `Button` with a label when
 * there is room: icons alone are easy to misread.
 */
export function IconButton({
  icon,
  'aria-label': ariaLabel,
  variant = 'tertiary',
  size = 'md',
  shape = 'circle',
  loading = false,
  disabled = false,
  badge = 0,
  badgeMax = 99,
  formatBadgeLabel = defaultFormatBadgeLabel,
  hitSlop,
  style,
  ...rest
}: IconButtonProps) {
  const theme = useTheme();
  const styles = useStyles();
  const inactive = disabled || loading;
  const action = theme.colors.action[variant];
  // A disabled tertiary button stays unfilled so it doesn't read as selected.
  const colors = !disabled
    ? action
    : variant === 'tertiary'
      ? { ...theme.colors.action.disabled, bg: action.bg, border: action.border }
      : theme.colors.action.disabled;
  const dimension = dimensionBySize[size];
  const slop = hitSlop ?? Math.max(0, (theme.sizes.touchTarget - dimension) / 2);
  const showBadge = badge > 0;

  return (
    <Pressable
      role="button"
      aria-label={showBadge ? formatBadgeLabel(ariaLabel, badge) : ariaLabel}
      aria-disabled={inactive}
      aria-busy={loading}
      disabled={inactive}
      hitSlop={slop}
      style={({ pressed }) => [
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: shape === 'circle' ? theme.radii.full : theme.radii.md,
          backgroundColor: pressed && !inactive ? action.bgPressed : colors.bg,
          borderColor: colors.border,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.fg} />
      ) : (
        <Icon name={icon} size={iconSizeBySize[size]} color={colors.fg} />
      )}
      {showBadge ? (
        <Badge count={badge} max={badgeMax} ring aria-hidden style={styles.badge} />
      ) : null}
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: t.borderWidths.thin,
  },
  badge: {
    position: 'absolute',
    top: -t.space.xs,
    end: -t.space.xs,
  },
}));
