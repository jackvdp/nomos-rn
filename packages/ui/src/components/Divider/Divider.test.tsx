import { renderWithTheme, screen } from '../../test-utils';
import { Divider } from './Divider';

describe('Divider', () => {
  test('is a separator', async () => {
    await renderWithTheme(<Divider testID="divider" />);
    expect(screen.getByTestId('divider')).toHaveProp('role', 'separator');
  });

  test('is a separator when vertical', async () => {
    await renderWithTheme(<Divider orientation="vertical" testID="divider" />);
    expect(screen.getByTestId('divider')).toHaveProp('role', 'separator');
  });

  test('shows a label that screen readers can read', async () => {
    await renderWithTheme(<Divider label="or" testID="divider" />);
    expect(screen.getByText('or')).toBeOnTheScreen();
    // A separator's content is presentational on the web, so the labelled form is not one.
    expect(screen.getByTestId('divider')).not.toHaveProp('role');
  });
});
