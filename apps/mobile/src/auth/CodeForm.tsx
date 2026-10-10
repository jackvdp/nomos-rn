import { Banner, Button, Stack, Text, TextField } from '@nomos/ui';
import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import { resendCode } from './authApi';
import { failureMessage } from './failureMessage';
import { useAuth } from './useAuth';

// The form's wording in one place, ready to move into translations.
const copy = {
  title: 'Check your email',
  intro: (email: string) => `Enter the one-time code we sent to ${email}.`,
  code: 'One-time code',
  codeRequired: 'Enter the code from the email.',
  submit: 'Verify',
  resend: 'Send a new code',
  resent: 'A new code is on its way.',
  back: 'Use a different account',
  failed: 'We could not check the code. Check your connection and try again.',
  resendFailed: 'We could not send a new code. Check your connection and try again.',
};

interface Notice {
  tone: 'danger' | 'success';
  message: string;
}

export interface CodeFormProps {
  /** The address the code was sent to. */
  email: string;
  /** Go back to the email and password. */
  onBack: () => void;
}

export function CodeForm({ email, onBack }: CodeFormProps) {
  const auth = useAuth();
  const codeRef = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string>();
  const [notice, setNotice] = useState<Notice>();
  const [busy, setBusy] = useState<'verifying' | 'resending'>();

  async function verify() {
    if (busy) return;
    const entered = code.trim();
    setNotice(undefined);
    if (!entered) {
      setCodeError(copy.codeRequired);
      codeRef.current?.focus();
      return;
    }

    setBusy('verifying');
    try {
      // Once this succeeds the session has started and the app moves on from this screen.
      await auth.verifyCode(email, entered);
    } catch (error) {
      setNotice({ tone: 'danger', message: failureMessage(error, copy.failed) });
    } finally {
      setBusy(undefined);
    }
  }

  async function resend() {
    if (busy) return;
    setNotice(undefined);
    setBusy('resending');
    try {
      await resendCode(email);
      setNotice({ tone: 'success', message: copy.resent });
    } catch (error) {
      setNotice({ tone: 'danger', message: failureMessage(error, copy.resendFailed) });
    } finally {
      setBusy(undefined);
    }
  }

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="headingLg">{copy.title}</Text>
        <Text color="secondary">{copy.intro(email)}</Text>
      </Stack>
      {notice ? <Banner tone={notice.tone} message={notice.message} /> : null}
      <TextField
        ref={codeRef}
        label={copy.code}
        value={code}
        onChangeText={(text) => {
          setCode(text);
          setCodeError(undefined);
        }}
        errorText={codeError}
        autoFocus
        inputMode="numeric"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        returnKeyType="done"
        onSubmitEditing={verify}
      />
      <Stack gap="sm">
        <Button
          label={copy.submit}
          fullWidth
          loading={busy === 'verifying'}
          disabled={busy === 'resending'}
          onPress={verify}
        />
        <Button
          label={copy.resend}
          variant="secondary"
          fullWidth
          loading={busy === 'resending'}
          disabled={busy === 'verifying'}
          onPress={resend}
        />
        <Button
          label={copy.back}
          variant="tertiary"
          fullWidth
          disabled={busy !== undefined}
          onPress={onBack}
        />
      </Stack>
    </Stack>
  );
}
