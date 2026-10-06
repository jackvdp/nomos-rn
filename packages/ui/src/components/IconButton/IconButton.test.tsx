import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  test('uses its aria-label as the accessible name', async () => {
    await renderWithTheme(<IconButton icon="close" aria-label="Close" />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeOnTheScreen();
  });

  test('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<IconButton icon="share" aria-label="Share" onPress={onPress} />);
    await userEvent.press(screen.getByRole('button', { name: 'Share' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<IconButton icon="share" aria-label="Share" onPress={onPress} disabled />);
    const button = screen.getByRole('button', { name: 'Share' });
    await userEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  test('is busy and blocks presses while loading', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<IconButton icon="send" aria-label="Send" onPress={onPress} loading />);
    const button = screen.getByRole('button', { name: 'Send' });
    await userEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeBusy();
  });

  test('includes the badge count in its accessible name', async () => {
    await renderWithTheme(<IconButton icon="bell" aria-label="Notifications" badge={3} />);
    expect(screen.getByRole('button', { name: 'Notifications, 3 new' })).toBeOnTheScreen();
  });

  test('caps the visible count and formats the label with formatBadgeLabel', async () => {
    await renderWithTheme(
      <IconButton
        icon="bell"
        aria-label="Notifications"
        badge={120}
        formatBadgeLabel={(label, count) => `${label} : ${count} nouvelles`}
      />,
    );
    expect(screen.getByRole('button', { name: 'Notifications : 120 nouvelles' })).toBeOnTheScreen();
    expect(screen.getByText('99+', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  test('shows no badge for a zero count', async () => {
    await renderWithTheme(<IconButton icon="bell" aria-label="Notifications" badge={0} />);
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeOnTheScreen();
    expect(screen.queryByText('0', { includeHiddenElements: true })).toBeNull();
  });

  test('keeps a 44-point touch area at the small size', async () => {
    await renderWithTheme(<IconButton icon="close" aria-label="Close" size="sm" />);
    // 32 visual + 6 each side.
    expect(screen.getByRole('button', { name: 'Close' })).toHaveProp('hitSlop', 6);
  });
});
