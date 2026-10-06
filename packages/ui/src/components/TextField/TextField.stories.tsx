import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useState } from 'react';

import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { TextField, type TextFieldProps } from './TextField';

function ControlledTextField(props: TextFieldProps) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return (
    <TextField
      {...props}
      value={value}
      onChangeText={(text) => {
        setValue(text);
        props.onChangeText?.(text);
      }}
    />
  );
}

const meta = {
  title: 'Forms/TextField',
  component: TextField,
  args: {
    label: 'Email address',
    value: '',
    placeholder: 'name@northshire.gov',
    helperText: 'Use the address your electoral commission registered.',
    errorText: undefined,
    required: false,
    disabled: false,
    secureTextEntry: false,
    multiline: false,
  },
  argTypes: {
    leadingIcon: { control: 'select', options: [undefined, 'mail', 'person', 'lock', 'search'] },
    maxLength: { control: 'number' },
    onChangeText: { action: 'changed' },
  },
  render: (args) => <ControlledTextField {...args} />,
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg">
      <ControlledTextField {...args} label="Full name" helperText={undefined} placeholder="As on your ID" />
      <ControlledTextField
        {...args}
        label="Staff number"
        value="NEC-20417"
        helperText="Printed on the back of your commission ID card."
      />
      <ControlledTextField
        {...args}
        label="Email address"
        value="amara.okafor@northshire"
        helperText={undefined}
        errorText="Enter an email address in the format name@example.gov"
        required
      />
      <ControlledTextField
        {...args}
        label="Polling station"
        value="St Mary's Primary School, Hall B"
        helperText="Assigned by your presiding officer."
        disabled
      />
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Stack gap="lg">
      <ControlledTextField {...args} leadingIcon="mail" helperText={undefined} />
      <ControlledTextField
        {...args}
        label="Credential code"
        placeholder="e.g. 7F3K-92QD"
        helperText="Scan the QR code on the credential or type it in."
        leadingIcon="id-card"
        trailingAction={{ icon: 'qr', label: 'Scan QR code', onPress: () => {} }}
        autoCapitalize="characters"
      />
      <ControlledTextField
        {...args}
        label="Location"
        value="Northshire, Ward 12"
        helperText={undefined}
        trailingIcon="location"
      />
    </Stack>
  ),
};

export const Password: Story = {
  args: {
    label: 'Password',
    value: 'correct horse',
    placeholder: undefined,
    helperText: 'At least 12 characters.',
    secureTextEntry: true,
    leadingIcon: 'lock',
    autoComplete: 'current-password',
  },
};

export const MultilineWithCounter: Story = {
  args: {
    label: 'What happened?',
    value: 'Ballot box seal at desk 3 was found broken at 07:40, before polls opened.',
    placeholder: 'Describe the incident, including times and who was present.',
    helperText: 'Do not include voters’ personal details.',
    multiline: true,
    numberOfLines: 5,
    maxLength: 500,
    required: true,
  },
};

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text variant="headingLg">Sign in to NOMOS</Text>
        <Text color="secondary">Northshire Electoral Commission workplace</Text>
      </Stack>
      <TextField
        label="Work email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(undefined);
        }}
        placeholder="name@northshire.gov"
        leadingIcon="mail"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        errorText={error}
        required
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        leadingIcon="lock"
        autoComplete="current-password"
        secureTextEntry
        required
      />
      <Checkbox
        checked={remember}
        onChange={setRemember}
        label="Remember this device"
        description="Only on a phone that is yours and has a screen lock."
      />
      <Button
        label="Sign in"
        fullWidth
        onPress={() => {
          if (!email.includes('@')) setError('Enter your work email address');
        }}
      />
    </Stack>
  );
}

export const SignIn: Story = {
  render: () => <SignInForm />,
};

function IncidentReportForm() {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  return (
    <Stack gap="lg">
      <Text variant="headingMd">Report an incident</Text>
      <Text color="secondary">
        Visible to your presiding officer and Northshire Electoral Commission staff only.
      </Text>
      <TextField
        label="Short summary"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Queue blocking the station entrance"
        maxLength={80}
        required
      />
      <TextField
        label="What happened?"
        value={details}
        onChangeText={setDetails}
        placeholder="Include times, locations and who was present."
        helperText="Do not include voters’ personal details."
        multiline
        numberOfLines={6}
        maxLength={1000}
        required
      />
      <Button label="Submit report" leadingIcon="send" fullWidth />
    </Stack>
  );
}

export const IncidentReport: Story = {
  render: () => <IncidentReportForm />,
};
