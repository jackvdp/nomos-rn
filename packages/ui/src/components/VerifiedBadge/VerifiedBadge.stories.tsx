import type { Meta, StoryObj } from '@storybook/react-native';

import { Avatar } from '../Avatar';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { VerifiedBadge } from './VerifiedBadge';

const meta = {
  title: 'NOMOS/VerifiedBadge',
  component: VerifiedBadge,
  args: {
    size: 'sm',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    label: { control: 'text' },
    'aria-label': { control: 'text' },
  },
} satisfies Meta<typeof VerifiedBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="md">
      <Stack direction="row" gap="md" align="center">
        <VerifiedBadge {...args} size="sm" />
        <VerifiedBadge {...args} size="md" />
      </Stack>
      <Stack direction="row" gap="md" align="center">
        <VerifiedBadge {...args} size="sm" label="Verified" />
        <VerifiedBadge {...args} size="md" label="Verified" />
      </Stack>
    </Stack>
  ),
};

export const NextToName: Story = {
  render: (args) => (
    <Stack gap="lg">
      <Stack direction="row" gap="md" align="center">
        <Avatar name="Amara Okafor" />
        <Stack gap="xxs" fill>
          <Stack direction="row" gap="xs" align="center">
            <Text variant="bodyStrong" numberOfLines={1} style={{ flexShrink: 1 }}>
              Amara Okafor
            </Text>
            <VerifiedBadge {...args} aria-label="Verified presiding officer" />
          </Stack>
          <Text variant="caption" color="secondary">
            Presiding officer · Polling station 14B
          </Text>
        </Stack>
      </Stack>
      <Stack direction="row" gap="md" align="center">
        <Avatar name="Northshire Electoral Commission" shape="rounded" />
        <Stack gap="xxs" fill>
          <Stack direction="row" gap="xs" align="center">
            <Text variant="bodyStrong" numberOfLines={1} style={{ flexShrink: 1 }}>
              Northshire Electoral Commission
            </Text>
            <VerifiedBadge {...args} />
          </Stack>
          <Text variant="caption" color="secondary">
            Electoral commission · 1,240 members
          </Text>
        </Stack>
      </Stack>
    </Stack>
  ),
};

export const InstitutionHeader: Story = {
  args: { size: 'md', label: 'Verified institution' },
  render: (args) => (
    <Stack gap="sm">
      <Text variant="headingMd">Northshire Electoral Commission</Text>
      <VerifiedBadge {...args} />
    </Stack>
  ),
};
