import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { Banner } from './Banner';

describe('Banner', () => {
  test('is a polite status message by default', async () => {
    await renderWithTheme(
      <Banner title="Station change" message="Northshire Library is now Station 14." />,
    );
    const status = screen.getByRole('status');
    expect(status).toHaveAccessibleName(/Station change.*Northshire Library is now Station 14\./);
    expect(status).toHaveProp('aria-live', 'polite');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test.each(['warning', 'danger'] as const)('is an assertive alert for %s', async (tone) => {
    await renderWithTheme(<Banner tone={tone} message="Your credential expires in 14 days." />);
    const alert = screen.getByRole('alert', { name: 'Your credential expires in 14 days.' });
    expect(alert).toHaveProp('aria-live', 'assertive');
  });

  test('calls the action handler', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <Banner
        tone="warning"
        message="Your credential expires in 14 days."
        action={{ label: 'Renew it', onPress }}
      />,
    );
    await userEvent.press(screen.getByRole('button', { name: 'Renew it' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('shows a close button only when it can be dismissed', async () => {
    const onDismiss = jest.fn();
    const { rerender } = await renderWithTheme(<Banner message="You're offline." />);
    expect(screen.queryByRole('button')).toBeNull();

    await rerender(<Banner message="You're offline." onDismiss={onDismiss} />);
    await userEvent.press(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('uses a custom dismiss label', async () => {
    await renderWithTheme(
      <Banner message="Hors ligne." onDismiss={() => {}} dismissLabel="Fermer" />,
    );
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeOnTheScreen();
  });
});
