import type { Tone } from '@nomos/tokens';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { darkTheme, lightTheme, makeStyles, useTheme } from '../../theme';
import { useReducedMotion } from '../../utils';
import { toneIcon } from '../Banner/toneIcon';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastOptions {
  message: string;
  /** Sets the icon and its colour. Defaults to `neutral`. */
  tone?: Tone;
  /** Replaces the tone's default icon. */
  icon?: IconName;
  /** Milliseconds before it hides itself. Defaults to 4000; `0` keeps it until dismissed. */
  duration?: number;
  /** One follow-up action, such as "Undo" or "View". Pressing it also hides the toast. */
  action?: ToastAction;
}

export interface ToastApi {
  /** Shows a toast and returns its id. */
  show: (options: ToastOptions) => string;
  /** Hides a toast early, e.g. once the thing it reported has finished. */
  hide: (id: string) => void;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** How many toasts show at once; later ones wait their turn. Defaults to 3. */
  limit?: number;
  /** Extra space above the bottom safe area, e.g. the height of a tab bar. */
  offset?: number;
  /** Accessibility label for the close button on toasts that don't hide themselves. */
  dismissLabel?: string;
}

interface ToastRecord extends ToastOptions {
  id: string;
  tone: Tone;
  duration: number;
  leaving: boolean;
}

const DEFAULT_DURATION = 4000;

const ToastContext = createContext<ToastApi | null>(null);

/**
 * Shows short, non-blocking messages at the bottom of the screen, such as
 * "Post published" or "Link copied". Wrap the app root once, inside the
 * ThemeProvider and SafeAreaProvider, and call `useToast()` anywhere below.
 * For messages that must stay in view, use a Banner.
 */
export function ToastProvider({ children, limit = 3, offset = 0, dismissLabel = 'Dismiss' }: ToastProviderProps) {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);

  const show = useCallback((options: ToastOptions) => {
    nextId.current += 1;
    const id = `toast-${nextId.current}`;
    setToasts((list) => [
      ...list,
      { tone: 'neutral', duration: DEFAULT_DURATION, ...options, id, leaving: false },
    ]);
    return id;
  }, []);

  const hide = useCallback(
    (id: string) =>
      setToasts((list) => {
        const index = list.findIndex((toast) => toast.id === id);
        if (index === -1) return list;
        // A toast still waiting in the queue has nothing to animate.
        if (index >= limit) return list.filter((toast) => toast.id !== id);
        return list.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast));
      }),
    [limit],
  );

  const remove = useCallback(
    (id: string) => setToasts((list) => list.filter((toast) => toast.id !== id)),
    [],
  );

  const api = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <ToastContext.Provider value={api}>
      <View style={styles.fill}>
        {children}
        <View
          aria-live={Platform.OS === 'web' ? 'polite' : undefined}
          style={[styles.region, { bottom: insets.bottom + offset + theme.space.lg }]}
        >
          {toasts.slice(0, limit).map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onHide={hide}
              onHidden={remove}
              dismissLabel={dismissLabel}
            />
          ))}
        </View>
      </View>
    </ToastContext.Provider>
  );
}

/** Shows and hides toasts. Must be called inside a `ToastProvider`. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) {
    throw new Error('useToast must be used inside a <ToastProvider>. Wrap your app root in one.');
  }
  return api;
}

interface ToastItemProps {
  toast: ToastRecord;
  onHide: (id: string) => void;
  onHidden: (id: string) => void;
  dismissLabel: string;
}

function ToastItem({ toast, onHide, onHidden, dismissLabel }: ToastItemProps) {
  const theme = useTheme();
  const styles = useStyles();
  const reducedMotion = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));
  const { id, message, tone, icon, duration, action, leaving } = toast;
  // Toasts sit on the inverse surface, so their accents come from the opposite scheme.
  const onInverse = (theme.colorScheme === 'dark' ? lightTheme : darkTheme).colors;
  const sticky = duration <= 0;
  const slop = (theme.sizes.touchTarget - theme.sizes.control.sm) / 2;

  useEffect(() => {
    // Native announces each new message once; web reads the region's aria-live instead.
    if (Platform.OS !== 'web') AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  useEffect(() => {
    const curve = leaving ? theme.easing.exit : theme.easing.enter;
    const animation = Animated.timing(progress, {
      toValue: leaving ? 0 : 1,
      duration: leaving ? theme.duration.fast : theme.duration.normal,
      easing: Easing.bezier(curve[0], curve[1], curve[2], curve[3]),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished && leaving) onHidden(id);
    });
    return () => animation.stop();
  }, [leaving, id, onHidden, progress, theme]);

  useEffect(() => {
    if (sticky || leaving) return;
    const timer = setTimeout(() => onHide(id), duration);
    return () => clearTimeout(timer);
  }, [sticky, leaving, duration, id, onHide]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [theme.space.lg, 0] });

  return (
    <Animated.View
      style={[
        styles.toast,
        { opacity: progress, transform: reducedMotion ? [] : [{ translateY }] },
      ]}
    >
      <Icon name={icon ?? toneIcon[tone]} color={onInverse.tone[tone].onSubtle} />
      <Text variant="bodySm" color="inverse" style={styles.message}>
        {message}
      </Text>
      {action ? (
        <Pressable
          role="button"
          aria-label={action.label}
          hitSlop={slop}
          onPress={() => {
            action.onPress();
            onHide(id);
          }}
          style={({ pressed }) => [
            styles.button,
            pressed && { backgroundColor: onInverse.action.tertiary.bgPressed },
          ]}
        >
          <Text variant="labelSm" style={{ color: onInverse.action.tertiary.fg }} numberOfLines={1}>
            {action.label}
          </Text>
        </Pressable>
      ) : null}
      {sticky ? (
        <Pressable
          role="button"
          aria-label={dismissLabel}
          hitSlop={slop}
          onPress={() => onHide(id)}
          style={({ pressed }) => [
            styles.button,
            styles.close,
            pressed && { backgroundColor: onInverse.action.tertiary.bgPressed },
          ]}
        >
          <Icon name="close" color={theme.colors.text.inverse} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const useStyles = makeStyles((t) => ({
  fill: {
    flex: 1,
  },
  region: {
    position: 'absolute',
    pointerEvents: 'box-none',
    start: 0,
    end: 0,
    alignItems: 'center',
    gap: t.space.sm,
    paddingHorizontal: t.space.lg,
    zIndex: t.zIndex.toast,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.md,
    width: '100%',
    maxWidth: t.breakpoints.medium,
    minHeight: t.sizes.control.lg,
    paddingStart: t.space.lg,
    paddingEnd: t.space.sm,
    paddingVertical: t.space.sm,
    borderRadius: t.radii.lg,
    backgroundColor: t.colors.bg.inverse,
    boxShadow: t.shadows.lg,
  },
  message: {
    flex: 1,
    paddingVertical: t.space.xs,
  },
  button: {
    minHeight: t.sizes.control.sm,
    justifyContent: 'center',
    paddingHorizontal: t.space.sm,
    borderRadius: t.radii.sm,
  },
  close: {
    width: t.sizes.control.sm,
    alignItems: 'center',
    paddingHorizontal: 0,
  },
}));
