import { Banner, Button, Dialog, Stack, Text, TextField } from '@nomos/ui';
import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import { failureMessage } from './failureMessage';
import { login, type Session } from './login';

// The form's wording in one place, ready to move into translations.
const copy = {
  title: 'Sign in to NOMOS',
  intro: 'Enter the email address and password for your NOMOS account.',
  email: 'Email address',
  password: 'Password',
  submit: 'Sign in',
  emailRequired: 'Enter your email address.',
  emailInvalid: 'Enter an email address in the format name@example.org.',
  passwordRequired: 'Enter your password.',
  failed: 'We could not sign you in. Check your connection and try again.',
  elsewhereTitle: 'Already signed in',
  elsewhere: (where?: string) =>
    `This account is already signed in ${where ? `from ${where}` : 'on another device'}. Continue here and sign out the other device?`,
  elsewhereConfirm: 'Continue here',
  elsewhereCancel: 'Cancel',
};

interface FieldErrors {
  email?: string;
  password?: string;
}

export interface CredentialsFormProps {
  onSignedIn: (session: Session) => void;
  /** The password was right and a one-time code has been emailed to `email`. */
  onNeedsCode: (email: string) => void;
}

export function CredentialsForm({ onSignedIn, onNeedsCode }: CredentialsFormProps) {
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failure, setFailure] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  // The account is in use elsewhere and the user is being asked whether to take over.
  const [confirming, setConfirming] = useState(false);
  const [elsewhere, setElsewhere] = useState<string>();

  async function signIn(replaceOtherSession: boolean) {
    // The button blocks presses while loading, but the keyboard's Go key does not.
    if (submitting) return;

    const address = email.trim();
    const found: FieldErrors = {
      email: !address
        ? copy.emailRequired
        : !emailPattern.test(address)
          ? copy.emailInvalid
          : undefined,
      password: password ? undefined : copy.passwordRequired,
    };
    setErrors(found);
    setFailure(undefined);
    if (found.email || found.password) {
      (found.email ? emailRef : passwordRef).current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const result = await login(address, password, replaceOtherSession);
      if (result.status === 'signedIn') {
        onSignedIn(result.session);
      } else if (result.status === 'needsCode') {
        onNeedsCode(address);
      } else {
        setElsewhere(result.where);
        setConfirming(true);
      }
    } catch (error) {
      setFailure(failureMessage(error, copy.failed));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="headingLg">{copy.title}</Text>
        <Text color="secondary">{copy.intro}</Text>
      </Stack>
      {failure ? <Banner tone="danger" message={failure} /> : null}
      <Stack gap="lg">
        <TextField
          ref={emailRef}
          label={copy.email}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((current) => ({ ...current, email: undefined }));
          }}
          errorText={errors.email}
          inputMode="email"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="username"
          returnKeyType="next"
          // Keeps the keyboard open while focus moves to the password.
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          ref={passwordRef}
          label={copy.password}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors((current) => ({ ...current, password: undefined }));
          }}
          errorText={errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={() => signIn(false)}
        />
      </Stack>
      <Button label={copy.submit} fullWidth loading={submitting} onPress={() => signIn(false)} />
      <Dialog
        visible={confirming}
        onDismiss={() => setConfirming(false)}
        title={copy.elsewhereTitle}
        message={copy.elsewhere(elsewhere)}
        actions={[
          { label: copy.elsewhereCancel, onPress: () => setConfirming(false) },
          {
            label: copy.elsewhereConfirm,
            onPress: () => {
              setConfirming(false);
              signIn(true);
            },
          },
        ]}
      />
    </Stack>
  );
}

const emailPattern = /^\S+@\S+\.\S+$/;
