import { useState } from 'react';

import { renderWithTheme, screen, userEvent, within } from '../../test-utils';
import { Radio, RadioGroup, type RadioOption } from './RadioGroup';

const roles: RadioOption[] = [
  { value: 'presiding', label: 'Presiding officer' },
  { value: 'poll-clerk', label: 'Poll clerk' },
  { value: 'counting', label: 'Counting assistant', disabled: true },
];

function RoleGroup({ onChange }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState<string>();
  return (
    <RadioGroup
      label="Your role"
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      options={roles}
    />
  );
}

describe('RadioGroup', () => {
  test('renders a labelled group of radios from options', async () => {
    await renderWithTheme(<RoleGroup />);
    const group = screen.getByLabelText('Your role');
    expect(group).toHaveProp('role', 'radiogroup');
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Poll clerk' })).not.toBeChecked();
  });

  test('selects the pressed option and deselects the previous one', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<RoleGroup onChange={onChange} />);

    await userEvent.press(screen.getByRole('radio', { name: 'Presiding officer' }));
    expect(screen.getByRole('radio', { name: 'Presiding officer' })).toBeChecked();

    await userEvent.press(screen.getByRole('radio', { name: 'Poll clerk' }));
    expect(screen.getByRole('radio', { name: 'Poll clerk' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Presiding officer' })).not.toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('poll-clerk');
  });

  test('ignores presses on disabled options and on a disabled group', async () => {
    const onChange = jest.fn();
    const { rerender } = await renderWithTheme(<RoleGroup onChange={onChange} />);
    const counting = screen.getByRole('radio', { name: 'Counting assistant' });
    await userEvent.press(counting);
    expect(counting).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();

    await rerender(
      <RadioGroup label="Your role" value="presiding" onChange={onChange} options={roles} disabled />,
    );
    await userEvent.press(screen.getByRole('radio', { name: 'Poll clerk' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('works with Radio children and does not re-fire for the selected option', async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <RadioGroup label="Preferred language" value="en" onChange={onChange}>
        <Radio value="en" label="English" />
        <Radio value="sw" label="Kiswahili" description="Kiswahili sanifu" />
      </RadioGroup>,
    );
    await userEvent.press(screen.getByRole('radio', { name: 'English' }));
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.press(screen.getByRole('radio', { name: 'Kiswahili' }));
    expect(onChange).toHaveBeenCalledWith('sw');
  });

  test('throws a helpful error outside a RadioGroup', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(renderWithTheme(<Radio value="en" label="English" />)).rejects.toThrow(
      'Radio must be used inside a <RadioGroup>.',
    );
    jest.restoreAllMocks();
  });
});
