import { ThemeProvider } from '@nomos/ui';
import { render, screen, userEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as authApi from './authApi';
import { LoginScreen } from './LoginScreen';

jest.mock('./authApi');

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function renderScreen(colorScheme: 'light' | 'dark' = 'light') {
  return render(
    <SafeAreaProvider initialMetrics={safeAreaMetrics}>
      <ThemeProvider colorScheme={colorScheme}>
        <LoginScreen />
      </ThemeProvider>
    </SafeAreaProvider>,
  );
}

async function signIn() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Email address'), 'amara@example.org');
  await user.type(screen.getByLabelText('Password'), 'correct horse battery');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));
}

// Each snapshot records the whole rendered screen, styles included, so an
// unintended change to its structure or look fails the test with a diff.
// After an intended change, check the diff and update the snapshots with
// `npm test -w @nomos/mobile -- -u`.
describe('LoginScreen', () => {
  test('sign-in form in light mode', async () => {
    await renderScreen('light');
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('sign-in form in dark mode', async () => {
    await renderScreen('dark');
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('sign-in form with nothing filled in', async () => {
    await renderScreen();
    await userEvent.setup().press(screen.getByRole('button', { name: 'Sign in' }));
    await screen.findByText('Enter your email address.');
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('sign-in form after the server refuses', async () => {
    jest.mocked(authApi.login).mockRejectedValue(new Error('offline'));
    await renderScreen();
    await signIn();
    await screen.findByText('We could not sign you in. Check your connection and try again.');
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('one-time code step', async () => {
    jest.mocked(authApi.login).mockResolvedValue({ status: 'needsCode' });
    await renderScreen();
    await signIn();
    await screen.findByText('Check your email');
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
