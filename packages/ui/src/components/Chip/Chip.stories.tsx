import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useState } from 'react';

import { Stack } from '../Stack';
import { Text } from '../Text';
import { Chip, ChipGroup, type ChipProps } from './Chip';

function ToggleChip(props: ChipProps) {
  const [selected, setSelected] = useState(props.selected ?? false);
  useEffect(() => setSelected(props.selected ?? false), [props.selected]);
  return (
    <Chip
      {...props}
      selected={selected}
      onPress={() => {
        setSelected((current) => !current);
        props.onPress?.();
      }}
    />
  );
}

const meta = {
  title: 'Forms/Chip',
  component: Chip,
  args: {
    label: 'Following',
    selected: false,
    disabled: false,
  },
  argTypes: {
    leadingIcon: { control: 'select', options: [undefined, 'people', 'building', 'globe', 'star'] },
    onPress: { action: 'pressed' },
  },
  render: (args) => <ToggleChip {...args} />,
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <ChipGroup>
      <ToggleChip {...args} label="Unselected" />
      <ToggleChip {...args} label="Selected" selected />
      <ToggleChip {...args} label="With icon" leadingIcon="building" />
      <ToggleChip {...args} label="Disabled" disabled />
      <ToggleChip {...args} label="Disabled, selected" selected disabled />
    </ChipGroup>
  ),
};

const initialRecipients = ['Amara Okafor', 'Daniel Mwangi', 'Priya Raman'];

function Recipients() {
  const [recipients, setRecipients] = useState(initialRecipients);
  return (
    <Stack gap="sm">
      <Text variant="label">To</Text>
      <ChipGroup>
        {recipients.map((name) => (
          <Chip
            key={name}
            label={name}
            leadingIcon="person"
            onRemove={() => setRecipients((current) => current.filter((item) => item !== name))}
            removeLabel={`Remove ${name}`}
          />
        ))}
      </ChipGroup>
    </Stack>
  );
}

export const Removable: Story = {
  render: () => <Recipients />,
};

const feedFilters = [
  { value: 'all', label: 'All' },
  { value: 'organisation', label: 'My Organisation', icon: 'building' },
  { value: 'network', label: 'NOMOS Network', icon: 'globe' },
  { value: 'following', label: 'Following', icon: 'people' },
] as const;

function FeedFilterBar() {
  const [filter, setFilter] = useState<(typeof feedFilters)[number]['value']>('all');
  return (
    <Stack gap="md">
      <ChipGroup scrollable aria-label="Filter the feed">
        {feedFilters.map((item) => (
          <Chip
            key={item.value}
            label={item.label}
            leadingIcon={'icon' in item ? item.icon : undefined}
            selected={filter === item.value}
            onPress={() => setFilter(item.value)}
          />
        ))}
      </ChipGroup>
      <Text color="secondary">
        Showing {feedFilters.find((item) => item.value === filter)?.label} posts
      </Text>
    </Stack>
  );
}

export const FeedFilters: Story = {
  render: () => <FeedFilterBar />,
};

const eventTypes = ['Training', 'Briefings', 'Polling day', 'Counts', 'Social'];

function EventTypeFilters() {
  const [selected, setSelected] = useState<string[]>(['Training']);
  return (
    <Stack gap="sm">
      <Text variant="label">Event types</Text>
      <ChipGroup>
        {eventTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            selected={selected.includes(type)}
            onPress={() =>
              setSelected((current) =>
                current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
              )
            }
          />
        ))}
      </ChipGroup>
    </Stack>
  );
}

export const MultiSelect: Story = {
  render: () => <EventTypeFilters />,
};
