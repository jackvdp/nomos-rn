import type { Meta, StoryObj } from '@storybook/react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Tag } from '../Tag';
import { Text } from '../Text';
import { ListItem } from './ListItem';

const meta = {
  title: 'Display/ListItem',
  component: ListItem,
  args: {
    title: 'Notifications',
    description: 'Shift changes, messages and training reminders',
    leadingIcon: 'bell',
    showChevron: true,
    destructive: false,
    disabled: false,
    divider: false,
    onPress: () => {},
  },
  argTypes: {
    onPress: { action: 'pressed' },
    titleLines: { control: { type: 'number', min: 1, max: 3 } },
    descriptionLines: { control: { type: 'number', min: 1, max: 4 } },
  },
} satisfies Meta<typeof ListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function Surface({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.bg.surface,
        borderRadius: theme.radii.lg,
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  );
}

export const Settings: Story = {
  render: () => (
    <Surface>
      <ListItem title="Profile" leadingIcon="person" showChevron divider onPress={() => {}} />
      <ListItem
        title="Language"
        leadingIcon="globe"
        trailingText="English"
        showChevron
        divider
        onPress={() => {}}
      />
      <ListItem
        title="Notifications"
        description="Shift changes, messages and training reminders"
        leadingIcon="bell"
        showChevron
        divider
        onPress={() => {}}
      />
      <ListItem title="Privacy and visibility" leadingIcon="lock" showChevron onPress={() => {}} />
    </Surface>
  ),
};

export const Directory: Story = {
  render: () => (
    <Surface>
      <ListItem
        title="Amara Okafor"
        description="Presiding officer · Polling station 14B"
        leading={<Avatar name="Amara Okafor" verified />}
        showChevron
        divider
        onPress={() => {}}
      />
      <ListItem
        title="Daniel Mwangi"
        description="Poll worker · Northshire Electoral Commission"
        leading={<Avatar name="Daniel Mwangi" />}
        trailing={<Badge count={2} aria-label="2 unread messages" />}
        divider
        onPress={() => {}}
      />
      <ListItem
        title="Northshire Electoral Commission"
        description="Organisation · 1,240 members"
        leading={<Avatar name="Northshire Electoral Commission" shape="rounded" verified />}
        showChevron
        onPress={() => {}}
      />
    </Surface>
  ),
};

export const Credentials: Story = {
  render: () => (
    <Surface>
      <ListItem
        title="Presiding officer accreditation"
        description="Issued by Northshire Electoral Commission"
        leadingIcon="id-card"
        trailing={<Tag label="Valid" tone="success" icon="check-circle" size="sm" />}
        divider
      />
      <ListItem
        title="Poll worker training: Module 3"
        description="Completed 12 August 2026"
        leadingIcon="school"
        trailing={<Tag label="Expires in 14 days" tone="warning" icon="time" size="sm" />}
      />
    </Surface>
  ),
};

export const DestructiveAndDisabled: Story = {
  render: () => (
    <Surface>
      <ListItem
        title="Export my data"
        description="Available after the count is certified"
        leadingIcon="download"
        disabled
        divider
        onPress={() => {}}
      />
      <ListItem
        title="Leave Polling logistics workspace"
        leadingIcon="logout"
        destructive
        divider
        onPress={() => {}}
      />
      <ListItem title="Sign out" leadingIcon="logout" destructive onPress={() => {}} />
    </Surface>
  ),
};

export const LongText: Story = {
  args: {
    title:
      'Northshire Electoral Commission: returning officer briefing for all polling station staff',
    description:
      'Mandatory for presiding officers. Covers opening procedures, ballot box seals, ' +
      'accessibility support and the close-of-poll checklist.',
    titleLines: 2,
    leadingIcon: 'calendar',
    trailingText: 'Thu 9:00',
  },
  render: (args) => (
    <Surface>
      <ListItem {...args} />
    </Surface>
  ),
};

export const Plain: Story = {
  render: () => (
    <Surface>
      <ListItem title="Polling station 14B" description="St Anne’s Community Hall" divider />
      <ListItem
        title="Opening hours"
        trailing={
          <Text variant="bodySm" color="secondary">
            7:00 to 22:00
          </Text>
        }
      />
    </Surface>
  ),
};
