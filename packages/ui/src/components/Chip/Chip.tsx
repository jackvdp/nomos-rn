import type { Space } from '@nomos/tokens';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';

export interface ChipProps extends Omit<
  PressableProps,
  'children' | 'style' | 'onPress' | 'disabled'
> {
  /** Visible text. Also the accessibility label unless you pass one. */
  label: string;
  /** Shows the chip as on, with a check mark. */
  selected?: boolean;
  /** Makes the chip a toggle. Without it the chip is a static label. */
  onPress?: () => void;
  /** Replaced by a check mark while selected. */
  leadingIcon?: IconName;
  /** Shows a small remove button after the label. */
  onRemove?: () => void;
  /**
   * Accessibility label for the remove button. Include the chip's label so
   * it makes sense on its own, e.g. "Remove Amara Okafor".
   */
  removeLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * A compact toggle for filtering a list, such as All / My Organisation /
 * NOMOS Network / Following on the feed. Screen readers hear a checkbox
 * that is checked while the chip is selected. Group chips in a ChipGroup.
 */
export function Chip({
  label,
  selected = false,
  onPress,
  leadingIcon,
  onRemove,
  removeLabel = 'Remove',
  disabled = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}: ChipProps) {
  const theme = useTheme();
  const styles = useStyles();
  const { accent, bg, text, border } = theme.colors;
  const colors = selected
    ? { bg: accent.subtle, fg: accent.onSubtle, border: accent.border }
    : { bg: bg.surface, fg: text.primary, border: border.strong };
  const icon = selected ? 'check' : leadingIcon;
  const slop = (theme.sizes.touchTarget - theme.sizes.control.sm) / 2;

  const content = (
    <>
      {icon ? <Icon name={icon} size="sm" color={colors.fg} /> : null}
      <Text variant="labelSm" style={{ color: colors.fg }} numberOfLines={1}>
        {label}
      </Text>
    </>
  );

  // The remove button is a sibling of the toggle, not a child: a button
  // nested in another pressable can't be reached with VoiceOver.
  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: colors.bg, borderColor: colors.border },
        disabled && styles.disabled,
        style,
      ]}
    >
      {onPress ? (
        <Pressable
          role="checkbox"
          aria-checked={selected}
          aria-label={ariaLabel ?? label}
          aria-disabled={disabled}
          disabled={disabled}
          hitSlop={{ top: slop, bottom: slop }}
          onPress={onPress}
          style={({ pressed }) => [
            styles.body,
            onRemove && styles.bodyBeforeRemove,
            pressed && styles.pressed,
          ]}
          {...rest}
        >
          {content}
        </Pressable>
      ) : (
        <View style={[styles.body, onRemove && styles.bodyBeforeRemove]}>{content}</View>
      )}
      {onRemove ? (
        <Pressable
          role="button"
          aria-label={removeLabel}
          aria-disabled={disabled}
          disabled={disabled}
          hitSlop={{ top: slop, bottom: slop }}
          onPress={onRemove}
          style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
        >
          <Icon name="close" size="sm" color={colors.fg} />
        </Pressable>
      ) : null}
    </View>
  );
}

export interface ChipGroupProps extends ViewProps {
  /** Lays chips out in one horizontally scrolling row instead of wrapping. */
  scrollable?: boolean;
  /** Space between chips. Defaults to `sm`. */
  gap?: Space;
  /** Padding inside the scrolling row, e.g. to line up with the screen edge. */
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/** Lays out a set of chips, wrapping onto new lines or scrolling sideways. */
export function ChipGroup({
  scrollable = false,
  gap = 'sm',
  contentContainerStyle,
  style,
  children,
  ...rest
}: ChipGroupProps) {
  const theme = useTheme();
  const styles = useStyles();
  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={style}
        contentContainerStyle={[styles.row, { gap: theme.space[gap] }, contentContainerStyle]}
        {...rest}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <View style={[styles.row, styles.wrap, { gap: theme.space[gap] }, style]} {...rest}>
      {children}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'flex-start',
    minHeight: t.sizes.control.sm,
    borderRadius: t.radii.full,
    borderWidth: t.borderWidths.thin,
  },
  disabled: {
    opacity: t.opacity.disabled,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.xs,
    paddingHorizontal: t.space.md,
  },
  bodyBeforeRemove: {
    paddingEnd: t.space.xxs,
  },
  remove: {
    justifyContent: 'center',
    paddingStart: t.space.xs,
    paddingEnd: t.space.sm,
  },
  pressed: {
    opacity: t.opacity.pressed,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrap: {
    flexWrap: 'wrap',
  },
}));
