import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { Text } from '../Text';
import { TextLink } from './TextLink';

describe('TextLink', () => {
  test('is exposed as a link named by its text', async () => {
    await renderWithTheme(<TextLink>Polling station guide</TextLink>);
    expect(screen.getByRole('link', { name: 'Polling station guide' })).toBeOnTheScreen();
  });

  test('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <TextLink variant="label" onPress={onPress}>
        See all training modules
      </TextLink>,
    );
    await userEvent.press(screen.getByRole('link', { name: 'See all training modules' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('works nested inside a paragraph', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <Text>
        Read the <TextLink onPress={onPress}>polling station guide</TextLink> before your shift.
      </Text>,
    );
    await userEvent.press(screen.getByRole('link', { name: 'polling station guide' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/before your shift/)).toBeOnTheScreen();
  });

  test('still calls press-in and press-out handlers it is given', async () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    await renderWithTheme(
      <TextLink onPress={() => {}} onPressIn={onPressIn} onPressOut={onPressOut}>
        View history
      </TextLink>,
    );
    await userEvent.press(screen.getByRole('link', { name: 'View history' }));
    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });
});
