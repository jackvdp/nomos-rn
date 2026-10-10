import { makeStyles, Screen } from '@nomos/ui';
import { useState } from 'react';

import { CodeForm } from './CodeForm';
import { CredentialsForm } from './CredentialsForm';
import type { Session } from './login';

export interface LoginScreenProps {
  onSignedIn: (session: Session) => void;
}

export function LoginScreen({ onSignedIn }: LoginScreenProps) {
  const styles = useStyles();
  // Set once the password has been accepted and a one-time code emailed to this address.
  const [codeSentTo, setCodeSentTo] = useState<string>();

  return (
    <Screen scroll contentStyle={styles.content}>
      {codeSentTo ? (
        <CodeForm
          email={codeSentTo}
          onSignedIn={onSignedIn}
          onBack={() => setCodeSentTo(undefined)}
        />
      ) : (
        <CredentialsForm onSignedIn={onSignedIn} onNeedsCode={setCodeSentTo} />
      )}
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  content: {
    justifyContent: 'center',
  },
}));
