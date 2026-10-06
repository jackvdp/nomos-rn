import type { Meta, StoryObj } from '@storybook/react-native';

import { Stack } from '../Stack';
import { Text } from '../Text';
import { Tag } from './Tag';

const tones = ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] as const;

const meta = {
  title: 'Display/Tag',
  component: Tag,
  args: {
    label: 'Valid',
    tone: 'success',
    variant: 'subtle',
    size: 'md',
    icon: 'check-circle',
  },
  argTypes: {
    tone: { control: 'select', options: tones },
    variant: { control: 'select', options: ['subtle', 'solid', 'outline'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap="md">
      {(['subtle', 'solid', 'outline'] as const).map((variant) => (
        <Stack key={variant} direction="row" gap="sm" wrap>
          {tones.map((tone) => (
            <Tag key={tone} {...args} variant={variant} tone={tone} label={tone} icon={undefined} />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" align="center">
      <Tag {...args} size="sm" />
      <Tag {...args} size="md" />
    </Stack>
  ),
};

export const CredentialStatuses: Story = {
  render: () => (
    <Stack direction="row" gap="sm" wrap>
      <Tag label="Valid" tone="success" icon="check-circle" />
      <Tag label="Expires in 14 days" tone="warning" icon="time" />
      <Tag label="Expired" tone="danger" icon="error" />
      <Tag label="Revoked" tone="danger" variant="solid" icon="close-circle" />
      <Tag label="Pending verification" tone="info" icon="shield" />
    </Stack>
  ),
};

export const Topics: Story = {
  render: () => (
    <Stack direction="row" gap="xs" wrap>
      <Tag label="Training" tone="brand" variant="outline" size="sm" icon="school" />
      <Tag label="Logistics" tone="neutral" variant="outline" size="sm" icon="location" />
      <Tag label="Results" tone="neutral" variant="outline" size="sm" icon="document" />
    </Stack>
  ),
};

export const InCredentialRow: Story = {
  render: () => (
    <Stack direction="row" gap="md" align="center" justify="space-between">
      <Stack gap="xxs" fill>
        <Text variant="bodyStrong">Presiding officer accreditation</Text>
        <Text variant="caption" color="secondary">
          Issued by Northshire Electoral Commission
        </Text>
      </Stack>
      <Tag label="Expires in 14 days" tone="warning" icon="time" size="sm" />
    </Stack>
  ),
};
