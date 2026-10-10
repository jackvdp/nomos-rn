import { Banner, Button, Dialog, Stack, Text, TextField } from '@nomos/ui';
import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import { failureMessage } from './failureMessage';
import { getOrganisation } from './session';
import { useAuth } from './useAuth';

// The organisation the form starts with, for a build made for just one.
const defaultOrganisation = process.env.EXPO_PUBLIC_TENANT_ORIGIN ?? '';

// The form's wording in one place, ready to move into translations.
const copy = {
  title: 'Sign in to NOMOS',
  intro: 'Enter your organisation, email address and password.',
  organisation: 'Organisation',
  organisationHelp: 'The first part of your NOMOS web address.',
  email: 'Email address',
  password: 'Password',
  submit: 'Sign in',
  organisationRequired: 'Enter your organisation.',
  organisationInvalid:
    'Enter the first part of your NOMOS web address, using only letters, numbers and hyphens.',
  organisationUnknown: 'We could not find an organisation with that name. Check it and try again.',
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
  organisation?: string;
  email?: string;
  password?: string;
}

export interface CredentialsFormProps {
  /** The password was right and a one-time code has been emailed to `email`. */
  onNeedsCode: (email: string) => void;
  /** An attempt was turned down: a field was missing or wrong, or sign-in failed. */
  onRejected?: () => void;
}

export function CredentialsForm({ onNeedsCode, onRejected }: CredentialsFormProps) {
  const auth = useAuth();
  const organisationRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  // Starts with the organisation last signed in to, if there was one.
  const [organisation, setOrganisation] = useState(
    () => getOrganisation()?.name ?? toOrganisationName(defaultOrganisation),
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failure, setFailure] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  // The account is in use elsewhere and the user is being asked whether to take over.
  const [confirming, setConfirming] = useState(false);
  const [elsewhere, setElsewhere] = useState<string>();

  async function submit(replaceOtherSession: boolean) {
    // The button blocks presses while loading, but the keyboard's Go key does not.
    if (submitting) return;

    const name = toOrganisationName(organisation);
    const address = email.trim();
    const found: FieldErrors = {
      organisation: !name
        ? copy.organisationRequired
        : !organisationPattern.test(name)
          ? copy.organisationInvalid
          : undefined,
      email: !address
        ? copy.emailRequired
        : !emailPattern.test(address)
          ? copy.emailInvalid
          : undefined,
      password: password ? undefined : copy.passwordRequired,
    };
    setErrors(found);
    setFailure(undefined);
    if (found.organisation || found.email || found.password) {
      // The first field that needs putting right.
      (found.organisation
        ? organisationRef
        : found.email
          ? emailRef
          : passwordRef
      ).current?.focus();
      onRejected?.();
      return;
    }

    setSubmitting(true);
    try {
      // On `signedIn` the session has started and the app moves on from this screen.
      const result = await auth.signIn(name, address, password, replaceOtherSession);
      if (result.status === 'unknownOrganisation') {
        setErrors({ organisation: copy.organisationUnknown });
        organisationRef.current?.focus();
        onRejected?.();
      } else if (result.status === 'needsCode') {
        onNeedsCode(address);
      } else if (result.status === 'activeElsewhere') {
        setElsewhere(result.where);
        setConfirming(true);
      }
    } catch (error) {
      setFailure(failureMessage(error, copy.failed));
      onRejected?.();
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
          ref={organisationRef}
          label={copy.organisation}
          value={organisation}
          onChangeText={(text) => {
            setOrganisation(text);
            setErrors((current) => ({ ...current, organisation: undefined }));
          }}
          // Shows the name as it will be sent.
          onBlur={() => setOrganisation(toOrganisationName)}
          helperText={copy.organisationHelp}
          errorText={errors.organisation}
          leadingIcon="building"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          autoComplete="off"
          textContentType="none"
          returnKeyType="next"
          // Keeps the keyboard open while focus moves to the email address.
          submitBehavior="submit"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <TextField
          ref={emailRef}
          label={copy.email}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((current) => ({ ...current, email: undefined }));
          }}
          errorText={errors.email}
          leadingIcon="mail"
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
          leadingIcon="lock"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={() => submit(false)}
        />
      </Stack>
      <Button label={copy.submit} fullWidth loading={submitting} onPress={() => submit(false)} />
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
              submit(true);
            },
          },
        ]}
      />
    </Stack>
  );
}

/** An organisation's name as the server knows it: in lower case, as it is in a web address. */
function toOrganisationName(text: string) {
  return text.trim().toLowerCase();
}

// A name is part of a web address, so these are all it can hold.
const organisationPattern = /^[a-z0-9-]+$/;
const emailPattern = /^\S+@\S+\.\S+$/;
