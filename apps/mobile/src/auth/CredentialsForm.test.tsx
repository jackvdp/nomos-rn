import { ThemeProvider } from '@nomos/ui';
import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ApiError } from '../api/client';
import * as authApi from './authApi';
import { CredentialsForm } from './CredentialsForm';
import { forgetLogin, getSavedLogin, saveLogin } from './savedLogin';
import { setOrganisation, setSession } from './session';

// The server is the only thing left out: the form, `useAuth`, the session and
// the saved details are the real ones, over the in-memory secure store.
jest.mock('./authApi');
const login = jest.mocked(authApi.login);

const details = { organisation: 'northshire', email: 'amara@northshire.gov', password: 'hunter2' };
const session = { accessToken: 'access', refreshToken: 'refresh', deviceId: 'device' };

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function renderForm(onNeedsCode = jest.fn()) {
  return render(
    <SafeAreaProvider initialMetrics={safeAreaMetrics}>
      <ThemeProvider colorScheme="light">
        <CredentialsForm onNeedsCode={onNeedsCode} />
      </ThemeProvider>
    </SafeAreaProvider>,
  );
}

async function fillIn({ organisation, email, password }: typeof details) {
  await userEvent.type(screen.getByLabelText('Email address'), email);
  await userEvent.type(screen.getByLabelText('Password'), password);
  await userEvent.type(screen.getByLabelText('Organisation'), organisation);
}

function signIn() {
  return userEvent.press(screen.getByRole('button', { name: 'Sign in' }));
}

describe('CredentialsForm', () => {
  // The session and the organisation outlive a test, as they do a screen.
  beforeEach(async () => {
    setSession(null);
    setOrganisation('');
    await forgetLogin();
    login.mockReset();
  });

  test('starts empty when no details are saved', async () => {
    await renderForm();
    expect(screen.getByLabelText('Email address')).toHaveDisplayValue('');
    expect(screen.getByLabelText('Password')).toHaveDisplayValue('');
    expect(screen.getByLabelText('Organisation')).toHaveDisplayValue('');
  });

  test('starts with the details saved at the last sign-in', async () => {
    await saveLogin(details);
    await renderForm();
    expect(screen.getByLabelText('Email address')).toHaveDisplayValue(details.email);
    expect(screen.getByLabelText('Password')).toHaveDisplayValue(details.password);
    expect(screen.getByLabelText('Organisation')).toHaveDisplayValue(details.organisation);
  });

  test('signs in with the saved details as they stand', async () => {
    await saveLogin(details);
    login.mockResolvedValue({ status: 'signedIn', session });
    await renderForm();

    await signIn();
    await waitFor(() => expect(login).toHaveBeenCalledWith(details.email, details.password, false));
  });

  test('saves the details when they sign the user in', async () => {
    login.mockResolvedValue({ status: 'signedIn', session });
    await renderForm();
    await fillIn(details);

    await signIn();
    await waitFor(() => expect(getSavedLogin()).toEqual(details));
  });

  test('saves the details when the password is accepted and a code is asked for', async () => {
    const onNeedsCode = jest.fn();
    login.mockResolvedValue({ status: 'needsCode' });
    await renderForm(onNeedsCode);
    await fillIn(details);

    await signIn();
    await waitFor(() => expect(onNeedsCode).toHaveBeenCalledWith(details.email));
    expect(getSavedLogin()).toEqual(details);
  });

  test('forgets the saved details when asked not to remember them', async () => {
    await saveLogin(details);
    login.mockResolvedValue({ status: 'signedIn', session });
    await renderForm();
    const remember = screen.getByRole('checkbox', { name: 'Remember my details on this device' });
    expect(remember).toBeChecked();

    await userEvent.press(remember);
    await signIn();
    await waitFor(() => expect(login).toHaveBeenCalled());
    await waitFor(() => expect(getSavedLogin()).toBeNull());
  });

  test('saves nothing when sign-in is refused', async () => {
    login.mockRejectedValue(new ApiError('Invalid credentials', 401));
    await renderForm();
    await fillIn(details);

    await signIn();
    expect(await screen.findByText('Invalid credentials')).toBeOnTheScreen();
    expect(getSavedLogin()).toBeNull();
  });

  test('leaves the saved details alone when different ones are refused', async () => {
    await saveLogin(details);
    login.mockRejectedValue(new ApiError('Invalid credentials', 401));
    await renderForm();
    await userEvent.type(screen.getByLabelText('Password'), 'x');

    await signIn();
    expect(await screen.findByText('Invalid credentials')).toBeOnTheScreen();
    expect(getSavedLogin()).toEqual(details);
  });
});
