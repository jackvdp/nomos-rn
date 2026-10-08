import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useState } from 'react';

import { useTheme } from '../../theme';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Checkbox, type CheckboxProps } from './Checkbox';

function ControlledCheckbox(props: CheckboxProps) {
  const [checked, setChecked] = useState(props.checked);
  useEffect(() => setChecked(props.checked), [props.checked]);
  return (
    <Checkbox
      {...props}
      checked={checked}
      onChange={(next) => {
        setChecked(next);
        props.onChange(next);
      }}
    />
  );
}

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  args: {
    label: 'Remember this device',
    checked: false,
    disabled: false,
    onChange: () => {},
  },
  argTypes: {
    checked: { control: 'select', options: [false, true, 'indeterminate'] },
    description: { control: 'text' },
    errorText: { control: 'text' },
  },
  render: (args) => <ControlledCheckbox {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <Stack>
      <ControlledCheckbox {...args} label="Unchecked" checked={false} />
      <ControlledCheckbox {...args} label="Checked" checked />
      <ControlledCheckbox {...args} label="Indeterminate" checked="indeterminate" />
      <ControlledCheckbox {...args} label="Disabled" disabled />
      <ControlledCheckbox {...args} label="Disabled and checked" checked disabled />
    </Stack>
  ),
};

export const WithDescription: Story = {
  args: {
    label: 'Remember this device',
    description: 'Only on a phone that is yours and has a screen lock.',
  },
};

export const WithError: Story = {
  args: {
    label: 'I confirm I have no political party role',
    description: 'Required for all poll workers under the Northshire code of conduct.',
    errorText: 'You need to confirm this before you can accept the shift.',
  },
};

const sections = ['Opening the polling station', 'Assisting voters', 'Counting and sealing'];

function TrainingChecklist() {
  const theme = useTheme();
  const [done, setDone] = useState(sections.slice(0, 1));
  const all = done.length === sections.length ? true : done.length === 0 ? false : 'indeterminate';
  return (
    <Stack gap="xs">
      <Text variant="headingSm">Poll worker training: Module 3</Text>
      <Checkbox
        label="Mark all sections complete"
        checked={all}
        onChange={(next) => setDone(next ? sections : [])}
      />
      <Stack style={{ paddingStart: theme.space.xxl }}>
        {sections.map((section) => (
          <Checkbox
            key={section}
            label={section}
            checked={done.includes(section)}
            onChange={(next) =>
              setDone((current) =>
                next ? [...current, section] : current.filter((item) => item !== section),
              )
            }
          />
        ))}
      </Stack>
    </Stack>
  );
}

export const SelectAll: Story = {
  render: () => <TrainingChecklist />,
};
