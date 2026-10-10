import { useEffect } from 'react';
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../theme';
import { useReducedMotion } from './useReducedMotion';

/**
 * Press feedback for a control. Pass `onPressIn` and `onPressOut` to its
 * Pressable. While the control is held it shrinks a little and a pressed
 * colour fades in, and both ease back when it is let go: put `scaleStyle` on
 * the control and `pressedStyle` on a layer in the pressed colour. Both go on
 * Reanimated's animated components. With reduced motion the colour changes at
 * once and nothing changes size.
 *
 * `disabled` returns it to rest, for a control that is disabled while held.
 */
export function usePressFeedback(disabled = false) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  // 0 at rest, 1 while held.
  const progress = useSharedValue(0);
  const pressedScale = reducedMotion ? 1 : theme.scale.pressed;
  const [x1, y1, x2, y2] = theme.easing.standard;

  function animateTo(toValue: 0 | 1) {
    const duration = toValue ? theme.duration.fast : theme.duration.normal;
    progress.value = withTiming(toValue, {
      duration: reducedMotion ? 0 : duration,
      easing: Easing.bezier(x1, y1, x2, y2),
    });
  }

  useEffect(() => {
    if (disabled) progress.value = 0;
  }, [disabled, progress]);

  // The dependency lists are for the web, where Reanimated can run without
  // its Babel plugin and so cannot work them out.
  const scaleStyle = useAnimatedStyle(
    () => ({ transform: [{ scale: interpolate(progress.value, [0, 1], [1, pressedScale]) }] }),
    [progress, pressedScale],
  );
  const pressedStyle = useAnimatedStyle(() => ({ opacity: progress.value }), [progress]);

  return {
    scaleStyle,
    pressedStyle,
    onPressIn: () => animateTo(1),
    onPressOut: () => animateTo(0),
  };
}
