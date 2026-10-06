import type { Tone } from '@nomos/tokens';
import type { ReactNode } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';
import { toneIcon } from './toneIcon';

export interface BannerAction {
  label: string;
  onPress: () => void;
}

export interface BannerProps extends Omit<ViewProps, 'children'> {
  /**
   * Meaning and colour. `warning` and `danger` are alerts that screen readers
   * announce straight away; the others are announced politely. Defaults to `info`.
   */
  tone?: Tone;
  title?: string;
  /** A string, or your own content such as text with a link. */
  message: ReactNode;
  /** Replaces the tone's default icon. */
  icon?: IconName;
  /** One follow-up action, such as "Renew" or "Try again". */
  action?: BannerAction;
  /** Shows a close button when set. */
  onDismiss?: () => void;
  /** Accessibility label for the close button. */
  dismissLabel?: string;
}

/**
 * An inline message about the current screen or the user's situation:
 * offline, a credential about to expire, a form that failed to save. It sits
 * in the layout; for brief confirmations use a toast instead.
 */
export function Banner({
  tone = 'info',
  title,
  message,
  icon,
  action,
  onDismiss,
  dismissLabel = 'Dismiss',
  style,
  ...rest
}: BannerProps) {
  const theme = useTheme();
  const styles = useStyles();
  const colors = theme.colors.tone[tone];
  const urgent = tone === 'warning' || tone === 'danger';
  const slop = (theme.sizes.touchTarget - theme.sizes.control.sm) / 2;

  return (
    <View
      style={[styles.base, { backgroundColor: colors.subtle, borderColor: colors.border }, style]}
      {...rest}
    >
      <Icon name={icon ?? toneIcon[tone]} color={colors.onSubtle} />
      <View style={styles.body}>
        <View
          accessible
          role={urgent ? 'alert' : 'status'}
          aria-live={urgent ? 'assertive' : 'polite'}
          style={styles.text}
        >
          {title ? (
            <Text variant="label" style={{ color: colors.onSubtle }}>
              {title}
            </Text>
          ) : null}
          {typeof message === 'string' ? (
            <Text variant="bodySm" style={{ color: colors.onSubtle }}>
              {message}
            </Text>
          ) : (
            message
          )}
        </View>
        {action ? (
          <Pressable
            role="button"
            aria-label={action.label}
            onPress={action.onPress}
            hitSlop={slop}
            style={({ pressed }) => [styles.action, pressed && { opacity: theme.opacity.pressed }]}
          >
            <Text variant="labelSm" style={{ color: colors.onSubtle }} numberOfLines={1}>
              {action.label}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {onDismiss ? (
        <Pressable
          role="button"
          aria-label={dismissLabel}
          onPress={onDismiss}
          hitSlop={slop}
          style={({ pressed }) => [styles.dismiss, pressed && { opacity: theme.opacity.pressed }]}
        >
          <Icon name="close" color={colors.onSubtle} />
        </Pressable>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: t.space.md,
    padding: t.space.md,
    borderRadius: t.radii.md,
    borderWidth: t.borderWidths.thin,
  },
  body: {
    flex: 1,
    alignItems: 'flex-start',
  },
  text: {
    alignSelf: 'stretch',
    gap: t.space.xxs,
  },
  // Text-only like a tertiary button, in the tone's colour so it reads on the tint.
  action: {
    minHeight: t.sizes.control.sm,
    justifyContent: 'center',
    paddingHorizontal: t.space.sm,
    marginStart: -t.space.sm,
    marginBottom: -t.space.sm,
    borderRadius: t.radii.sm,
  },
  // Sized to the touch scale, then pulled in so the glyph lines up with the first line of text.
  dismiss: {
    width: t.sizes.control.sm,
    height: t.sizes.control.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -t.space.sm,
    marginEnd: -t.space.sm,
    borderRadius: t.radii.full,
  },
}));
