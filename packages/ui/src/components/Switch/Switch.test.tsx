import { useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { act, renderWithTheme, screen, userEvent } from '../../test-utils';
import { Switch } from './Switch';

function ShiftReminders({ initial = false }: { initial?: boolean }) {
  const [value, setValue] = useState(initial);
  return (
    <Switch
      label="Shift reminders"
      description="A day before each shift."
      value={value}
      onValueChange={setValue}
    />
  );
}

describe('Switch', () => {
  test('is a labelled switch that toggles when the row is pressed', async () => {
    await renderWithTheme(<ShiftReminders />);
    const toggle = screen.getByRole('switch', { name: 'Shift reminders' });
    expect(toggle).not.toBeChecked();
    expect(toggle).toHaveProp('accessibilityHint', 'A day before each shift.');

    await userEvent.press(toggle);
    await act(() => jest.advanceTimersByTime(200));
    expect(toggle).toBeChecked();

    await userEvent.press(toggle);
    expect(toggle).not.toBeChecked();
  });

  test('calls onValueChange with the next value', async () => {
    const onValueChange = jest.fn();
    await renderWithTheme(<Switch label="Direct messages" value onValueChange={onValueChange} />);
    await userEvent.press(screen.getByRole('switch', { name: 'Direct messages' }));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  test('does not change when disabled', async () => {
    const onValueChange = jest.fn();
    await renderWithTheme(
      <Switch label="Credential expiry" value onValueChange={onValueChange} disabled />,
    );
    const toggle = screen.getByRole('switch', { name: 'Credential expiry' });
    await userEvent.press(toggle);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(toggle).toBeDisabled();
    expect(toggle).toBeChecked();
  });

  test('still toggles when the user prefers reduced motion', async () => {
    jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockResolvedValueOnce(true);
    await renderWithTheme(<ShiftReminders initial />);
    const toggle = screen.getByRole('switch', { name: 'Shift reminders' });
    await userEvent.press(toggle);
    expect(toggle).not.toBeChecked();
  });
});
