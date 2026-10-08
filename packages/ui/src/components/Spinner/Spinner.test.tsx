import { renderWithTheme, screen } from '../../test-utils';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  test('is a busy progress indicator called "Loading" by default', async () => {
    await renderWithTheme(<Spinner />);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeBusy();
  });

  test('shows its label and uses it as the accessible name', async () => {
    await renderWithTheme(<Spinner label="Loading messages" />);
    expect(screen.getByText('Loading messages')).toBeOnTheScreen();
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Loading messages');
  });

  test('prefers an explicit accessibility label', async () => {
    await renderWithTheme(<Spinner label="Please wait" aria-label="Syncing shift changes" />);
    expect(screen.getByRole('progressbar', { name: 'Syncing shift changes' })).toBeOnTheScreen();
  });
});
