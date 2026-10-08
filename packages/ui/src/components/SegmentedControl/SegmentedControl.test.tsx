import { useState } from 'react';

import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { SegmentedControl, type SegmentedControlOption } from './SegmentedControl';

type Section = 'feed' | 'events' | 'courses';

const options: SegmentedControlOption<Section>[] = [
  { value: 'feed', label: 'Feed', icon: 'news' },
  { value: 'events', label: 'Events' },
  { value: 'courses', label: 'Courses', disabled: true },
];

function Sections({ onChange }: { onChange?: (value: Section) => void }) {
  const [value, setValue] = useState<Section>('feed');
  return (
    <SegmentedControl
      aria-label="Workplace sections"
      options={options}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe('SegmentedControl', () => {
  test('renders a tab per option with the current one selected', async () => {
    await renderWithTheme(<Sections />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tab', { name: 'Feed' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Events' })).not.toBeSelected();
  });

  test('selects the pressed segment', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<Sections onChange={onChange} />);
    await userEvent.press(screen.getByRole('tab', { name: 'Events' }));

    expect(onChange).toHaveBeenCalledWith('events');
    expect(screen.getByRole('tab', { name: 'Events' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Feed' })).not.toBeSelected();
  });

  test('does not call onChange for the selected or a disabled segment', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<Sections onChange={onChange} />);
    await userEvent.press(screen.getByRole('tab', { name: 'Feed' }));
    await userEvent.press(screen.getByRole('tab', { name: 'Courses' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'Courses' })).toBeDisabled();
  });
});
