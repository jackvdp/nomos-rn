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
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from './src/auth/useAuth';
import { SignedOut } from './src/SignedOut';

// The splash screen would otherwise go as soon as the app starts, leaving a
// blank screen until the fonts are in.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { session } = useAuth();
  const [fontsLoaded, fontsError] = useFonts(fonts);
  // Whether the onboarding pages have been seen. Like the session, this is
  // held in memory only for now, so they show again each time the app starts.
  const [onboarded, setOnboarded] = useState(false);
  // Whether the first screen has yet to take over from the splash screen.
  const [launching, setLaunching] = useState(true);
  // Text drawn before its font is ready would show in the wrong typeface. If
  // loading fails, carry on with the platform's own font.
  const ready = fontsLoaded || fontsError !== null;
  // The onboarding pages take the splash screen down themselves, and move
  // into place from a copy of it. Any other first screen just replaces it.
  const fromSplash = launching && !session && !onboarded;

  useEffect(() => {
    if (ready && launching && !fromSplash) {
      SplashScreen.hide();
      setLaunching(false);
    }
  }, [ready, launching, fromSplash]);

  if (!ready) {
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
            <SignedOut
              onboarded={onboarded}
              onOnboarded={() => setOnboarded(true)}
              fromSplash={fromSplash}
              onArrived={() => setLaunching(false)}
            />
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
