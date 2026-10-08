import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { Avatar } from '../Avatar';
import { ListItem } from './ListItem';

describe('ListItem', () => {
  test('is a button named by its text when pressable', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <ListItem
        title="Language"
        trailingText="English"
        leadingIcon="globe"
        showChevron
        onPress={onPress}
      />,
    );
    await userEvent.press(screen.getByRole('button', { name: 'Language, English' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('blocks presses when disabled', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<ListItem title="Export my data" onPress={onPress} disabled />);
    const row = screen.getByRole('button', { name: 'Export my data' });
    await userEvent.press(row);
    expect(onPress).not.toHaveBeenCalled();
    expect(row).toBeDisabled();
  });

  test('is not a button without onPress', async () => {
    await renderWithTheme(
      <ListItem title="Polling station 14B" description="St Anne’s Community Hall" />,
    );
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
    expect(screen.getByText('Polling station 14B')).toBeOnTheScreen();
    expect(screen.getByText('St Anne’s Community Hall')).toBeOnTheScreen();
  });

  test('renders leading and trailing content', async () => {
    await renderWithTheme(
      <ListItem
        title="Amara Okafor"
        description="Presiding officer"
        leading={<Avatar name="Amara Okafor" />}
        trailing={<Avatar name="Northshire Electoral Commission" shape="rounded" size="xs" />}
      />,
    );
    expect(screen.getByRole('img', { name: 'Amara Okafor' })).toBeOnTheScreen();
    expect(screen.getByRole('img', { name: 'Northshire Electoral Commission' })).toBeOnTheScreen();
  });

  test('accepts a custom role and label', async () => {
    await renderWithTheme(
      <ListItem title="Privacy" role="link" aria-label="Privacy settings" onPress={() => {}} />,
    );
    expect(screen.getByRole('link', { name: 'Privacy settings' })).toBeOnTheScreen();
  });
});
