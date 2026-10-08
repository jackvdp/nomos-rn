import { useState } from 'react';

import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { Chip, ChipGroup } from './Chip';

function FeedFilters() {
  const [filter, setFilter] = useState('All');
  return (
    <ChipGroup scrollable>
      {['All', 'My Organisation', 'NOMOS Network'].map((label) => (
        <Chip
          key={label}
          label={label}
          selected={filter === label}
          onPress={() => setFilter(label)}
        />
      ))}
    </ChipGroup>
  );
}

describe('Chip', () => {
  test('is a checkbox that reflects selection', async () => {
    await renderWithTheme(<FeedFilters />);
    const network = screen.getByRole('checkbox', { name: 'NOMOS Network' });
    expect(screen.getByRole('checkbox', { name: 'All' })).toBeChecked();
    expect(network).not.toBeChecked();

    await userEvent.press(network);
    expect(network).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'All' })).not.toBeChecked();
  });

  test('calls onRemove from its own labelled button', async () => {
    const onPress = jest.fn();
    const onRemove = jest.fn();
    await renderWithTheme(
      <Chip
        label="Amara Okafor"
        onPress={onPress}
        onRemove={onRemove}
        removeLabel="Remove Amara Okafor"
      />,
    );
    await userEvent.press(screen.getByRole('button', { name: 'Remove Amara Okafor' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('ignores presses when disabled', async () => {
    const onPress = jest.fn();
    const onRemove = jest.fn();
    await renderWithTheme(
      <Chip label="Following" onPress={onPress} onRemove={onRemove} disabled />,
    );
    const chip = screen.getByRole('checkbox', { name: 'Following' });
    await userEvent.press(chip);
    await userEvent.press(screen.getByRole('button', { name: 'Remove' }));
    expect(onPress).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
    expect(chip).toBeDisabled();
  });

  test('is a plain label without onPress', async () => {
    await renderWithTheme(<Chip label="Ward 12" />);
    expect(screen.getByText('Ward 12')).toBeOnTheScreen();
    expect(screen.queryByRole('checkbox')).not.toBeOnTheScreen();
  });
});
