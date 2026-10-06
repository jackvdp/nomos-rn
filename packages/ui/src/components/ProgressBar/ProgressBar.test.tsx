import { renderWithTheme, screen } from '../../test-utils';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  test('exposes its label and value as a percentage', async () => {
    await renderWithTheme(<ProgressBar label="Poll worker training" value={0.6} />);
    const bar = screen.getByRole('progressbar', { name: 'Poll worker training' });
    expect(bar).toHaveAccessibilityValue({ min: 0, max: 100, now: 60 });
  });

  test('clamps values outside 0 to 1', async () => {
    await renderWithTheme(
      <>
        <ProgressBar aria-label="Over" value={1.4} />
        <ProgressBar aria-label="Under" value={-0.2} />
      </>,
    );
    const over = screen.getByRole('progressbar', { name: 'Over' });
    const under = screen.getByRole('progressbar', { name: 'Under' });
    expect(over).toHaveAccessibilityValue({ now: 100 });
    expect(under).toHaveAccessibilityValue({ now: 0 });
  });

  test('shows the percentage when showValue is set', async () => {
    await renderWithTheme(<ProgressBar label="Uploading" value={0.25} showValue />);
    expect(screen.getByText('25%')).toBeOnTheScreen();
  });

  test('shows and announces custom value text', async () => {
    await renderWithTheme(
      <ProgressBar label="Poll worker training" value={0.6} valueText="3 of 5 modules" />,
    );
    expect(screen.getByText('3 of 5 modules')).toBeOnTheScreen();
    expect(screen.getByRole('progressbar')).toHaveAccessibilityValue({ text: '3 of 5 modules' });
  });

  test('is busy with no value when indeterminate', async () => {
    await renderWithTheme(<ProgressBar label="Preparing" value={0.5} indeterminate showValue />);
    const bar = screen.getByRole('progressbar', { name: 'Preparing' });
    expect(bar).toBeBusy();
    expect(bar).toHaveAccessibilityValue({ min: 0, max: 100 });
    expect(bar).not.toHaveAccessibilityValue({ now: 50 });
    expect(screen.queryByText('50%')).toBeNull();
  });
});
