import { Button, Screen, Stack, Text, ThemeProvider, ToastProvider, useToast } from '@nomos/ui';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LoginScreen } from './src/auth/LoginScreen';
import type { Session } from './src/auth/login';

export default function App() {
  // Held in memory only for now, so reloading the app signs you out.
  const [session, setSession] = useState<Session | null>(null);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          {session ? <Home /> : <LoginScreen onSignedIn={setSession} />}
          <StatusBar style="auto" />
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Placeholder until navigation and the first real screens land.
function Home() {
  const toast = useToast();
  return (
    <Screen>
      <Stack gap="md">
        <Text variant="headingLg">NOMOS</Text>
        <Text color="secondary">This app renders with @nomos/ui.</Text>
        <Button
          label="Show a toast"
          onPress={() => toast.show({ message: 'Design library connected', tone: 'success' })}
        />
      </Stack>
    </Screen>
  );
}
