import { useState } from 'react';

import { renderWithTheme, screen, userEvent } from '../../test-utils';
import { SearchField, type SearchFieldProps } from './SearchField';

function Controlled(props: Partial<SearchFieldProps>) {
  const [value, setValue] = useState(props.value ?? '');
  return <SearchField label="Search people" {...props} value={value} onChangeText={setValue} />;
}

describe('SearchField', () => {
  test('is a labelled search box that accepts typing', async () => {
    await renderWithTheme(<Controlled />);
    const input = screen.getByRole('searchbox', { name: 'Search people' });
    await userEvent.type(input, 'Amara');
    expect(input).toHaveDisplayValue('Amara');
  });

  test('shows a clear button only when there is text, and clears on press', async () => {
    const onClear = jest.fn();
    await renderWithTheme(<Controlled onClear={onClear} />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeOnTheScreen();

    await userEvent.type(screen.getByRole('searchbox'), 'Priya');
    await userEvent.press(screen.getByRole('button', { name: 'Clear search' }));

    expect(screen.getByRole('searchbox')).toHaveDisplayValue('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeOnTheScreen();
  });

  test('submits from the keyboard', async () => {
    const onSubmitEditing = jest.fn();
    await renderWithTheme(<Controlled onSubmitEditing={onSubmitEditing} />);
    await userEvent.type(screen.getByRole('searchbox'), 'training', { submitEditing: true });
    expect(onSubmitEditing).toHaveBeenCalledTimes(1);
  });

  test('uses a custom clear label and hides the button when disabled', async () => {
    const { rerender } = await renderWithTheme(
      <SearchField
        label="Search posts"
        value="ballot"
        onChangeText={() => {}}
        clearLabel="Effacer"
      />,
    );
    expect(screen.getByRole('button', { name: 'Effacer' })).toBeOnTheScreen();

    await rerender(
      <SearchField label="Search posts" value="ballot" onChangeText={() => {}} disabled />,
    );
    expect(screen.getByRole('searchbox', { name: 'Search posts' })).toBeDisabled();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });
});
