import { useState } from 'react';

import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { Checkbox, type CheckboxState } from './Checkbox';

function RememberDevice({ initial = false }: { initial?: CheckboxState }) {
  const [checked, setChecked] = useState<CheckboxState>(initial);
  return <Checkbox label="Remember this device" checked={checked} onChange={setChecked} />;
}

describe('Checkbox', () => {
  test('toggles when the row is pressed', async () => {
    await renderWithTheme(<RememberDevice />);
    const checkbox = screen.getByRole('checkbox', { name: 'Remember this device' });
    expect(checkbox).not.toBeChecked();

    await userEvent.press(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.press(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('reports indeterminate as mixed and becomes checked when pressed', async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <Checkbox label="Select all sections" checked="indeterminate" onChange={onChange} />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Select all sections' });
    expect(checkbox).toBePartiallyChecked();

    await userEvent.press(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('does not change when disabled', async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <Checkbox label="Remember this device" checked onChange={onChange} disabled />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Remember this device' });
    await userEvent.press(checkbox);
    expect(onChange).not.toHaveBeenCalled();
    expect(checkbox).toBeDisabled();
  });

  test('keeps the label as the name and reads description and error as a hint', async () => {
    await renderWithTheme(
      <Checkbox
        label="I have no political party role"
        description="Required for all poll workers."
        errorText="Confirm this to accept the shift."
        checked={false}
        onChange={() => {}}
      />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'I have no political party role' });
    expect(screen.getByText('Confirm this to accept the shift.')).toBeOnTheScreen();
    expect(checkbox).toHaveProp(
      'accessibilityHint',
      'Confirm this to accept the shift. Required for all poll workers.',
    );
  });
});
