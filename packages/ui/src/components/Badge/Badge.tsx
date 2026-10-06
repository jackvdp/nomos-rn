import type { Tone } from '@nomos/tokens';
import { View, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Text } from '../Text';

export interface BadgeProps extends Omit<ViewProps, 'children'> {
  /** Number to show. With no `count` and no `dot`, nothing renders. */
  count?: number;
  /** Counts above this show as `max+`. Defaults to 99. */
  max?: number;
  /** A small dot with no number, for "something new". */
  dot?: boolean;
  /** Defaults to `danger`. */
  tone?: Tone;
  /** Shows the badge when `count` is 0. Hidden by default. */
  showZero?: boolean;
  /** Formats the visible count, e.g. for locale digits. Defaults to `99+` style. */
  formatCount?: (count: number, max: number) => string;
  /** Adds a ring in the surface colour so the badge stands out over an icon or avatar. */
  ring?: boolean;
  /**
   * What the badge means, e.g. "12 unread messages". Without it a count
   * badge reads as the bare number and a dot is hidden from screen readers,
   * so the parent's label must carry the meaning.
   */
  'aria-label'?: string;
}

const defaultFormatCount = (count: number, max: number) =>
  count > max ? `${max}+` : String(count);

/**
 * A count or dot for unread items and notifications. Place it next to a
 * label, or position it over an icon or avatar from the parent.
 */
export function Badge({
  count,
  max = 99,
  dot = false,
  tone = 'danger',
  showZero = false,
  formatCount = defaultFormatCount,
  ring = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}: BadgeProps) {
  const theme = useTheme();
  const styles = useStyles();
  const visible = dot || (count != null && (count > 0 || showZero));
  if (!visible) return null;

  const colors = theme.colors.tone[tone];
  const border = ring ? theme.borderWidths.thick : 0;
  const size = dot
    ? theme.space.sm + 2 * border
    : (theme.typography.caption.lineHeight ?? 0) + 2 * theme.space.xxs + 2 * border;

  return (
    <View
      accessible={ariaLabel ? true : undefined}
      aria-label={ariaLabel}
      aria-hidden={dot && !ariaLabel}
      style={[
        styles.base,
        {
          minWidth: size,
          minHeight: size,
          backgroundColor: colors.solid,
          borderWidth: border,
          paddingHorizontal: dot ? 0 : theme.space.xs,
        },
        style,
      ]}
      {...rest}
    >
      {!dot && count != null && (
        <Text
          variant="caption"
          weight="bold"
          numberOfLines={1}
          style={[styles.count, { color: colors.onSolid }]}
        >
          {formatCount(count, max)}
        </Text>
      )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: t.radii.full,
    borderColor: t.colors.bg.surface,
  },
  count: {
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
}));
