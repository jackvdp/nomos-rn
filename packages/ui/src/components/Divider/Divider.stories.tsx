import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Divider } from './Divider';

const meta = {
  title: 'Display/Divider',
  component: Divider,
  args: {
    orientation: 'horizontal',
    emphasis: 'default',
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    emphasis: { control: 'select', options: ['subtle', 'default'] },
    inset: { control: 'select', options: [undefined, 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Emphasis: Story = {
  render: (args) => (
    <Stack gap="lg">
      <Text variant="caption" color="secondary">
        Default
      </Text>
      <Divider {...args} emphasis="default" />
      <Text variant="caption" color="secondary">
        Subtle
      </Text>
      <Divider {...args} emphasis="subtle" />
    </Stack>
  ),
};

export const Inset: Story = {
  args: { inset: 'xxxl' },
  render: (args) => (
    <Stack gap="md">
      <Text>Amara Okafor</Text>
      <Divider {...args} />
      <Text>Daniel Mwangi</Text>
      <Divider {...args} />
      <Text>Priya Raman</Text>
    </Stack>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <Stack direction="row" gap="sm" align="center">
      <Text variant="caption" color="secondary">
        Poll worker
      </Text>
      <Divider {...args} />
      <Text variant="caption" color="secondary">
        Polling station 14B
      </Text>
      <Divider {...args} />
      <Text variant="caption" color="secondary">
        3 shifts
      </Text>
    </Stack>
  ),
};

export const WithLabel: Story = {
  args: { label: 'or' },
  render: (args) => (
    <Stack gap="lg">
      <Button label="Sign in with your organisation" fullWidth leadingIcon="building" />
      <Divider {...args} />
      <Button label="Scan an invitation code" variant="secondary" fullWidth leadingIcon="qr" />
    </Stack>
  ),
};
