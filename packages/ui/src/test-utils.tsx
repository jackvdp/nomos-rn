import { render, type RenderOptions } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './theme';

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

export function Providers({
  children,
  colorScheme = 'light',
}: {
  children: ReactNode;
  colorScheme?: 'light' | 'dark';
}) {
  return (
    <SafeAreaProvider initialMetrics={safeAreaMetrics}>
      <ThemeProvider colorScheme={colorScheme}>{children}</ThemeProvider>
    </SafeAreaProvider>
  );
}

/** Renders inside the theme and safe-area providers every component expects. */
export async function renderWithTheme(
  ui: ReactElement,
  { colorScheme = 'light', ...options }: RenderOptions & { colorScheme?: 'light' | 'dark' } = {},
) {
  return render(ui, {
    wrapper: ({ children }) => <Providers colorScheme={colorScheme}>{children}</Providers>,
    ...options,
  });
}

export * from '@testing-library/react-native';
