import { View, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export type VerifiedBadgeSize = 'sm' | 'md';

export interface VerifiedBadgeProps extends Omit<ViewProps, 'children'> {
  /** Visible text after the shield, e.g. "Verified". Leave out for an icon-only badge. */
  label?: string;
  /** `sm` (the default) sits next to body or caption text; `md` next to headings. */
  size?: VerifiedBadgeSize;
  /**
   * What screen readers hear. Defaults to `label`, or to "Verified" for an
   * icon-only badge. Use it for detail, e.g. "Verified by Northshire Electoral Commission".
   */
  'aria-label'?: string;
}

/**
 * Shows that a person or institution has been verified by NOMOS or an
 * issuing organisation. Place it right after the name it refers to.
 */
export function VerifiedBadge({
  label,
  size = 'sm',
  style,
  'aria-label': ariaLabel,
  ...rest
}: VerifiedBadgeProps) {
  const theme = useTheme();
  const styles = useStyles();
  const { accent } = theme.colors;

  return (
    <View
      accessible
      role="img"
      aria-label={ariaLabel ?? label ?? 'Verified'}
      style={[styles.base, style]}
      {...rest}
    >
      <Icon name="verified" size={size === 'sm' ? 'sm' : 'md'} color={accent.solid} />
      {label ? (
        <Text
          variant={size === 'sm' ? 'caption' : 'labelSm'}
          weight="semibold"
          numberOfLines={1}
          style={{ color: accent.onSubtle }}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexShrink: 0,
    gap: t.space.xxs,
  },
}));
