import { renderWithTheme, screen } from '../../test-utils';
import { Tag } from './Tag';

describe('Tag', () => {
  test('shows its label', async () => {
    await renderWithTheme(<Tag label="Pending verification" tone="info" />);
    expect(screen.getByText('Pending verification')).toBeOnTheScreen();
  });

  test('keeps its icon decorative', async () => {
    await renderWithTheme(<Tag label="Expired" tone="danger" icon="error" />);
    expect(screen.queryByRole('img')).not.toBeOnTheScreen();
    expect(screen.getByText('Expired')).toBeOnTheScreen();
  });

  test('is not interactive', async () => {
    await renderWithTheme(<Tag label="Training" variant="outline" />);
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  test('can carry a fuller accessibility label', async () => {
    await renderWithTheme(
      <Tag
        label="Expires in 14 days"
        tone="warning"
        accessible
        aria-label="Credential expires in 14 days"
      />,
    );
    expect(screen.getByLabelText('Credential expires in 14 days')).toBeOnTheScreen();
  });
});
