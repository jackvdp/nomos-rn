import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Badge } from './Badge';

const meta = {
  title: 'Display/Badge',
  component: Badge,
  args: {
    count: 3,
    max: 99,
    dot: false,
    tone: 'danger',
    ring: false,
    showZero: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'],
    },
    count: { control: { type: 'number', min: 0 } },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Counts: Story = {
  render: (args) => (
    <Stack direction="row" gap="md" align="center">
      <Badge {...args} count={1} />
      <Badge {...args} count={8} />
      <Badge {...args} count={42} />
      <Badge {...args} count={99} />
      <Badge {...args} count={240} />
      <Badge {...args} count={0} showZero />
    </Stack>
  ),
};

export const Dot: Story = {
  args: { dot: true, 'aria-label': 'New activity' },
};

export const Tones: Story = {
  render: (args) => (
    <Stack direction="row" gap="md" align="center">
      <Badge {...args} tone="brand" />
      <Badge {...args} tone="neutral" />
      <Badge {...args} tone="info" />
      <Badge {...args} tone="success" />
      <Badge {...args} tone="warning" />
      <Badge {...args} tone="danger" />
    </Stack>
  ),
};

function OnIconExample() {
  const theme = useTheme();
  return (
    <Stack direction="row" gap="xl" align="center">
      <View aria-label="Notifications, 12 unread" accessible>
        <Icon name="bell" size="lg" />
        <Badge
          count={12}
          ring
          style={{ position: 'absolute', top: -theme.space.xs, end: -theme.space.sm }}
        />
      </View>
      <View aria-label="Messages, new activity" accessible>
        <Icon name="chats" size="lg" />
        <Badge dot ring style={{ position: 'absolute', top: 0, end: 0 }} />
      </View>
      <View>
        <Avatar name="Amara Okafor" />
        <Badge
          count={4}
          ring
          aria-label="4 unread messages from Amara Okafor"
          style={{ position: 'absolute', top: -theme.space.xs, end: -theme.space.xs }}
        />
      </View>
    </Stack>
  );
}

export const OnIcon: Story = {
  render: () => <OnIconExample />,
};

export const NextToLabel: Story = {
  render: (args) => (
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center">
        <Text variant="label">Shift requests</Text>
        <Badge {...args} count={5} aria-label="5 pending" />
      </Stack>
      <Stack direction="row" gap="sm" align="center">
        <Text variant="label">Training modules</Text>
        <Badge {...args} count={2} tone="info" aria-label="2 new" />
      </Stack>
    </Stack>
  ),
};
