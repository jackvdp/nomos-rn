import type { Tone } from '@nomos/tokens';
import { View, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
  leadingIcon?: IconName;
}

export interface EmptyStateProps extends Omit<ViewProps, 'children'> {
  /** Shown in a tinted circle above the title. */
  icon?: IconName;
  /** Tint of the icon circle. Defaults to `brand`. */
  tone?: Tone;
  title: string;
  /** One or two sentences on why it's empty and what to do next. */
  description?: string;
  /** The main way forward, as a primary button. */
  action?: EmptyStateAction;
  /** An alternative, as a secondary button under the primary. */
  secondaryAction?: EmptyStateAction;
}

/**
 * Fills a screen or section that has nothing to show yet, such as an empty
 * inbox, no search results or no connection, and points to the next step.
 */
export function EmptyState({
  icon,
  tone = 'brand',
  title,
  description,
  action,
  secondaryAction,
  style,
  ...rest
}: EmptyStateProps) {
  const theme = useTheme();
  const styles = useStyles();
  const colors = theme.colors.tone[tone];

  return (
    <View style={[styles.base, style]} {...rest}>
      {icon ? (
        <View style={[styles.circle, { backgroundColor: colors.subtle }]}>
          <Icon name={icon} size="xl" color={colors.onSubtle} />
        </View>
      ) : null}
      <View style={styles.text}>
        <Text variant="headingSm" align="center">
          {title}
        </Text>
        {description ? (
          <Text variant="bodySm" color="secondary" align="center">
            {description}
          </Text>
        ) : null}
      </View>
      {action || secondaryAction ? (
        <View style={styles.actions}>
          {action ? (
            <Button
              label={action.label}
              onPress={action.onPress}
              leadingIcon={action.leadingIcon}
              style={styles.button}
            />
          ) : null}
          {secondaryAction ? (
            <Button
              variant="secondary"
              label={secondaryAction.label}
              onPress={secondaryAction.onPress}
              leadingIcon={secondaryAction.leadingIcon}
              style={styles.button}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space.lg,
    paddingHorizontal: t.space.xl,
    paddingVertical: t.space.xxl,
  },
  circle: {
    width: t.sizes.avatar.xl,
    height: t.sizes.avatar.xl,
    borderRadius: t.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignItems: 'center',
    gap: t.space.xs,
  },
  actions: {
    alignItems: 'center',
    gap: t.space.sm,
    marginTop: t.space.xs,
  },
  button: {
    alignSelf: 'center',
  },
}));
