import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  args: {
    value: 0.6,
    label: 'Uploading ID document',
    showValue: true,
    tone: 'brand',
    indeterminate: false,
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Stack gap="lg">
      <ProgressBar {...args} tone="brand" label="Brand" value={0.6} />
      <ProgressBar {...args} tone="success" label="Success" value={1} />
      <ProgressBar {...args} tone="warning" label="Warning" value={0.85} />
      <ProgressBar {...args} tone="danger" label="Danger" value={0.3} />
    </Stack>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg">
      <ProgressBar {...args} label="Not started" value={0} />
      <ProgressBar {...args} label="Complete" value={1} tone="success" />
      <ProgressBar {...args} label="No label row" showValue={false} value={0.4} aria-label="Sync progress" />
    </Stack>
  ),
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Preparing your credential' },
};

function TrainingCard() {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.bg.surface,
        borderRadius: theme.radii.lg,
        padding: theme.space.lg,
        gap: theme.space.md,
        boxShadow: theme.shadows.sm,
      }}
    >
      <Stack gap="xxs">
        <Text variant="overline" color="secondary">
          Northshire Electoral Commission
        </Text>
        <Text variant="headingSm">Poll worker training</Text>
      </Stack>
      <ProgressBar label="Modules completed" value={3 / 5} valueText="3 of 5 modules" />
      <ProgressBar
        label="Storage used by shared documents"
        value={0.92}
        tone="warning"
        valueText="92% of 1 GB"
      />
    </View>
  );
}

export const PollWorkerTraining: Story = {
  render: () => <TrainingCard />,
};
