import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { Stack } from '../Stack';
import { Skeleton, SkeletonText } from './Skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  args: {
    width: 200,
    height: 16,
    radius: 'sm',
    circle: false,
  },
  argTypes: {
    radius: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'full'] },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Shapes: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack direction="row" gap="md" align="center">
        <Skeleton circle height={24} />
        <Skeleton circle />
        <Skeleton circle height={56} />
      </Stack>
      <Skeleton height={12} width="40%" radius="xs" />
      <Skeleton height={44} radius="md" />
      <Skeleton height={120} radius="lg" />
    </Stack>
  ),
};

export const TextLines: Story = {
  render: () => (
    <Stack gap="xl">
      <SkeletonText variant="headingSm" lines={1} lastLineWidth="50%" />
      <SkeletonText />
      <SkeletonText variant="bodySm" lines={2} lastLineWidth="30%" />
    </Stack>
  ),
};

function FeedPostPlaceholder() {
  const theme = useTheme();
  return (
    <View
      aria-busy
      style={{
        backgroundColor: theme.colors.bg.surface,
        borderRadius: theme.radii.lg,
        padding: theme.space.lg,
        gap: theme.space.md,
        boxShadow: theme.shadows.sm,
      }}
    >
      <Stack direction="row" gap="md" align="center">
        <Skeleton circle />
        <Stack gap="xs" fill>
          <Skeleton height={14} width="45%" />
          <Skeleton height={12} width="30%" />
        </Stack>
      </Stack>
      <SkeletonText lines={3} lastLineWidth="70%" />
      <Skeleton height={160} radius="md" />
      <Stack direction="row" gap="lg">
        <Skeleton height={20} width={64} radius="full" />
        <Skeleton height={20} width={64} radius="full" />
      </Stack>
    </View>
  );
}

export const FeedPost: Story = {
  render: () => (
    <Stack gap="lg">
      <FeedPostPlaceholder />
      <FeedPostPlaceholder />
    </Stack>
  ),
};
