import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useState } from 'react';

import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Radio, RadioGroup, type RadioGroupProps, type RadioOption } from './RadioGroup';

function ControlledRadioGroup(props: RadioGroupProps) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return (
    <RadioGroup
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

const roles: RadioOption[] = [
  { value: 'presiding', label: 'Presiding officer' },
  { value: 'poll-clerk', label: 'Poll clerk' },
  { value: 'counting', label: 'Counting assistant' },
];

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  args: {
    label: 'Your role on polling day',
    value: 'poll-clerk',
    options: roles,
    disabled: false,
    onChange: () => {},
  },
  argTypes: {
    description: { control: 'text' },
    errorText: { control: 'text' },
  },
  render: (args) => <ControlledRadioGroup {...args} />,
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDescriptions: Story = {
  args: {
    label: 'Shift on Thursday 7 May',
    description: 'You can change this until 48 hours before polls open.',
    value: undefined,
    options: [
      { value: 'full', label: 'Full day', description: '06:30 to close of poll, about 16 hours' },
      { value: 'morning', label: 'Morning', description: '06:30 to 14:00' },
      { value: 'evening', label: 'Evening', description: '14:00 to close of poll' },
    ],
  },
};

export const States: Story = {
  render: (args) => (
    <Stack gap="xl">
      <ControlledRadioGroup
        {...args}
        label="One option unavailable"
        options={[
          ...roles.slice(0, 2),
          {
            value: 'counting',
            label: 'Counting assistant',
            description: 'Training required',
            disabled: true,
          },
        ]}
      />
      <ControlledRadioGroup {...args} label="Whole group disabled" disabled />
      <ControlledRadioGroup
        {...args}
        label="With an error"
        value={undefined}
        errorText="Choose the role you were appointed to."
      />
    </Stack>
  ),
};

export const WithRadioChildren: Story = {
  render: (args) => (
    <ControlledRadioGroup {...args} label="Preferred language" value="en" options={undefined}>
      <Radio value="en" label="English" />
      <Radio value="sw" label="Kiswahili" />
      <Radio value="fr" label="Français" />
    </ControlledRadioGroup>
  ),
};

function AvailabilityForm() {
  const [shift, setShift] = useState<'full' | 'morning' | 'evening'>();
  const [error, setError] = useState<string>();
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text variant="headingMd">Confirm your availability</Text>
        <Text color="secondary">Ward 12, St Mary’s Primary School. Requested by Amara Okafor.</Text>
      </Stack>
      <RadioGroup
        label="Which shift can you work?"
        value={shift}
        onChange={(next) => {
          setShift(next);
          setError(undefined);
        }}
        errorText={error}
        options={[
          { value: 'full', label: 'Full day', description: '06:30 to close of poll' },
          { value: 'morning', label: 'Morning', description: '06:30 to 14:00' },
          { value: 'evening', label: 'Evening', description: '14:00 to close of poll' },
        ]}
      />
      <Button
        label="Send to presiding officer"
        fullWidth
        onPress={() => !shift && setError('Choose a shift before you send.')}
      />
    </Stack>
  );
}

export const Availability: Story = {
  render: () => <AvailabilityForm />,
};
