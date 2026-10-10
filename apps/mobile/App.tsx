import { Button, Screen, Stack, Text, ThemeProvider, ToastProvider, useToast } from '@nomos/ui';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LoginScreen } from './src/auth/LoginScreen';
import { useAuth } from './src/auth/useAuth';

export default function App() {
  const { session } = useAuth();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          {/* The app's default. It comes first so that a screen can mount its own over it. */}
          <StatusBar style="auto" />
          {session ? <Home /> : <LoginScreen />}
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
