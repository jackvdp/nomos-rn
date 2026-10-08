import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { makeStyles } from '../../theme';
import { iconGlyphs, type IconName } from '../Icon';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { IconButton } from './IconButton';

const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  args: {
    icon: 'bell',
    'aria-label': 'Notifications',
    variant: 'tertiary',
    size: 'md',
    shape: 'circle',
    loading: false,
    disabled: false,
    badge: 0,
  },
  argTypes: {
    icon: { control: 'select', options: Object.keys(iconGlyphs) as IconName[] },
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['circle', 'square'] },
    badge: { control: 'number' },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" gap="md">
      <IconButton {...args} variant="primary" icon="add" aria-label="New post" />
      <IconButton {...args} variant="secondary" icon="share" aria-label="Share" />
      <IconButton {...args} variant="tertiary" icon="more" aria-label="More options" />
      <IconButton {...args} variant="danger" icon="trash" aria-label="Delete draft" />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" align="center" gap="md">
      <IconButton {...args} variant="secondary" size="sm" />
      <IconButton {...args} variant="secondary" size="md" />
      <IconButton {...args} variant="secondary" size="lg" />
    </Stack>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <Stack direction="row" gap="md">
      <IconButton {...args} variant="secondary" shape="circle" icon="edit" aria-label="Edit" />
      <IconButton {...args} variant="secondary" shape="square" icon="edit" aria-label="Edit" />
    </Stack>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack direction="row" gap="md">
      <IconButton {...args} variant="primary" icon="send" aria-label="Send" loading />
      <IconButton {...args} variant="primary" icon="send" aria-label="Send" disabled />
      <IconButton {...args} variant="secondary" icon="send" aria-label="Send" disabled />
      <IconButton {...args} variant="tertiary" icon="send" aria-label="Send" disabled />
    </Stack>
  ),
};

export const WithBadge: Story = {
  render: (args) => (
    <Stack direction="row" gap="lg">
      <IconButton {...args} icon="bell" aria-label="Notifications" badge={3} />
      <IconButton {...args} icon="chats" aria-label="Messages" badge={12} />
      <IconButton
        {...args}
        variant="secondary"
        icon="bell"
        aria-label="Notifications"
        badge={120}
      />
    </Stack>
  ),
};

/** The workplace app bar: back, title, and notification and menu actions. */
function AppBar() {
  const styles = useStyles();
  return (
    <View style={styles.appBar}>
      <IconButton icon="arrow-back" aria-label="Back" />
      <Stack fill>
        <Text variant="headingSm" numberOfLines={1}>
          Northshire Electoral Commission
        </Text>
        <Text variant="caption" color="secondary">
          Organisation workplace
        </Text>
      </Stack>
      <IconButton icon="search" aria-label="Search" />
      <IconButton icon="bell" aria-label="Notifications" badge={4} />
      <IconButton icon="more-vertical" aria-label="More options" />
    </View>
  );
}

export const InAnAppBar: Story = {
  name: 'In an app bar',
  render: () => <AppBar />,
};

const useStyles = makeStyles((t) => ({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.xs,
    paddingHorizontal: t.space.xs,
    paddingVertical: t.space.sm,
    borderRadius: t.radii.lg,
    backgroundColor: t.colors.bg.surface,
    boxShadow: t.shadows.sm,
  },
}));
