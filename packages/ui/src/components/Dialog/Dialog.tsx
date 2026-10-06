import { useId, useRef, type ReactNode } from 'react';
import { Animated, Modal, Pressable, View } from 'react-native';

import { makeStyles } from '../../theme';
import { useReducedMotion } from '../../utils';
import { Button, type ButtonVariant } from '../Button';
import { Text } from '../Text';
import { focusForAccessibility, useOverlayTransition } from '../../utils/useOverlayTransition';

export interface DialogAction {
  label: string;
  onPress: () => void;
  /** Defaults to `primary` for the last action and `secondary` for the others. */
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

export interface DialogProps {
  /** Controlled: the dialog animates in when this turns on and out when it turns off. */
  visible: boolean;
  /**
   * Called when the user asks to close without choosing an action: a backdrop
   * tap, Android back, Escape on web or the VoiceOver escape gesture. Set
   * `visible` to false in response. Not called when `dismissable` is false.
   */
  onDismiss: () => void;
  title: string;
  message?: string;
  /** Extra content between the message and the actions, such as a form field. */
  children?: ReactNode;
  /**
   * Buttons in reading order, the main action last. They sit in a row at the
   * end edge, or stack full width (main action on top) when there are more
   * than two or the labels are long. Actions don't close the dialog: set
   * `visible` to false in their handlers.
   */
  actions?: DialogAction[];
  /** Whether the backdrop, back button and escape gestures close the dialog. Defaults to true. */
  dismissable?: boolean;
  /** Forces stacked (`true`) or row (`false`) actions, e.g. for a language with long labels. */
  stackActions?: boolean;
  /** Also sets `${testID}-backdrop` on the backdrop. */
  testID?: string;
}

const MAX_WIDTH = 400;
const ENTER_SCALE = 0.95;
/** Total label length past which two actions no longer fit side by side on a small phone. */
const LONG_LABELS = 24;

/**
 * A modal question that needs an answer before the user carries on, usually
 * to confirm something destructive like revoking a credential. Keep it to a
 * short title, one or two sentences and at most three actions; for anything
 * longer use a Sheet or a screen.
 */
export function Dialog({
  visible,
  onDismiss,
  title,
  message,
  children,
  actions = [],
  dismissable = true,
  stackActions,
  testID,
}: DialogProps) {
  const styles = useStyles();
  const reducedMotion = useReducedMotion();
  const { rendered, progress } = useOverlayTransition(visible);
  const headerRef = useRef<View>(null);
  const titleId = useId();

  const dismiss = () => {
    if (dismissable) onDismiss();
  };
  const labelLength = actions.reduce((total, action) => total + action.label.length, 0);
  const stacked = stackActions ?? (actions.length > 2 || labelLength > LONG_LABELS);
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [ENTER_SCALE, 1] });
  const lastIndex = actions.length - 1;
  const buttons = actions.map((action, index) => (
    <Button
      key={`${index}-${action.label}`}
      label={action.label}
      onPress={action.onPress}
      variant={action.variant ?? (index === lastIndex ? 'primary' : 'secondary')}
      loading={action.loading}
      disabled={action.disabled}
      fullWidth={stacked}
    />
  ));

  return (
    <Modal
      visible={rendered}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="none"
      onRequestClose={dismiss}
      onShow={() => focusForAccessibility(headerRef.current)}
    >
      <View style={styles.container}>
        <Animated.View aria-hidden style={[styles.backdrop, { opacity: progress }]}>
          <Pressable
            style={styles.fill}
            onPress={dismiss}
            focusable={false}
            testID={testID && `${testID}-backdrop`}
          />
        </Animated.View>
        <Animated.View
          role="alertdialog"
          aria-modal
          aria-labelledby={titleId}
          onAccessibilityEscape={dismissable ? onDismiss : undefined}
          testID={testID}
          style={[
            styles.dialog,
            {
              opacity: progress,
              transform: reducedMotion ? [] : [{ scale }],
            },
          ]}
        >
          <View ref={headerRef} accessible style={styles.header}>
            <Text nativeID={titleId} variant="headingSm">
              {title}
            </Text>
            {message ? (
              <Text variant="body" color="secondary">
                {message}
              </Text>
            ) : null}
          </View>
          {children}
          {buttons.length > 0 ? (
            <View style={stacked ? styles.actionsStacked : styles.actionsRow}>
              {stacked ? buttons.slice().reverse() : buttons}
            </View>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: t.space.xl,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    backgroundColor: t.colors.bg.overlay,
  },
  fill: {
    flex: 1,
  },
  dialog: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    gap: t.space.xl,
    padding: t.space.xl,
    borderRadius: t.radii.xl,
    backgroundColor: t.colors.bg.raised,
    boxShadow: t.shadows.lg,
  },
  header: {
    gap: t.space.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: t.space.sm,
  },
  actionsStacked: {
    gap: t.space.sm,
  },
}));
