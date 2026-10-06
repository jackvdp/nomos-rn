import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon, type IconName } from '../Icon';
import { Text, type TextColor } from '../Text';

export interface ListItemProps extends Omit<ViewProps, 'children' | 'style'> {
  title: string;
  /** Secondary text under the title, e.g. a role or a setting's current value. */
  description?: string;
  /** Lines before the title truncates. Defaults to 1. */
  titleLines?: number;
  /** Lines before the description truncates. Defaults to 2. */
  descriptionLines?: number;
  /**
   * Content at the start, such as an Avatar. Takes precedence over
   * `leadingIcon`. An Avatar that only repeats the title can take
   * `aria-hidden` so screen readers don't hear the name twice.
   */
  leading?: ReactNode;
  /** Shortcut for a plain icon at the start. */
  leadingIcon?: IconName;
  /**
   * Content at the end, such as a Switch or Badge. Takes precedence over
   * `trailingText`. Don't put controls here when the row has `onPress`.
   */
  trailing?: ReactNode;
  /** Short value at the end, e.g. "English" for a language setting. */
  trailingText?: string;
  /** Shows a forward chevron for rows that open another screen. Mirrors in right-to-left. */
  showChevron?: boolean;
  /**
   * Makes the row a button. Its accessibility label joins the title,
   * description and trailing text unless you pass `aria-label`.
   */
  onPress?: (event: GestureResponderEvent) => void;
  /** Danger colour for destructive actions such as "Leave workspace". */
  destructive?: boolean;
  disabled?: boolean;
  /** Draws a hairline under the row, starting where the text starts. */
  divider?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** A row in settings, menus and directories: title, optional description, leading and trailing content. */
export function ListItem({
  title,
  description,
  titleLines = 1,
  descriptionLines = 2,
  leading,
  leadingIcon,
  trailing,
  trailingText,
  showChevron = false,
  onPress,
  destructive = false,
  disabled = false,
  divider = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}: ListItemProps) {
  const theme = useTheme();
  const styles = useStyles();
  const { text } = theme.colors;
  const titleColor: TextColor = disabled ? 'disabled' : destructive ? 'danger' : 'primary';
  const secondaryColor: TextColor = disabled ? 'disabled' : 'secondary';
  const iconColor = text[disabled ? 'disabled' : destructive ? 'danger' : 'secondary'];

  const start = leading ?? (leadingIcon && <Icon name={leadingIcon} size="lg" color={iconColor} />);
  const end =
    trailing ??
    (trailingText && (
      <Text variant="bodySm" color={secondaryColor} numberOfLines={1}>
        {trailingText}
      </Text>
    ));

  const content = (
    <>
      {start ? <View style={styles.leading}>{start}</View> : null}
      <View style={[styles.body, divider && styles.divider]}>
        <View style={styles.text}>
          <Text color={titleColor} numberOfLines={titleLines}>
            {title}
          </Text>
          {description ? (
            <Text variant="bodySm" color={secondaryColor} numberOfLines={descriptionLines}>
              {description}
            </Text>
          ) : null}
        </View>
        {end ? <View style={styles.trailing}>{end}</View> : null}
        {showChevron && (
          <Icon name="chevron-forward" color={disabled ? text.disabled : text.tertiary} />
        )}
      </View>
    </>
  );

  if (!onPress) {
    return (
      <View
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        style={[styles.row, style]}
        {...rest}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      role="button"
      // Explicit, so icon glyphs and custom leading content never leak into the name.
      aria-label={ariaLabel ?? [title, description, trailingText].filter(Boolean).join(', ')}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && { backgroundColor: theme.colors.action.tertiary.bgPressed },
        style,
      ]}
      {...rest}
    >
      {content}
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    // 56dp, the standard list row height. Always above the 44dp touch target.
    minHeight: t.sizes.touchTarget + t.space.md,
    paddingStart: t.space.lg,
  },
  leading: {
    justifyContent: 'center',
    paddingVertical: t.space.sm,
    marginEnd: t.space.md,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.md,
    paddingVertical: t.space.md,
    paddingEnd: t.space.lg,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: t.colors.border.default,
  },
  text: {
    flex: 1,
    gap: t.space.xxs,
  },
  trailing: {
    flexShrink: 0,
    maxWidth: '50%',
    alignItems: 'flex-end',
  },
}));
