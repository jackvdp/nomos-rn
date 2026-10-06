import { Pressable, View, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';

export type SegmentedControlSize = 'sm' | 'md';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> extends Omit<
  ViewProps,
  'children'
> {
  /** Two to five short options. */
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: SegmentedControlSize;
  /** Stretches to the width of its container, with equal-width segments. */
  fullWidth?: boolean;
}

/**
 * Switches between a few views of the same content, such as Feed / Events /
 * Courses. Each segment is a tab for screen readers. For filters that can
 * combine, use Chip.
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  style,
  ...rest
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  const styles = useStyles();
  const height = theme.sizes.control[size] - 2 * theme.space.xxs;
  const slop = Math.max(0, (theme.sizes.touchTarget - height) / 2);

  return (
    <View role="tablist" style={[styles.track, fullWidth && styles.fullWidth, style]} {...rest}>
      {options.map((option) => {
        const selected = option.value === value;
        const color = option.disabled ? 'disabled' : selected ? 'primary' : 'secondary';
        return (
          <Pressable
            key={option.value}
            role="tab"
            aria-label={option.label}
            aria-selected={selected}
            aria-disabled={option.disabled}
            disabled={option.disabled}
            hitSlop={{ top: slop, bottom: slop }}
            onPress={() => {
              if (!selected) onChange(option.value);
            }}
            style={({ pressed }) => [
              styles.segment,
              {
                minHeight: height,
                paddingHorizontal: size === 'sm' ? theme.space.md : theme.space.lg,
              },
              fullWidth && styles.segmentFill,
              selected && styles.selected,
              pressed && !selected && styles.pressed,
            ]}
          >
            {option.icon ? (
              <Icon
                name={option.icon}
                size={size === 'sm' ? 'sm' : 'md'}
                color={theme.colors.text[color]}
              />
            ) : null}
            <Text variant={size === 'sm' ? 'labelSm' : 'label'} color={color} numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  track: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: t.space.xxs,
    padding: t.space.xxs,
    borderRadius: t.radii.md,
    backgroundColor: t.colors.bg.sunken,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space.xs,
    // Nested inside the track's radius, less its padding.
    borderRadius: t.radii.md - t.space.xxs,
  },
  segmentFill: {
    flex: 1,
  },
  selected: {
    backgroundColor: t.colors.bg.surface,
    boxShadow: t.shadows.sm,
  },
  pressed: {
    opacity: t.opacity.pressed,
  },
}));
