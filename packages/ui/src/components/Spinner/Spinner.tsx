import { ActivityIndicator, View, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Text } from '../Text';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends Omit<ViewProps, 'children'> {
  /** `sm` sits inline with text, `md` (the default) fills a card, `lg` a whole screen. */
  size?: SpinnerSize;
  /** Any colour. Defaults to the brand action colour. */
  color?: string;
  /** Visible text under the spinner, such as "Loading messages". */
  label?: string;
  /** Read by screen readers. Defaults to `label`, then 'Loading'. */
  'aria-label'?: string;
}

const nativeSize = { sm: 'small', md: 'large', lg: 'large' } as const;
// iOS only has two native sizes, so `lg` scales `large` (36dp) up and reserves the extra room.
const LARGE_NATIVE = 36;
const LARGE_SCALE = 1.5;

/**
 * Shows that something is loading when you can't say how long it will take.
 * Prefer `Skeleton` when you know the shape of the content that is coming,
 * and `ProgressBar` when you can measure progress.
 */
export function Spinner({
  size = 'md',
  color,
  label,
  'aria-label': ariaLabel,
  style,
  ...rest
}: SpinnerProps) {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <View
      accessible
      role="progressbar"
      aria-label={ariaLabel ?? (label || 'Loading')}
      aria-busy
      style={[styles.base, style]}
      {...rest}
    >
      <ActivityIndicator
        size={nativeSize[size]}
        color={color ?? theme.colors.action.primary.bg}
        style={size === 'lg' && styles.large}
      />
      {label ? (
        <Text variant="bodySm" color="secondary" align="center">
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space.sm,
  },
  large: {
    margin: (LARGE_NATIVE * (LARGE_SCALE - 1)) / 2,
    transform: [{ scale: LARGE_SCALE }],
  },
}));
