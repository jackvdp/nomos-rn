import type { Meta, StoryObj } from '@storybook/react-native';

import { Stack } from '../Stack';
import { Text } from '../Text';
import { AvatarGroup, type AvatarGroupItem } from './AvatarGroup';

const team: AvatarGroupItem[] = [
  { name: 'Amara Okafor' },
  { name: 'Daniel Mwangi' },
  { name: 'Priya Raman' },
  { name: 'Tomás Ferreira' },
  { name: 'Leilani Kahale' },
  { name: 'Yusuf Haddad' },
];

const meta = {
  title: 'Display/AvatarGroup',
  component: AvatarGroup,
  args: {
    avatars: team,
    max: 3,
    size: 'sm',
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    max: { control: { type: 'number', min: 1, max: 6 } },
    total: { control: { type: 'number', min: 0 } },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="lg">
      <AvatarGroup {...args} size="xs" />
      <AvatarGroup {...args} size="sm" />
      <AvatarGroup {...args} size="md" />
      <AvatarGroup {...args} size="lg" />
      <AvatarGroup {...args} size="xl" />
    </Stack>
  ),
};

export const NoOverflow: Story = {
  args: { avatars: team.slice(0, 3), max: 3 },
};

export const LargeTotal: Story = {
  args: { avatars: team.slice(0, 3), total: 128 },
};

export const Organisations: Story = {
  args: {
    avatars: [
      { name: 'Northshire Electoral Commission', shape: 'rounded' },
      { name: 'Eastvale County Council', shape: 'rounded' },
      { name: 'Riverside Polling Logistics', shape: 'rounded' },
      { name: 'Westmoor Returning Office', shape: 'rounded' },
    ],
    size: 'md',
  },
};

export const WorkspaceMembers: Story = {
  args: { avatars: team, total: 24, max: 4 },
  render: (args) => (
    <Stack direction="row" gap="sm" align="center">
      <AvatarGroup {...args} />
      <Text variant="bodySm" color="secondary">
        24 members in Polling logistics workspace
      </Text>
    </Stack>
  ),
};
