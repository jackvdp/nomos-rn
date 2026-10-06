import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, type View } from 'react-native';

import { useTheme } from '../../theme';

/**
 * Drives an overlay's enter and exit. `progress` animates 0 → 1 when
 * `visible` turns on and back to 0 when it turns off (native driver);
 * `rendered` stays true until the exit finishes, so the Modal unmounts only
 * once it is out of sight.
 */
export function useOverlayTransition(visible: boolean) {
  const theme = useTheme();
  const [progress] = useState(() => new Animated.Value(0));
  const [rendered, setRendered] = useState(visible);
  if (visible && !rendered) setRendered(true);

  useEffect(() => {
    if (!rendered) return;
    const curve = visible ? theme.easing.enter : theme.easing.exit;
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? theme.duration.normal : theme.duration.fast,
      easing: Easing.bezier(curve[0], curve[1], curve[2], curve[3]),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished && !visible) setRendered(false);
    });
    return () => animation.stop();
  }, [visible, rendered, progress, theme]);

  return { rendered, progress };
}

/** Moves the screen reader cursor to `target`, e.g. an overlay's title once it opens. */
export function focusForAccessibility(target: View | null) {
  // Web's Modal traps focus itself and has no accessibility events.
  if (target && Platform.OS !== 'web') {
    AccessibilityInfo.sendAccessibilityEvent(target, 'focus');
  }
}
