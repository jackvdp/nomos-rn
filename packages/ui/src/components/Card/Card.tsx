import type { Space } from '@nomos/tokens';
import type { ReactNode } from 'react';
import {
  Pressable,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme } from '../../theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps extends Omit<ViewProps, 'children' | 'style'> {
  children?: ReactNode;
  /**
   * - `elevated` (the default): surface with a soft shadow, for feed items.
   * - `outlined`: surface with a border, for cards inside cards or dense lists.
   * - `filled`: sunken background, for grouped content inside a surface.
   */
  variant?: CardVariant;
  /** Inner padding. Defaults to `lg`. */
  padding?: Space;
  /**
   * Makes the whole card a button. Its accessibility label defaults to the
   * text inside; pass `aria-label` when that would be long or unclear.
   * Don't put other buttons inside a pressable card.
   */
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Groups related content on its own surface. */
export function Card({
  children,
  variant = 'elevated',
  padding = 'lg',
  onPress,
  onLongPress,
  disabled = false,
  style,
  ...rest
}: CardProps) {
  const theme = useTheme();
  const styles = useStyles();
  const base = [styles.base, styles[variant], { padding: theme.space[padding] }];

  if (!onPress && !onLongPress) {
    return (
      <View style={[base, style]} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      role="button"
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        base,
        pressed && { opacity: theme.opacity.pressed },
        disabled && { opacity: theme.opacity.disabled },
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    borderRadius: t.radii.lg,
    borderWidth: t.borderWidths.thin,
  },
  elevated: {
    backgroundColor: t.colors.bg.surface,
    borderColor: t.colors.border.subtle,
    boxShadow: t.shadows.sm,
  },
  outlined: {
    backgroundColor: t.colors.bg.surface,
    borderColor: t.colors.border.default,
  },
  filled: {
    backgroundColor: t.colors.bg.sunken,
    borderColor: t.colors.bg.sunken,
  },
}));
