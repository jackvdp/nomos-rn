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
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LoginScreen } from './src/auth/LoginScreen';
import { useAuth } from './src/auth/useAuth';
import { OnboardingScreen } from './src/onboarding/OnboardingScreen';

// The splash screen would otherwise go as soon as the app starts, leaving a
// blank screen until the fonts are in.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { session } = useAuth();
  const [fontsLoaded, fontsError] = useFonts(fonts);
  // Whether the onboarding pages have been seen. Like the session, this is
  // held in memory only for now, so they show again each time the app starts.
  const [onboarded, setOnboarded] = useState(false);
  // Text drawn before its font is ready would show in the wrong typeface. If
  // loading fails, carry on with the platform's own font.
  const ready = fontsLoaded || fontsError !== null;

  useEffect(() => {
    if (ready) {
      SplashScreen.hide();
    }
  }, [ready]);

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
            <SignedOut onboarded={onboarded} onOnboarded={() => setOnboarded(true)} />
          )}
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

interface SignedOutProps {
  /** The onboarding pages have been seen, so the sign-in screen is the one to start on. */
  onboarded: boolean;
  onOnboarded: () => void;
}

/**
 * What a signed-out user sees: the onboarding pages, then the sign-in screen,
 * which is revealed from under them and can be left for them again.
 */
function SignedOut({ onboarded, onOnboarded }: SignedOutProps) {
  // The screen the user is on, or on the way to.
  const [screen, setScreen] = useState<'onboarding' | 'signIn'>(
    onboarded ? 'signIn' : 'onboarding',
  );
  // The sign-in screen sits under the onboarding pages, from when it is asked
  // for until they have covered it again.
  const [signInMounted, setSignInMounted] = useState(onboarded);
  const onSignIn = screen === 'signIn';

  return (
    <View style={styles.fill}>
      {signInMounted && <LoginScreen onBack={() => setScreen('onboarding')} />}
      <View
        aria-hidden={onSignIn}
        style={[StyleSheet.absoluteFill, onSignIn && styles.untouchable]}
      >
        <OnboardingScreen
          hidden={onSignIn}
          onSignIn={() => {
            setSignInMounted(true);
            setScreen('signIn');
          }}
          onHidden={onOnboarded}
          onShown={() => setSignInMounted(false)}
        />
      </View>
    </View>
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

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  // Lets touches through to the sign-in screen underneath.
  untouchable: {
    pointerEvents: 'none',
  },
});
