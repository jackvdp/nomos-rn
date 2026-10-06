import { StyleSheet } from 'react-native';

import type { Theme } from './theme';
import { useTheme } from './ThemeProvider';

/**
 * Defines theme-aware styles once, outside the component:
 *
 *   const useStyles = makeStyles((t) => ({
 *     card: { backgroundColor: t.colors.bg.surface, padding: t.space.lg },
 *   }));
 *
 *   function Card() {
 *     const styles = useStyles();
 *     ...
 *   }
 *
 * The StyleSheet is built once per theme and shared by every instance, so
 * switching light/dark costs one rebuild rather than one per render.
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(factory: (theme: Theme) => T) {
  const cache = new WeakMap<Theme, T>();
  return function useStyles(): T {
    const theme = useTheme();
    let styles = cache.get(theme);
    if (!styles) {
      styles = StyleSheet.create(factory(theme));
      cache.set(theme, styles);
    }
    return styles;
  };
}
