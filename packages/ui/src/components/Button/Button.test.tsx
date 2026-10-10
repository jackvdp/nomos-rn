import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { Button } from './Button';

describe('Button', () => {
  test('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Button label="Continue" onPress={onPress} />);
    await userEvent.press(screen.getByRole('button', { name: 'Continue' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Button label="Continue" onPress={onPress} disabled />);
    const button = screen.getByRole('button', { name: 'Continue' });
    await userEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  test('is busy and blocks presses while loading', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Button label="Saving" onPress={onPress} loading />);
    const button = screen.getByRole('button', { name: 'Saving' });
    await userEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeBusy();
  });

  test('still tells the caller when a press starts and ends', async () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    await renderWithTheme(
      <Button label="Continue" onPressIn={onPressIn} onPressOut={onPressOut} />,
    );
    await userEvent.press(screen.getByRole('button', { name: 'Continue' }));
    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  test('uses a custom accessibility label when given', async () => {
    await renderWithTheme(<Button label="Delete" aria-label="Delete draft post" />);
    expect(screen.getByRole('button', { name: 'Delete draft post' })).toBeOnTheScreen();
  });
});
