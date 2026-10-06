import { ThemeProvider, useTheme, type ColorSchemePreference } from '@nomos/ui';
import type { Decorator } from '@storybook/react-native';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

function Canvas({ children, fullscreen }: { children: ReactNode; fullscreen: boolean }) {
  const theme = useTheme();
  if (fullscreen) {
    return <View style={[styles.fill, { backgroundColor: theme.colors.bg.canvas }]}>{children}</View>;
  }
  return (
    <ScrollView
      style={[styles.fill, { backgroundColor: theme.colors.bg.canvas }]}
      contentContainerStyle={{ padding: theme.space.lg }}
    >
      {children}
    </ScrollView>
  );
}

/**
 * Wraps every story in the NOMOS ThemeProvider on the app's canvas colour.
 * The colour scheme comes from the web toolbar global `theme`, a story's
 * `parameters.colorScheme`, or else the device setting.
 *
 * Stories are padded and scrollable unless they set
 * `parameters.fullscreen: true` (screens, overlays).
 */
export const withNomosTheme: Decorator = (Story, context) => {
  const scheme: ColorSchemePreference =
    context.globals?.theme ?? context.parameters?.colorScheme ?? 'system';
  return (
    <ThemeProvider colorScheme={scheme}>
      <Canvas fullscreen={context.parameters?.fullscreen === true}>
        <Story />
      </Canvas>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
