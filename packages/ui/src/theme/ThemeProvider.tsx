import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type Theme } from './theme';

export type ColorSchemePreference = 'light' | 'dark' | 'system';

const ThemeContext = createContext<Theme | null>(null);

export interface ThemeProviderProps {
  /**
   * `system` (the default) follows the device setting. Pass `light` or `dark`
   * to force one, e.g. from a user preference the app stores.
   */
  colorScheme?: ColorSchemePreference;
  children: ReactNode;
}

export function ThemeProvider({ colorScheme = 'system', children }: ThemeProviderProps) {
  const system = useColorScheme();
  const resolved = colorScheme === 'system' ? (system === 'dark' ? 'dark' : 'light') : colorScheme;
  return (
    <ThemeContext.Provider value={resolved === 'dark' ? darkTheme : lightTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used inside a <ThemeProvider>. Wrap your app root in one.');
  }
  return theme;
}
