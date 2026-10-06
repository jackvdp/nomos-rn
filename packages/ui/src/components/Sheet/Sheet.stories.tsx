import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '../../theme';
import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Sheet, type SheetProps } from './Sheet';

const meta = {
  title: 'Overlays/Sheet',
  component: Sheet,
  parameters: { fullscreen: true },
  args: {
    visible: false,
    onDismiss: () => {},
    title: 'Shift details',
    dismissable: true,
    padded: true,
    dismissLabel: 'Close',
    children: null,
  },
  argTypes: {
    onDismiss: { action: 'dismissed' },
  },
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

function SheetDemo({
  triggerLabel = 'Open sheet',
  ...props
}: SheetProps & { triggerLabel?: string }) {
  const [visible, setVisible] = useState(props.visible);
  return (
    <Stack fill align="center" justify="center" padding="lg">
      <Button label={triggerLabel} onPress={() => setVisible(true)} />
      <Sheet
        {...props}
        visible={visible}
        onDismiss={() => {
          props.onDismiss();
          setVisible(false);
        }}
      />
    </Stack>
  );
}

function ShiftDetails() {
  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center">
        <Icon name="location" />
        <Text>Northshire Library, Station 14</Text>
      </Stack>
      <Stack direction="row" gap="sm" align="center">
        <Icon name="calendar" />
        <Text>Thursday 14 November, 06:30 to 22:00</Text>
      </Stack>
      <Stack direction="row" gap="sm" align="center">
        <Icon name="person" />
        <Text>Presiding officer: Daniel Mwangi</Text>
      </Stack>
      <Button label="Add to calendar" variant="secondary" leadingIcon="calendar" fullWidth />
    </Stack>
  );
}

export const Playground: Story = {
  args: { children: <ShiftDetails /> },
  render: (args) => <SheetDemo {...args} triggerLabel="View shift" />,
};

interface ActionRowProps {
  icon: IconName;
  label: string;
  danger?: boolean;
  onPress: () => void;
}

function ActionRow({ icon, label, danger = false, onPress }: ActionRowProps) {
  const theme = useTheme();
  const color = danger ? theme.colors.text.danger : theme.colors.text.primary;
  return (
    <Pressable
      role="button"
      aria-label={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space.lg,
        minHeight: theme.sizes.control.lg,
        paddingHorizontal: theme.space.xl,
        backgroundColor: pressed ? theme.colors.bg.sunken : 'transparent',
      })}
    >
      <Icon name={icon} color={color} />
      <Text color={danger ? 'danger' : 'primary'}>{label}</Text>
    </Pressable>
  );
}

function PostActions({ onClose }: { onClose: () => void }) {
  const rows: Omit<ActionRowProps, 'onPress'>[] = [
    { icon: 'share', label: 'Share post' },
    { icon: 'link', label: 'Copy link' },
    { icon: 'layers', label: 'Save to Polling Day Coordination' },
    { icon: 'eye-off', label: 'Hide posts from Priya Raman' },
    { icon: 'warning', label: 'Report post', danger: true },
  ];
  return (
    <View>
      {rows.map((row) => (
        <ActionRow key={row.label} {...row} onPress={onClose} />
      ))}
    </View>
  );
}

function ActionSheetDemo({ startOpen = false }: { startOpen?: boolean }) {
  const [visible, setVisible] = useState(startOpen);
  const close = () => setVisible(false);
  return (
    <Stack fill align="center" justify="center" padding="lg">
      <Button
        label="Post options"
        variant="secondary"
        leadingIcon="more"
        onPress={() => setVisible(true)}
      />
      <Sheet visible={visible} onDismiss={close} aria-label="Post options" padded={false}>
        <PostActions onClose={close} />
      </Sheet>
    </Stack>
  );
}

export const ActionSheet: Story = {
  render: () => <ActionSheetDemo />,
};

function Guidance() {
  const sections = [
    {
      heading: 'Before polls open',
      body: 'Arrive by 06:30. Check the ballot box seals with the presiding officer and record each seal number.',
    },
    {
      heading: 'Identifying voters',
      body: 'Ask each voter for their name and address and find them on the register before issuing a ballot.',
    },
    {
      heading: 'Assisting voters',
      body: 'Voters with a disability may bring a companion. Offer the tactile voting device and large-print sample ballot.',
    },
    {
      heading: 'Spoilt ballots',
      body: 'If a voter makes a mistake, cancel the ballot, mark it spoilt and issue a replacement. Record it in the log.',
    },
    {
      heading: 'Closing the station',
      body: 'At 22:00, let anyone already queuing vote. Seal the ballot box slot and complete the ballot paper account.',
    },
    {
      heading: 'Escalation',
      body: 'Contact the Northshire Electoral Commission helpline for anything the presiding officer cannot resolve.',
    },
  ];
  return (
    <Stack gap="lg">
      {sections.map(({ heading, body }) => (
        <Stack key={heading} gap="xs">
          <Text variant="bodyStrong">{heading}</Text>
          <Text color="secondary">{body}</Text>
        </Stack>
      ))}
    </Stack>
  );
}

export const LongContent: Story = {
  args: { title: 'Polling station guidance', children: <Guidance /> },
  render: (args) => <SheetDemo {...args} triggerLabel="Read guidance" />,
};

function CodeOfConductDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <Stack fill align="center" justify="center" padding="lg">
      <Button label="Join workplace" onPress={() => setVisible(true)} />
      <Sheet
        visible={visible}
        onDismiss={() => setVisible(false)}
        title="Code of conduct"
        dismissable={false}
      >
        <Stack gap="lg">
          <Text color="secondary">
            Before joining the Northshire workplace, confirm that you will stay impartial and keep
            voter information confidential.
          </Text>
          <Button label="I agree" fullWidth onPress={() => setVisible(false)} />
        </Stack>
      </Sheet>
    </Stack>
  );
}

export const RequiresAChoice: Story = {
  render: () => <CodeOfConductDemo />,
};

/** Starts open, so the open state shows without interaction and is smoke-tested. */
export const Open: Story = {
  args: { visible: true, children: <ShiftDetails /> },
  render: (args) => <SheetDemo {...args} triggerLabel="View shift" />,
};

export const OpenActionSheet: Story = {
  render: () => <ActionSheetDemo startOpen />,
};
