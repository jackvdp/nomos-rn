import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useState } from 'react';

import { Stack } from '../Stack';
import { Text } from '../Text';
import { Switch, type SwitchProps } from './Switch';

function ControlledSwitch(props: SwitchProps) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return (
    <Switch
      {...props}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        props.onValueChange(next);
      }}
    />
  );
}

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  args: {
    label: 'Shift reminders',
    value: true,
    disabled: false,
    onValueChange: () => {},
  },
  argTypes: {
    description: { control: 'text' },
  },
  render: (args) => <ControlledSwitch {...args} />,
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <Stack>
      <ControlledSwitch {...args} label="Off" value={false} />
      <ControlledSwitch {...args} label="On" value />
      <ControlledSwitch {...args} label="Disabled, off" value={false} disabled />
      <ControlledSwitch {...args} label="Disabled, on" value disabled />
    </Stack>
  ),
};

export const WithDescription: Story = {
  args: {
    label: 'Show my profile in the NOMOS Network',
    description: 'Verified public servants outside Northshire Electoral Commission can find you.',
    value: false,
  },
};

function NotificationSettings() {
  const [settings, setSettings] = useState({
    shifts: true,
    messages: true,
    training: false,
    network: false,
  });
  const toggle = (key: keyof typeof settings) => (next: boolean) =>
    setSettings((current) => ({ ...current, [key]: next }));

  return (
    <Stack gap="xs">
      <Text variant="headingMd">Notifications</Text>
      <Text color="secondary">For Amara Okafor at Northshire Electoral Commission</Text>
      <Switch
        label="Shift changes"
        description="When your presiding officer moves or cancels a shift."
        value={settings.shifts}
        onValueChange={toggle('shifts')}
      />
      <Switch label="Direct messages" value={settings.messages} onValueChange={toggle('messages')} />
      <Switch
        label="Training reminders"
        description="For example, “Poll worker training: Module 3 is due Friday”."
        value={settings.training}
        onValueChange={toggle('training')}
      />
      <Switch
        label="NOMOS Network activity"
        description="Posts and events from outside your organisation."
        value={settings.network}
        onValueChange={toggle('network')}
      />
      <Switch
        label="Credential expiry"
        description="Required by your organisation, so it can’t be turned off."
        value
        onValueChange={() => {}}
        disabled
      />
    </Stack>
  );
}

export const Notifications: Story = {
  render: () => <NotificationSettings />,
};
