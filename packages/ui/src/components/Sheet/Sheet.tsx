import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { makeStyles, useTheme } from '../../theme';
import { useReducedMotion } from '../../utils';
import { focusForAccessibility, useOverlayTransition } from '../Dialog/useOverlayTransition';
import { Text } from '../Text';

export interface SheetProps {
  /** Controlled: the sheet slides up when this turns on and down when it turns off. */
  visible: boolean;
  /**
   * Called when the user asks to close: a backdrop tap, a swipe down, the
   * drag handle, Android back, Escape on web or the VoiceOver escape gesture.
   * Set `visible` to false in response. Not called when `dismissable` is false.
   */
  onDismiss: () => void;
  title?: string;
  children: ReactNode;
  /** Whether the user can close the sheet without finishing. Defaults to true. */
  dismissable?: boolean;
  /** Pads the content to line up with the title. Turn off for edge-to-edge rows. Defaults to true. */
  padded?: boolean;
  /** Accessibility label for the drag handle, which closes the sheet when tapped. */
  dismissLabel?: string;
  /** Names the sheet for screen readers when it has no title. */
  'aria-label'?: string;
  /** Also sets `${testID}-backdrop` on the backdrop. */
  testID?: string;
}

/** The sheet never covers more than this share of the screen, so the page behind stays visible. */
const MAX_HEIGHT = 0.9;
/** Release past this share of the sheet's height, or flick faster than this (dp/ms), to dismiss. */
const DISMISS_DISTANCE = 1 / 3;
const DISMISS_VELOCITY = 0.5;

/**
 * A panel that slides up from the bottom for a short task or a list of
 * choices, keeping the screen behind it in context. Content scrolls when it
 * is taller than the screen allows.
 */
export function Sheet({
  visible,
  onDismiss,
  title,
  children,
  dismissable = true,
  padded = true,
  dismissLabel = 'Close',
  'aria-label': ariaLabel,
  testID,
}: SheetProps) {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const { rendered, progress } = useOverlayTransition(visible);
  const titleRef = useRef<View>(null);
  const atTop = useRef(true);
  const [dragY] = useState(() => new Animated.Value(0));
  const [height, setHeight] = useState(window.height);

  const dismiss = () => {
    if (dismissable) onDismiss();
  };

  // Gesture callbacks are created once, so they read the latest props from here.
  const latest = useRef({ dismiss, height });
  useEffect(() => {
    latest.current = { dismiss, height };
  });

  useEffect(() => {
    if (visible) dragY.setValue(0);
  }, [visible, dragY]);

  const panResponder = useMemo(() => {
    const settle = () =>
      Animated.timing(dragY, {
        toValue: 0,
        duration: theme.duration.fast,
        easing: Easing.bezier(...theme.easing.standard),
        useNativeDriver: true,
      }).start();
    return PanResponder.create({
      // Claim vertical drags downward, but leave them to the content while it is scrolled.
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        atTop.current && gesture.dy > theme.space.sm && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => dragY.setValue(Math.max(0, gesture.dy)),
      onPanResponderRelease: (_, gesture) => {
        const pastThreshold =
          gesture.dy > latest.current.height * DISMISS_DISTANCE || gesture.vy > DISMISS_VELOCITY;
        if (pastThreshold) latest.current.dismiss();
        // Snap back when not dismissed; once dismissed, the exit carries on from the drag position.
        settle();
      },
      onPanResponderTerminate: settle,
      onPanResponderTerminationRequest: () => false,
    });
  }, [dragY, theme]);

  const translateY = useMemo(
    () =>
      reducedMotion
        ? dragY
        : Animated.add(progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }), dragY),
    [reducedMotion, progress, dragY, height],
  );
  const maxHeight = Math.min(window.height * MAX_HEIGHT, window.height - insets.top);

  return (
    <Modal
      visible={rendered}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="none"
      onRequestClose={dismiss}
      onShow={() => focusForAccessibility(titleRef.current)}
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
          role="dialog"
          aria-modal
          aria-label={ariaLabel ?? title}
          onAccessibilityEscape={dismissable ? onDismiss : undefined}
          onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
          testID={testID}
          style={[
            styles.sheet,
            {
              maxHeight,
              opacity: reducedMotion ? progress : 1,
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {dismissable ? (
            <Pressable
              role="button"
              aria-label={dismissLabel}
              onPress={onDismiss}
              hitSlop={theme.space.sm}
              style={styles.handleArea}
            >
              <View style={styles.handle} />
            </Pressable>
          ) : (
            <View style={styles.handleArea}>
              <View style={styles.handle} />
            </View>
          )}
          {title ? (
            <View ref={titleRef} accessible style={styles.header}>
              <Text variant="headingSm">{title}</Text>
            </View>
          ) : null}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              padded && styles.padded,
              { paddingBottom: insets.bottom + theme.space.lg },
            ]}
            bounces={false}
            scrollEventThrottle={16}
            onScroll={(event) => {
              atTop.current = event.nativeEvent.contentOffset.y <= 0;
            }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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
  sheet: {
    width: '100%',
    maxWidth: t.breakpoints.medium,
    alignSelf: 'center',
    backgroundColor: t.colors.bg.raised,
    borderTopStartRadius: t.radii.xxl,
    borderTopEndRadius: t.radii.xxl,
    boxShadow: t.shadows.lg,
  },
  // A tall, wide target around the small visible handle.
  handleArea: {
    alignSelf: 'center',
    paddingVertical: t.space.md,
    paddingHorizontal: t.space.xl,
  },
  handle: {
    width: t.space.xxl,
    height: t.space.xs,
    borderRadius: t.radii.full,
    backgroundColor: t.colors.border.strong,
  },
  header: {
    paddingHorizontal: t.space.xl,
    paddingBottom: t.space.md,
  },
  scroll: {
    flexGrow: 0,
  },
  padded: {
    paddingHorizontal: t.space.xl,
  },
}));
