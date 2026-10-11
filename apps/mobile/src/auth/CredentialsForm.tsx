import { Banner, Button, Checkbox, Dialog, Stack, Text, TextField } from '@nomos/ui';
import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import { failureMessage } from '../api/failureMessage';
import { forgetLogin, getSavedLogin, saveLogin } from './savedLogin';
import { getOrganisation, hasSessionExpired } from './session';
import { useAuth } from './useAuth';

// The form's wording in one place, ready to move into translations.
const copy = {
  title: 'Sign in to NOMOS',
  intro: 'Enter your email address, password and organisation.',
  email: 'Email address',
  password: 'Password',
  organisation: 'Organisation',
  remember: 'Remember my details on this device',
  submit: 'Sign in',
  emailRequired: 'Enter your email address.',
  emailInvalid: 'Enter an email address in the format name@example.org.',
  passwordRequired: 'Enter your password.',
  organisationRequired: 'Enter your organisation.',
  organisationInvalid: 'Enter your organisation using only letters, numbers and hyphens.',
  organisationUnknown: 'We could not find an organisation with that name. Check it and try again.',
  failed: 'We could not sign you in. Check your connection and try again.',
  sessionEnded: 'Your session has ended. Sign in again to continue.',
  elsewhereTitle: 'Already signed in',
  elsewhere: (where?: string) =>
    `This account is already signed in ${where ? `from ${where}` : 'on another device'}. Continue here and sign out the other device?`,
  elsewhereConfirm: 'Continue here',
  elsewhereCancel: 'Cancel',
};

interface FieldErrors {
  email?: string;
  password?: string;
  organisation?: string;
}

export interface CredentialsFormProps {
  /** The password was right and a one-time code has been emailed to `email`. */
  onNeedsCode: (email: string) => void;
  /** An attempt was turned down: a field was missing or wrong, or sign-in failed. */
  onRejected?: () => void;
}

export function CredentialsForm({ onNeedsCode, onRejected }: CredentialsFormProps) {
  const auth = useAuth();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const organisationRef = useRef<TextInput>(null);
  // The form starts with the details last signed in with, if they were saved.
  const [saved] = useState(getSavedLogin);
  const [email, setEmail] = useState(saved?.email ?? '');
  const [password, setPassword] = useState(saved?.password ?? '');
  // Without saved details, the organisation last tried is still worth having.
  const [organisation, setOrganisation] = useState(
    () => saved?.organisation ?? getOrganisation() ?? '',
  );
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failure, setFailure] = useState<string>();
  // The user is here because the server ended their session. Said until they try to sign in.
  const [sessionEnded, setSessionEnded] = useState(hasSessionExpired);
  const [submitting, setSubmitting] = useState(false);
  // The account is in use elsewhere and the user is being asked whether to take over.
  const [confirming, setConfirming] = useState(false);
  const [elsewhere, setElsewhere] = useState<string>();

  async function submit(replaceOtherSession: boolean) {
    // The button blocks presses while loading, but the keyboard's Go key does not.
    if (submitting) return;

    const address = email.trim();
    const name = toOrganisationName(organisation);
    const found: FieldErrors = {
      email: !address
        ? copy.emailRequired
        : !emailPattern.test(address)
          ? copy.emailInvalid
          : undefined,
      password: password ? undefined : copy.passwordRequired,
      organisation: !name
        ? copy.organisationRequired
        : !organisationPattern.test(name)
          ? copy.organisationInvalid
          : undefined,
    };
    setErrors(found);
    setFailure(undefined);
    setSessionEnded(false);
    if (found.email || found.password || found.organisation) {
      // The first field that needs putting right.
      (found.email ? emailRef : found.password ? passwordRef : organisationRef).current?.focus();
      onRejected?.();
      return;
    }

    setSubmitting(true);
    try {
      // On `signedIn` the session has started and the app moves on from this screen.
      const result = await auth.signIn(name, address, password, replaceOtherSession);
      // Either way the server has accepted the password, so the details are
      // right. Signing in does not wait for them to be saved or forgotten.
      if (result.status === 'signedIn' || result.status === 'needsCode') {
        if (remember) {
          saveLogin({ organisation: name, email: address, password });
        } else {
          forgetLogin();
        }
      }
      if (result.status === 'unknownOrganisation') {
        // The field is not given focus: it is the last one, so the keyboard
        // would come up over the message.
        setErrors({ organisation: copy.organisationUnknown });
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
      {sessionEnded ? <Banner tone="warning" message={copy.sessionEnded} /> : null}
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
          returnKeyType="next"
          // Keeps the keyboard open while focus moves to the organisation.
          submitBehavior="submit"
          onSubmitEditing={() => organisationRef.current?.focus()}
        />
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
          errorText={errors.organisation}
          leadingIcon="building"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          autoComplete="off"
          textContentType="none"
          returnKeyType="go"
          onSubmitEditing={() => submit(false)}
        />
        <Checkbox label={copy.remember} checked={remember} onChange={setRemember} />
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
