import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { Text } from '../Text';
import { Card } from './Card';

describe('Card', () => {
  test('renders its content without being a button', async () => {
    await renderWithTheme(
      <Card>
        <Text>Polling station 14B</Text>
      </Card>,
    );
    expect(screen.getByText('Polling station 14B')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  test('becomes a button named by its content when pressable', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <Card onPress={onPress}>
        <Text>Poll worker training: Module 3</Text>
      </Card>,
    );
    await userEvent.press(screen.getByRole('button', { name: 'Poll worker training: Module 3' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('uses an explicit accessibility label', async () => {
    await renderWithTheme(
      <Card onPress={() => {}} aria-label="Open module 3">
        <Text>Poll worker training: Module 3</Text>
      </Card>,
    );
    expect(screen.getByRole('button', { name: 'Open module 3' })).toBeOnTheScreen();
  });

  test('blocks presses when disabled', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <Card onPress={onPress} disabled aria-label="Module 4">
        <Text>Module 4</Text>
      </Card>,
    );
    const card = screen.getByRole('button', { name: 'Module 4' });
    await userEvent.press(card);
    expect(onPress).not.toHaveBeenCalled();
    expect(card).toBeDisabled();
  });
});
