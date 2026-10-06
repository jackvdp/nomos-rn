import type { AvatarSize, IconSize } from '@nomos/tokens';
import { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon } from '../Icon';
import { Text } from '../Text';
import {
  avatarColors,
  avatarRadius,
  fallbackIconSize,
  getInitials,
  initialsVariant,
  type AvatarShape,
} from './avatarStyle';

export type { AvatarShape } from './avatarStyle';

export interface AvatarProps extends Omit<ViewProps, 'children' | 'style'> {
  /** The person's or organisation's name. Gives the initials and the accessibility label. */
  name: string;
  /** Photo or logo. Initials show while it loads and stay if it fails to load. */
  source?: ImageSourcePropType;
  /** Defaults to `md` (40). */
  size?: AvatarSize;
  /** `circle` (the default) for people, `rounded` for organisations. */
  shape?: AvatarShape;
  /** Adds a shield at the bottom-end corner for verified people and institutions. */
  verified?: boolean;
  /** Read after the name when `verified` is set. */
  verifiedLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const badgeIconSize = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
} as const satisfies Record<AvatarSize, IconSize>;

function sourceKey(source: ImageSourcePropType): unknown {
  if (typeof source === 'number') return source;
  const first = Array.isArray(source) ? source[0] : source;
  return first?.uri;
}

/**
 * A person's photo or an organisation's logo, falling back to initials on a
 * colour derived from the name. Screen readers hear the name.
 */
export function Avatar({
  name,
  source,
  size = 'md',
  shape = 'circle',
  verified = false,
  verifiedLabel = 'Verified',
  style,
  'aria-label': ariaLabel,
  ...rest
}: AvatarProps) {
  const theme = useTheme();
  const styles = useStyles();
  const [load, setLoad] = useState<{ key: unknown; status: 'loaded' | 'failed' } | null>(null);
  const px = theme.sizes.avatar[size];
  const radius = avatarRadius(theme, size, shape);
  const colors = avatarColors(theme, name);
  const initials = getInitials(name);
  const key = source == null ? undefined : sourceKey(source);
  const status = load && load.key === key ? load.status : 'loading';
  const showImage = source != null && status !== 'failed';
  const showFallback = !showImage || status !== 'loaded';
  const ring = theme.borderWidths.thick;
  const fallback = initials ? (
    <Text
      variant={initialsVariant[size]}
      role="none"
      weight="semibold"
      numberOfLines={1}
      allowFontScaling={false}
      style={{ color: colors.onSubtle }}
    >
      {initials}
    </Text>
  ) : (
    <Icon
      name={shape === 'rounded' ? 'building' : 'person'}
      size={fallbackIconSize[size]}
      color={colors.onSubtle}
    />
  );

  return (
    <View
      accessible
      role="img"
      aria-label={ariaLabel ?? (verified ? `${name}, ${verifiedLabel}` : name)}
      style={[{ width: px, height: px }, style]}
      {...rest}
    >
      <View style={[styles.face, { borderRadius: radius, backgroundColor: colors.subtle }]}>
        {showFallback && fallback}
        {showImage && (
          <Image
            source={source}
            aria-hidden
            resizeMode="cover"
            onLoad={() => setLoad({ key, status: 'loaded' })}
            onError={() => setLoad({ key, status: 'failed' })}
            testID={rest.testID && `${rest.testID}-image`}
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>
      {verified && (
        <View style={[styles.badge, { padding: ring, bottom: -ring, end: -ring }]}>
          <Icon name="verified" size={badgeIconSize[size]} color={theme.colors.accent.solid} />
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  face: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    borderRadius: t.radii.full,
    backgroundColor: t.colors.bg.surface,
  },
}));
