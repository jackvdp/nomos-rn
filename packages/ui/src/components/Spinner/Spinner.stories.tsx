import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Spinner } from './Spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  args: {
    size: 'md',
    label: '',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap="xl" align="center">
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </Stack>
  ),
};

export const WithLabel: Story = {
  args: { label: 'Loading messages' },
};

function OnBrandBand() {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.bg.brand,
        borderRadius: theme.radii.lg,
        padding: theme.space.xl,
      }}
    >
      <Spinner color={theme.colors.text.onBrand} aria-label="Signing you in" />
    </View>
  );
}

export const OnBrand: Story = {
  render: () => <OnBrandBand />,
};

function WorkplaceLoading() {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.bg.surface,
        borderRadius: theme.radii.lg,
        padding: theme.space.xl,
        gap: theme.space.lg,
        boxShadow: theme.shadows.sm,
      }}
    >
      <Text variant="headingSm">Northshire Electoral Commission</Text>
      <Spinner label="Loading polling station rota" />
      <Stack direction="row" gap="sm" align="center">
        <Spinner size="sm" aria-label="Syncing" />
        <Text variant="caption" color="secondary">
          Syncing 3 shift changes
        </Text>
      </Stack>
    </View>
  );
}

export const InAWorkplace: Story = {
  render: () => <WorkplaceLoading />,
};
