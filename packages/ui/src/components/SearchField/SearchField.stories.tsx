import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useState } from 'react';

import { Stack } from '../Stack';
import { Text } from '../Text';
import { SearchField, type SearchFieldProps } from './SearchField';

function ControlledSearchField(props: SearchFieldProps) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return (
    <SearchField
      {...props}
      value={value}
      onChangeText={(text) => {
        setValue(text);
        props.onChangeText(text);
      }}
    />
  );
}

const meta = {
  title: 'Forms/SearchField',
  component: SearchField,
  args: {
    label: 'Search people',
    placeholder: 'Search people and organisations',
    value: '',
    disabled: false,
    onChangeText: () => {},
  },
  argTypes: {
    onSubmitEditing: { action: 'submitted' },
    onClear: { action: 'cleared' },
  },
  render: (args) => <ControlledSearchField {...args} />,
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <Stack gap="md">
      <ControlledSearchField {...args} />
      <ControlledSearchField {...args} value="Presiding officer" />
      <ControlledSearchField {...args} placeholder="Search is unavailable offline" disabled />
    </Stack>
  ),
};

const people = [
  { name: 'Amara Okafor', role: 'Presiding officer, Ward 12' },
  { name: 'Daniel Mwangi', role: 'Poll worker, Ward 7' },
  { name: 'Priya Raman', role: 'Training lead, Northshire Electoral Commission' },
];

function NetworkSearch() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const results = people.filter((person) =>
    person.name.toLowerCase().includes(submitted.trim().toLowerCase()),
  );
  return (
    <Stack gap="lg">
      <SearchField
        label="Search the NOMOS Network"
        placeholder="Search the NOMOS Network"
        value={query}
        onChangeText={setQuery}
        onClear={() => setSubmitted('')}
        onSubmitEditing={() => setSubmitted(query)}
      />
      <Stack gap="md">
        <Text variant="overline" color="secondary">
          {submitted ? `Results for “${submitted}”` : 'Suggested people'}
        </Text>
        {results.map((person) => (
          <Stack key={person.name} gap="xxs">
            <Text variant="bodyStrong">{person.name}</Text>
            <Text variant="bodySm" color="secondary">
              {person.role}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export const SearchTheNetwork: Story = {
  render: () => <NetworkSearch />,
};
