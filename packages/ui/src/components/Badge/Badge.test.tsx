import { renderWithTheme, screen } from '../../test-utils';
import { Badge } from './Badge';

describe('Badge', () => {
  test('shows the count', async () => {
    await renderWithTheme(<Badge count={7} />);
    expect(screen.getByText('7')).toBeOnTheScreen();
  });

  test('caps the count at max', async () => {
    await renderWithTheme(<Badge count={150} />);
    expect(screen.getByText('99+')).toBeOnTheScreen();
  });

  test('renders nothing for zero unless showZero is set', async () => {
    const { rerender } = await renderWithTheme(<Badge count={0} testID="badge" />);
    expect(screen.queryByTestId('badge')).not.toBeOnTheScreen();
    await rerender(<Badge count={0} showZero testID="badge" />);
    expect(screen.getByText('0')).toBeOnTheScreen();
  });

  test('uses the accessibility label for its meaning', async () => {
    await renderWithTheme(<Badge count={12} aria-label="12 unread messages" />);
    expect(screen.getByLabelText('12 unread messages')).toBeOnTheScreen();
  });

  test('hides an unlabelled dot from screen readers', async () => {
    const { rerender } = await renderWithTheme(<Badge dot testID="dot" />);
    expect(screen.queryByTestId('dot')).not.toBeOnTheScreen();
    expect(screen.getByTestId('dot', { includeHiddenElements: true })).toBeOnTheScreen();
    await rerender(<Badge dot aria-label="New activity" />);
    expect(screen.getByLabelText('New activity')).toBeOnTheScreen();
  });

  test('formats the count with formatCount', async () => {
    const formatCount = (n: number, max: number) => (n > max ? `+${max}` : `${n}`);
    await renderWithTheme(<Badge count={120} max={9} formatCount={formatCount} />);
    expect(screen.getByText('+9')).toBeOnTheScreen();
  });
});
