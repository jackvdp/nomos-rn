import type { Meta, StoryObj } from '@storybook/react-native';

import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Card } from '../Card';
import { Divider } from '../Divider';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { VerifiedBadge } from '../VerifiedBadge';
import { ContextLabel } from './ContextLabel';

const meta = {
  title: 'NOMOS/ContextLabel',
  component: ContextLabel,
  args: {
    kind: 'organisation',
    name: 'Northshire Electoral Commission',
    audience: 'Members only',
    size: 'sm',
    variant: 'subtle',
  },
  argTypes: {
    kind: { control: 'select', options: ['organisation', 'network', 'workspace'] },
    size: { control: 'select', options: ['sm', 'md'] },
    variant: { control: 'select', options: ['subtle', 'solid'] },
    audience: { control: 'text' },
  },
} satisfies Meta<typeof ContextLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Kinds: Story = {
  render: (args) => (
    <Stack gap="md">
      <ContextLabel
        {...args}
        kind="organisation"
        name="Northshire Electoral Commission"
        audience="Members only"
      />
      <ContextLabel {...args} kind="network" name="NOMOS Network" audience="Public to the Network" />
      <ContextLabel
        {...args}
        kind="workspace"
        name="Polling logistics workspace"
        audience="Workspace members"
      />
    </Stack>
  ),
};

export const WithoutAudience: Story = {
  args: { audience: undefined },
  render: (args) => (
    <Stack gap="md">
      <ContextLabel {...args} kind="organisation" name="Northshire Electoral Commission" />
      <ContextLabel {...args} kind="network" name="NOMOS Network" />
      <ContextLabel {...args} kind="workspace" name="Polling logistics workspace" />
    </Stack>
  ),
};

export const SizesAndVariants: Story = {
  render: (args) => (
    <Stack gap="md">
      <ContextLabel {...args} size="sm" variant="subtle" />
      <ContextLabel {...args} size="md" variant="subtle" />
      <ContextLabel {...args} size="sm" variant="solid" />
      <ContextLabel {...args} size="md" variant="solid" />
    </Stack>
  ),
};

export const LongNames: Story = {
  args: {
    kind: 'workspace',
    name: 'Northshire and Eastvale joint count centre logistics workspace',
    audience: 'Presiding officers and count supervisors',
  },
};

export const PostHeader: Story = {
  render: () => (
    <Card>
      <Stack gap="md">
        <Stack direction="row" gap="md" align="center">
          <Avatar name="Priya Raman" />
          <Stack gap="xxs" fill>
            <Stack direction="row" gap="xs" align="center">
              <Text variant="bodyStrong" numberOfLines={1} style={{ flexShrink: 1 }}>
                Priya Raman
              </Text>
              <VerifiedBadge />
            </Stack>
            <Text variant="caption" color="secondary">
              Returning officer · 2 h
            </Text>
          </Stack>
        </Stack>
        <ContextLabel kind="organisation" name="Northshire Electoral Commission" audience="All staff" />
        <Text>
          Ballot box seals for polling stations 10 to 18 are ready to collect from the returning
          office from 8:00 tomorrow.
        </Text>
      </Stack>
    </Card>
  ),
};

export const ComposerAudience: Story = {
  render: () => (
    <Card variant="outlined">
      <Stack gap="md">
        <Stack direction="row" gap="sm" align="center" justify="space-between">
          <Stack gap="xs" fill>
            <Text variant="caption" color="secondary">
              Posting to
            </Text>
            <ContextLabel
              kind="network"
              name="NOMOS Network"
              audience="Public to the Network"
              size="md"
            />
          </Stack>
          <Button label="Change" variant="tertiary" size="sm" trailingIcon="chevron-down" />
        </Stack>
        <Divider emphasis="subtle" />
        <Text color="tertiary">Share an update with poll workers across the Network…</Text>
      </Stack>
    </Card>
  ),
};
