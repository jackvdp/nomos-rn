import {
  Button,
  fonts,
  Screen,
  Stack,
  Text,
  ThemeProvider,
  ToastProvider,
  useToast,
} from '@nomos/ui';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from './src/auth/useAuth';
import { SignedOut } from './src/SignedOut';

export default function App() {
  const { session } = useAuth();
  const [fontsLoaded, fontsError] = useFonts(fonts);
  // Whether the onboarding pages have been seen. Like the session, this is
  // held in memory only for now, so they show again each time the app starts.
  const [onboarded, setOnboarded] = useState(false);

  // Text drawn before its font is ready would show in the wrong typeface. If
  // loading fails, carry on with the platform's own font.
  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          {/* The app's default. It comes first so that a screen can mount its own over it. */}
          <StatusBar style="auto" />
          {session ? (
            <Home />
          ) : (
            <SignedOut onboarded={onboarded} onOnboarded={() => setOnboarded(true)} />
          )}
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Placeholder until navigation and the first real screens land.
function Home() {
  const toast = useToast();
  const { signOut } = useAuth();
  return (
    <Screen>
      <Stack gap="md">
        <Text variant="headingLg">NOMOS</Text>
        <Text color="secondary">This app renders with @nomos/ui.</Text>
        <Button
          label="Show a toast"
          onPress={() => toast.show({ message: 'Design library connected', tone: 'success' })}
        />
        <Button label="Sign out" variant="secondary" onPress={signOut} />
      </Stack>
    </Screen>
  );
}
