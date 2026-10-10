import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useState } from 'react';

import { Stack } from '../Stack';
import { Button, type ButtonProps } from './Button';

// Loads for two seconds after each press, to show the spinner arriving.
function LoadsWhenPressed(props: ButtonProps) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [loading]);
  return (
    <Button
      {...props}
      loading={loading}
      onPress={(event) => {
        setLoading(true);
        props.onPress?.(event);
      }}
    />
  );
}

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: {
    label: 'Continue',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap="md">
      <Button {...args} variant="primary" label="Primary" />
      <Button {...args} variant="secondary" label="Secondary" />
      <Button {...args} variant="tertiary" label="Tertiary" />
      <Button {...args} variant="danger" label="Revoke credential" leadingIcon="trash" />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="md">
      <Button {...args} size="sm" label="Small" />
      <Button {...args} size="md" label="Medium" />
      <Button {...args} size="lg" label="Large" />
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Stack gap="md">
      <Button {...args} label="New post" leadingIcon="add" />
      <Button {...args} variant="secondary" label="Share credential" leadingIcon="qr" />
      <Button {...args} variant="tertiary" label="See all" trailingIcon="chevron-forward" />
    </Stack>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="md">
      <Button {...args} label="Saving" loading />
      <Button {...args} label="Disabled" disabled />
      <Button {...args} variant="secondary" label="Disabled" disabled />
    </Stack>
  ),
};

export const LoadsOnPress: Story = {
  args: { label: 'Save changes' },
  render: (args) => <LoadsWhenPressed {...args} />,
};

export const FullWidth: Story = {
  args: { fullWidth: true, label: 'Sign in' },
};
