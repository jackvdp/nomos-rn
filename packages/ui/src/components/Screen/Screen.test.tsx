import { renderWithTheme, screen } from '../../test-utils';
import { lightTheme } from '../../theme';
import { Button } from '../Button';
import { Text } from '../Text';
import { Screen } from './Screen';

// test-utils renders inside a SafeAreaProvider with these insets.
const insets = { top: 47, bottom: 34 };
const { space } = lightTheme;

describe('Screen', () => {
  test('renders children, header and footer', async () => {
    await renderWithTheme(
      <Screen
        scroll
        header={<Text variant="headingSm">Profile</Text>}
        footer={<Button label="Share credential" />}
      >
        <Text>Amara Okafor</Text>
      </Screen>,
    );
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeOnTheScreen();
    expect(screen.getByText('Amara Okafor')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Share credential' })).toBeOnTheScreen();
  });

  test('keeps clear of the top and bottom insets by default', async () => {
    await renderWithTheme(
      <Screen testID="screen">
        <Text>Amara Okafor</Text>
      </Screen>,
    );
    expect(screen.getByTestId('screen')).toHaveStyle({ paddingTop: insets.top });
    expect(screen.getByText('Amara Okafor').parent).toHaveStyle({
      padding: space.lg,
      paddingBottom: space.lg + insets.bottom,
    });
  });

  test('puts the bottom inset under the footer when there is one', async () => {
    await renderWithTheme(
      <Screen footer={<Button label="Done" />} padding="xl">
        <Text>You are on the rota</Text>
      </Screen>,
    );
    expect(screen.getByText('You are on the rota').parent).toHaveStyle({
      paddingBottom: space.xl,
    });
    expect(screen.getByRole('button', { name: 'Done' }).parent).toHaveStyle({
      paddingHorizontal: space.xl,
      paddingBottom: space.md + insets.bottom,
    });
  });

  test('only applies the edges it is given', async () => {
    await renderWithTheme(
      <Screen testID="screen" edges={['bottom']} padding="none">
        <Text>Amara Okafor</Text>
      </Screen>,
    );
    expect(screen.getByTestId('screen')).toHaveStyle({ paddingTop: 0 });
    expect(screen.getByText('Amara Okafor').parent).toHaveStyle({ paddingBottom: insets.bottom });
  });
});
