import type { AvatarSize, Space, TextVariant } from '@nomos/tokens';
import { View, type ImageSourcePropType, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Text } from '../Text';
import { Avatar } from './Avatar';
import { avatarRadius, type AvatarShape } from './avatarStyle';

export interface AvatarGroupItem {
  name: string;
  source?: ImageSourcePropType;
  shape?: AvatarShape;
  /** Stable React key. Defaults to the name. */
  id?: string;
}

export interface AvatarGroupProps extends Omit<ViewProps, 'children'> {
  avatars: AvatarGroupItem[];
  /** Most avatars to show before the rest collapse into a "+N" avatar. Defaults to 3. */
  max?: number;
  /**
   * Full count when it is larger than `avatars`, e.g. a workspace with 128
   * members where only the first few are loaded.
   */
  total?: number;
  /** Defaults to `sm` (32). */
  size?: AvatarSize;
  /** Visible text on the overflow avatar. */
  formatOverflow?: (count: number) => string;
  /** Builds the accessibility label from the shown names and the hidden count. */
  formatAccessibilityLabel?: (names: string[], overflow: number) => string;
}

const overlapBySize = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const satisfies Record<AvatarSize, Space>;

/** One step smaller than initials, since "+12" is wider than "AO". */
const overflowVariant = {
  xs: 'caption',
  sm: 'caption',
  md: 'labelSm',
  lg: 'bodyStrong',
  xl: 'headingMd',
} as const satisfies Record<AvatarSize, TextVariant>;

const defaultFormatOverflow = (count: number) => `+${count}`;

const defaultFormatAccessibilityLabel = (names: string[], overflow: number) =>
  overflow > 0 ? `${names.join(', ')} and ${overflow} more` : names.join(', ');

/**
 * An overlapping row of avatars, e.g. who is in a workspace or who reacted
 * to a post. Screen readers hear one summary instead of every avatar.
 */
export function AvatarGroup({
  avatars,
  max = 3,
  total,
  size = 'sm',
  formatOverflow = defaultFormatOverflow,
  formatAccessibilityLabel = defaultFormatAccessibilityLabel,
  style,
  'aria-label': ariaLabel,
  ...rest
}: AvatarGroupProps) {
  const theme = useTheme();
  const styles = useStyles();
  const shown = avatars.slice(0, Math.max(0, max));
  const overflow = Math.max(total ?? 0, avatars.length) - shown.length;
  const px = theme.sizes.avatar[size];
  const ring = theme.borderWidths.thick;
  const overlap = theme.space[overlapBySize[size]];

  return (
    <View
      accessible
      role="img"
      aria-label={
        ariaLabel ??
        formatAccessibilityLabel(
          shown.map((avatar) => avatar.name),
          overflow,
        )
      }
      style={[styles.row, style]}
      {...rest}
    >
      {shown.map((avatar, index) => (
        <View
          key={avatar.id ?? avatar.name}
          aria-hidden
          style={[
            styles.ring,
            {
              padding: ring,
              borderRadius: avatarRadius(theme, size, avatar.shape ?? 'circle') + ring,
              marginStart: index === 0 ? 0 : -overlap,
            },
          ]}
        >
          <Avatar name={avatar.name} source={avatar.source} shape={avatar.shape} size={size} />
        </View>
      ))}
      {overflow > 0 && (
        <View
          aria-hidden
          style={[
            styles.ring,
            {
              padding: ring,
              borderRadius: theme.radii.full,
              marginStart: shown.length === 0 ? 0 : -overlap,
            },
          ]}
        >
          <View style={[styles.overflow, { width: px, height: px }]}>
            <Text
              variant={overflowVariant[size]}
              role="none"
              weight="semibold"
              numberOfLines={1}
              allowFontScaling={false}
              style={{ color: theme.colors.tone.neutral.onSubtle }}
            >
              {formatOverflow(overflow)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  ring: {
    backgroundColor: t.colors.bg.surface,
  },
  overflow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radii.full,
    backgroundColor: t.colors.tone.neutral.subtle,
  },
}));
