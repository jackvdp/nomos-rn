import type { Meta, StoryObj } from '@storybook/react-native';

import { iconGlyphs } from '../Icon';
import { Stack } from '../Stack';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  args: {
    icon: 'chats',
    tone: 'brand',
    title: 'No messages yet',
    description: 'Messages from your team and presiding officers will appear here.',
    action: { label: 'Start a conversation', onPress: () => {} },
  },
  argTypes: {
    icon: { control: 'select', options: Object.keys(iconGlyphs) },
    tone: {
      control: 'select',
      options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NoMessages: Story = {
  args: {
    icon: 'chats',
    title: 'No messages yet',
    description: 'Messages from your team and presiding officers will appear here.',
    action: { label: 'Start a conversation', onPress: () => {}, leadingIcon: 'add' },
    secondaryAction: undefined,
  },
};

export const Offline: Story = {
  args: {
    icon: 'offline',
    tone: 'neutral',
    title: "You're offline",
    description: "Check your connection. Anything you've already opened is still available.",
    action: { label: 'Try again', onPress: () => {}, leadingIcon: 'refresh' },
  },
};

export const NoCredentials: Story = {
  args: {
    icon: 'id-card',
    title: 'No credentials issued',
    description:
      'When Northshire Electoral Commission verifies your role, your credential will appear here.',
    action: { label: 'Request verification', onPress: () => {} },
    secondaryAction: { label: 'How verification works', onPress: () => {} },
  },
};

export const TitleOnly: Story = {
  args: {
    icon: undefined,
    title: 'No results for "Station 14"',
    description: undefined,
    action: undefined,
  },
};

export const Tones: Story = {
  render: (args) => (
    <Stack gap="md">
      <EmptyState {...args} tone="success" icon="check-circle" title="You're all caught up" description={undefined} action={undefined} />
      <EmptyState {...args} tone="warning" icon="time" title="No shifts this week" description={undefined} action={undefined} />
    </Stack>
  ),
};
