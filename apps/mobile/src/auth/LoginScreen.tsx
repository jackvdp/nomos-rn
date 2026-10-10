import { makeStyles, Screen, Stack, ThemeProvider } from '@nomos/ui';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image } from 'react-native';

import { CodeForm } from './CodeForm';
import { CredentialsForm } from './CredentialsForm';
import type { Session } from './login';

// nomos-logo.png with its wordmark turned white. The original wordmark is
// dark navy, which does not show on this screen's navy background.
const logo = require('../../assets/nomos-logo-on-dark.png');
const logoAspectRatio = 1888 / 427;
const logoLabel = 'NOMOS';

export interface LoginScreenProps {
  onSignedIn: (session: Session) => void;
}

/**
 * Sign-in sits on the brand navy whatever the device's light or dark setting,
 * so everything on it uses the dark colours.
 */
export function LoginScreen(props: LoginScreenProps) {
  return (
    <ThemeProvider colorScheme="dark">
      <StatusBar style="light" />
      <LoginSteps {...props} />
    </ThemeProvider>
  );
}

function LoginSteps({ onSignedIn }: LoginScreenProps) {
  const styles = useStyles();
  // Set once the password has been accepted and a one-time code emailed to this address.
  const [codeSentTo, setCodeSentTo] = useState<string>();

  return (
    <Screen scroll style={styles.screen} contentStyle={styles.content}>
      <Stack gap="xl">
        <Image
          source={logo}
          accessible
          aria-label={logoLabel}
          resizeMode="contain"
          style={styles.logo}
        />
        {codeSentTo ? (
          <CodeForm
            email={codeSentTo}
            onSignedIn={onSignedIn}
            onBack={() => setCodeSentTo(undefined)}
          />
        ) : (
          <CredentialsForm onSignedIn={onSignedIn} onNeedsCode={setCodeSentTo} />
        )}
      </Stack>
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  screen: {
    backgroundColor: t.colors.bg.brand,
  },
  content: {
    justifyContent: 'center',
  },
  logo: {
    height: t.space.xxxl,
    width: t.space.xxxl * logoAspectRatio,
  },
}));
