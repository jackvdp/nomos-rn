import type { Meta, StoryObj } from '@storybook/react-native';

import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Tag } from '../Tag';
import { Text } from '../Text';
import { Card } from './Card';

const meta = {
  title: 'Display/Card',
  component: Card,
  args: {
    variant: 'elevated',
    padding: 'lg',
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined', 'filled'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
  },
  render: (args) => (
    <Card {...args}>
      <Stack gap="xs">
        <Text variant="headingSm">Polling station 14B</Text>
        <Text variant="bodySm" color="secondary">
          St Anne’s Community Hall, Market Street
        </Text>
      </Stack>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap="lg">
      {(['elevated', 'outlined', 'filled'] as const).map((variant) => (
        <Card key={variant} {...args} variant={variant}>
          <Text variant="bodyStrong">{variant}</Text>
          <Text variant="bodySm" color="secondary">
            Opening hours 7:00 to 22:00
          </Text>
        </Card>
      ))}
    </Stack>
  ),
};

export const Pressable: Story = {
  args: { onPress: () => {} },
  argTypes: { onPress: { action: 'pressed' } },
  render: (args) => (
    <Card {...args} aria-label="Poll worker training: Module 3, 2 of 5 lessons complete">
      <Stack gap="sm">
        <Stack direction="row" gap="sm" align="center" justify="space-between">
          <Tag label="Training" tone="brand" variant="outline" size="sm" icon="school" />
          <Text variant="caption" color="tertiary">
            25 min
          </Text>
        </Stack>
        <Text variant="headingSm">Poll worker training: Module 3</Text>
        <Text variant="bodySm" color="secondary">
          Handling postal votes and spoilt ballots. 2 of 5 lessons complete.
        </Text>
      </Stack>
    </Card>
  ),
};

export const Credential: Story = {
  render: (args) => (
    <Card {...args}>
      <Stack gap="md">
        <Stack direction="row" gap="md" align="center">
          <Avatar name="Northshire Electoral Commission" shape="rounded" verified />
          <Stack gap="xxs" fill>
            <Text variant="bodyStrong">Presiding officer accreditation</Text>
            <Text variant="caption" color="secondary">
              Northshire Electoral Commission
            </Text>
          </Stack>
        </Stack>
        <Tag label="Credential expires in 14 days" tone="warning" icon="time" />
        <Stack direction="row" gap="sm">
          <Button label="Renew" size="sm" />
          <Button label="Share" size="sm" variant="secondary" leadingIcon="qr" />
        </Stack>
      </Stack>
    </Card>
  ),
};

export const Grouped: Story = {
  args: { variant: 'filled', padding: 'md' },
  render: (args) => (
    <Card variant="outlined">
      <Stack gap="md">
        <Text variant="headingSm">Election day checklist</Text>
        <Card {...args}>
          <Text variant="bodySm">Collect ballot box seals from the returning office.</Text>
        </Card>
        <Card {...args}>
          <Text variant="bodySm">Confirm polling station keys with the site manager.</Text>
        </Card>
      </Stack>
    </Card>
  ),
};
