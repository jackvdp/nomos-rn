import { renderWithTheme, screen } from '../../test-utils';
import { VerifiedBadge } from './VerifiedBadge';

describe('VerifiedBadge', () => {
  test('is labelled "Verified" by default when icon-only', async () => {
    await renderWithTheme(<VerifiedBadge />);
    expect(screen.getByRole('img', { name: 'Verified' })).toBeOnTheScreen();
  });

  test('uses the visible label as its name', async () => {
    await renderWithTheme(<VerifiedBadge label="Verified institution" />);
    expect(screen.getByText('Verified institution')).toBeOnTheScreen();
    expect(screen.getByRole('img', { name: 'Verified institution' })).toBeOnTheScreen();
  });

  test('accepts a translated or more detailed accessibility label', async () => {
    await renderWithTheme(<VerifiedBadge aria-label="Vérifié par la Commission électorale" />);
    expect(
      screen.getByRole('img', { name: 'Vérifié par la Commission électorale' }),
    ).toBeOnTheScreen();
  });
});
