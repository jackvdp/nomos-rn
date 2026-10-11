import { createRef } from 'react';
import { StyleSheet, View, type ScrollView } from 'react-native';

import { fireEvent, renderWithTheme, screen } from '../../test-utils';
import { lightTheme } from '../../theme';
import { Button } from '../Button';
import { Text } from '../Text';
import { TextField } from '../TextField';
import { Screen, type ScreenProps } from './Screen';

// test-utils renders inside a SafeAreaProvider with these insets.
const insets = { top: 47, bottom: 34 };
const { space } = lightTheme;

type Element = ReturnType<typeof screen.getByText>;

/** The ScrollView that `element` is in. */
function scrollViewAround(element: Element) {
  let around = element.parent;
  while (around && around.type !== 'RCTScrollView') around = around.parent;
  if (!around) throw new Error('The element is not in a ScrollView.');
  return around;
}

// Jest's ScrollView holds its content container's style as a prop of its own.
function scrollContentStyle(text: string) {
  return StyleSheet.flatten(scrollViewAround(screen.getByText(text)).props.contentContainerStyle);
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

  describe('with a field that takes focus', () => {
    // How far down the content the field is, which only the device can say.
    const fieldTop = 400;

    /** A scrolling screen with a field in it, and its ScrollView. */
    async function renderWithField(props?: ScreenProps) {
      jest
        .spyOn(View.prototype, 'measureLayout')
        .mockImplementation((_content, onSuccess) => onSuccess(0, fieldTop, 300, 56));
      const scrollRef = createRef<ScrollView>();
      await renderWithTheme(
        <Screen scroll scrollRef={scrollRef} {...props}>
          <TextField label="Work email" value="" />
        </Screen>,
      );
      const scrollView = scrollRef.current!;
      // Jest's ScrollView has no content view to measure the field against.
      Object.assign(scrollView, { getInnerViewRef: () => ({}) });
      jest.mocked(scrollView.scrollTo).mockClear();
      return scrollView;
    }

    afterEach(() => jest.restoreAllMocks());

    test('scrolls the field up to the top of the screen', async () => {
      const scrollView = await renderWithField();
      await fireEvent(screen.getByLabelText('Work email'), 'focus');
      expect(scrollView.scrollTo).toHaveBeenCalledWith({ y: fieldTop - space.lg, animated: true });
    });

    test('keeps the field clear of the status bar when it scrolls under that', async () => {
      const scrollView = await renderWithField({ scrollUnderStatusBar: true });
      await fireEvent(screen.getByLabelText('Work email'), 'focus');
      expect(scrollView.scrollTo).toHaveBeenCalledWith({
        y: fieldTop - insets.top - space.lg,
        animated: true,
      });
    });

    test('scrolls again when the keyboard changes the room, until the field loses focus', async () => {
      const scrollView = await renderWithField();
      const input = screen.getByLabelText('Work email');
      await fireEvent(input, 'focus');
      await fireEvent(scrollViewAround(input), 'layout');
      expect(scrollView.scrollTo).toHaveBeenCalledTimes(2);

      await fireEvent(input, 'blur');
      await fireEvent(scrollViewAround(input), 'layout');
      expect(scrollView.scrollTo).toHaveBeenCalledTimes(2);
    });
  });
});
