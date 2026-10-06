import type { Meta, StoryObj } from '@storybook/react-native';

import { Stack } from '../Stack';
import { Text } from '../Text';
import { Avatar } from './Avatar';

const meta = {
  title: 'Display/Avatar',
  component: Avatar,
  args: {
    name: 'Amara Okafor',
    size: 'md',
    shape: 'circle',
    verified: false,
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'select', options: ['circle', 'rounded'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap="md" align="center">
      <Avatar {...args} size="xs" />
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </Stack>
  ),
};

export const Initials: Story = {
  render: (args) => (
    <Stack direction="row" gap="md" align="center" wrap>
      <Avatar {...args} name="Amara Okafor" />
      <Avatar {...args} name="Daniel Mwangi" />
      <Avatar {...args} name="Priya Raman" />
      <Avatar {...args} name="Tomás Ferreira" />
      <Avatar {...args} name="Leilani Kahale" />
      <Avatar {...args} name="Yusuf" />
    </Stack>
  ),
};

export const Organisations: Story = {
  args: { shape: 'rounded', name: 'Northshire Electoral Commission' },
  render: (args) => (
    <Stack direction="row" gap="md" align="center">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" verified />
      <Avatar {...args} size="lg" name="Eastvale Polling Logistics" verified />
    </Stack>
  ),
};

export const Verified: Story = {
  args: { verified: true },
  render: (args) => (
    <Stack direction="row" gap="lg" align="center">
      <Avatar {...args} size="xs" />
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </Stack>
  ),
};

export const Fallback: Story = {
  render: (args) => (
    <Stack direction="row" gap="md" align="center">
      <Avatar {...args} name="" aria-label="Unknown member" />
      <Avatar {...args} name="" shape="rounded" aria-label="Unknown organisation" />
    </Stack>
  ),
};

export const ProfileHeader: Story = {
  args: { name: 'Priya Raman', size: 'xl', verified: true },
  render: (args) => (
    <Stack direction="row" gap="lg" align="center">
      <Avatar {...args} />
      <Stack gap="xxs" fill>
        <Text variant="headingSm">Priya Raman</Text>
        <Text variant="bodySm" color="secondary">
          Presiding officer · Northshire Electoral Commission
        </Text>
      </Stack>
    </Stack>
  ),
};
