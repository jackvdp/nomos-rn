import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  test('shows the title as a heading with its description', async () => {
    await renderWithTheme(
      <EmptyState icon="chats" title="No messages yet" description="Messages will appear here." />,
    );
    expect(screen.getByRole('heading', { name: 'No messages yet' })).toBeOnTheScreen();
    expect(screen.getByText('Messages will appear here.')).toBeOnTheScreen();
  });

  test('renders no buttons without actions', async () => {
    await renderWithTheme(<EmptyState title="No results" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('calls the primary and secondary actions', async () => {
    const request = jest.fn();
    const learn = jest.fn();
    await renderWithTheme(
      <EmptyState
        icon="id-card"
        title="No credentials issued"
        action={{ label: 'Request verification', onPress: request }}
        secondaryAction={{ label: 'How verification works', onPress: learn }}
      />,
    );
    await userEvent.press(screen.getByRole('button', { name: 'Request verification' }));
    await userEvent.press(screen.getByRole('button', { name: 'How verification works' }));
    expect(request).toHaveBeenCalledTimes(1);
    expect(learn).toHaveBeenCalledTimes(1);
  });
});
