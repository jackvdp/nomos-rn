import { StyleSheet } from 'react-native';

import { renderWithTheme, screen } from '../../test-utils';
import { lightTheme } from '../../theme';
import { Button } from '../Button';
import { Text } from '../Text';
import { Screen } from './Screen';

// test-utils renders inside a SafeAreaProvider with these insets.
const insets = { top: 47, bottom: 34 };
const { space } = lightTheme;

// Jest's ScrollView holds its content container's style as a prop of its own.
function scrollContentStyle(text: string) {
  const scrollView = screen.getByText(text).parent?.parent;
  return StyleSheet.flatten(scrollView?.props.contentContainerStyle);
}

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

  test('stops a scrolling screen below the status bar', async () => {
    await renderWithTheme(
      <Screen testID="screen" scroll>
        <Text>Amara Okafor</Text>
      </Screen>,
    );
    expect(screen.getByTestId('screen')).toHaveStyle({ paddingTop: insets.top });
    expect(scrollContentStyle('Amara Okafor')).toMatchObject({ paddingTop: space.lg });
  });

  test('can let the content scroll under the status bar, starting clear of it', async () => {
    await renderWithTheme(
      <Screen testID="screen" scroll scrollUnderStatusBar>
        <Text>Amara Okafor</Text>
      </Screen>,
    );
    expect(screen.getByTestId('screen')).toHaveStyle({ paddingTop: 0 });
    expect(scrollContentStyle('Amara Okafor')).toMatchObject({
      paddingTop: space.lg + insets.top,
    });
  });

  test('keeps a header, and the content under it, below the status bar', async () => {
    await renderWithTheme(
      <Screen
        testID="screen"
        scroll
        scrollUnderStatusBar
        header={<Text variant="headingSm">Profile</Text>}
      >
        <Text>Amara Okafor</Text>
      </Screen>,
    );
    expect(screen.getByTestId('screen')).toHaveStyle({ paddingTop: insets.top });
    expect(scrollContentStyle('Amara Okafor')).toMatchObject({ paddingTop: space.lg });
  });
});
