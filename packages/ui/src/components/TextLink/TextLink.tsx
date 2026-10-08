import type { TextVariant } from '@nomos/tokens';
import { useState } from 'react';
import {
  Text as RNText,
  type GestureResponderEvent,
  type TextProps as RNTextProps,
} from 'react-native';

import { makeStyles, useTheme } from '../../theme';

export interface TextLinkProps extends Omit<RNTextProps, 'children' | 'role' | 'onPress'> {
  /** The link text. */
  children: string;
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Type style. Leave unset inside a `Text` paragraph so the link inherits
   * the paragraph's size and weight (`body` for a default `Text`). Set it for
   * a link that stands on its own.
   */
  variant?: TextVariant;
}

/**
 * Pressable link text, usually nested inside a `Text` paragraph ("Read the
 * <TextLink>polling station guide</TextLink> before your shift"). Use
 * `Button` with `variant="tertiary"` for standalone actions: inline links
 * cannot grow to the 44-point touch target.
 *
 * Renders React Native's `Text` directly (rather than the library `Text`) so
 * that, nested, it inherits the surrounding type style.
 */
export function TextLink({
  children,
  variant,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: TextLinkProps) {
  const theme = useTheme();
  const styles = useStyles();
  const [pressed, setPressed] = useState(false);

  return (
    <RNText
      role="link"
      // The iOS grey press highlight is replaced by the opacity change below.
      suppressHighlighting
      onPressIn={(event) => {
        setPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        onPressOut?.(event);
      }}
      style={[variant && theme.typography[variant], styles.link, pressed && styles.pressed, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

const useStyles = makeStyles((t) => ({
  link: {
    color: t.colors.text.link,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: t.opacity.pressed,
  },
}));
