import type { Tone } from '@nomos/tokens';
import { View, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';

export type TagVariant = 'subtle' | 'solid' | 'outline';
export type TagSize = 'sm' | 'md';

export interface TagProps extends Omit<ViewProps, 'children'> {
  /** Visible text. */
  label: string;
  /** Meaning of the tag. Defaults to `neutral`. */
  tone?: Tone;
  /**
   * - `subtle` (the default): tinted background, for most statuses.
   * - `solid`: filled, for the one status that must stand out.
   * - `outline`: border only, for low-emphasis labels such as topics.
   */
  variant?: TagVariant;
  /** Pair status tones with an icon so colour is not the only signal. */
  icon?: IconName;
  /** Defaults to `md`. */
  size?: TagSize;
}

/**
 * A short, non-interactive label for a status or category, e.g. a
 * credential's validity or a post's topic.
 */
export function Tag({
  label,
  tone = 'neutral',
  variant = 'subtle',
  icon,
  size = 'md',
  style,
  ...rest
}: TagProps) {
  const theme = useTheme();
  const styles = useStyles();
  const colors = theme.colors.tone[tone];
  const fg = variant === 'solid' ? colors.onSolid : colors.onSubtle;
  const bg = variant === 'solid' ? colors.solid : variant === 'subtle' ? colors.subtle : 'transparent';
  const borderColor = variant === 'outline' ? colors.border : bg;

  return (
    <View
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: bg, borderColor },
        style,
      ]}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 'xs' : 'sm'} color={fg} />}
      <Text
        variant={size === 'sm' ? 'caption' : 'labelSm'}
        weight="semibold"
        numberOfLines={1}
        style={[styles.label, { color: fg }]}
      >
        {label}
      </Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    borderRadius: t.radii.full,
    borderWidth: t.borderWidths.thin,
  },
  sm: {
    gap: t.space.xxs,
    paddingHorizontal: t.space.sm - t.borderWidths.thin,
    paddingVertical: t.space.xxs - t.borderWidths.thin,
  },
  md: {
    gap: t.space.xs,
    paddingHorizontal: t.space.md - t.borderWidths.thin,
    paddingVertical: t.space.xs - t.borderWidths.thin,
  },
  label: {
    flexShrink: 1,
  },
}));
