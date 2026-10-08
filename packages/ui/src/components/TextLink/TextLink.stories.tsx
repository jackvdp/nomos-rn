import { textVariants, type TextVariant } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';

import { Stack } from '../Stack';
import { Text } from '../Text';
import { TextLink } from './TextLink';

const meta = {
  title: 'Actions/TextLink',
  component: TextLink,
  args: {
    children: 'Polling station guide',
    variant: 'body',
  },
  argTypes: {
    variant: { control: 'select', options: Object.keys(textVariants) as TextVariant[] },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof TextLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Nested in a paragraph, the link inherits the paragraph's type style. */
export const Inline: Story = {
  render: (args) => (
    <Stack gap="lg">
      <Text>
        Read the <TextLink onPress={args.onPress}>polling station guide</TextLink> before your first
        shift.
      </Text>
      <Text variant="bodySm" color="secondary">
        Questions about your rota? Contact <TextLink onPress={args.onPress}>Priya Raman</TextLink>,
        your station coordinator.
      </Text>
      <Text variant="caption" color="tertiary">
        Updated 5 minutes ago · <TextLink onPress={args.onPress}>View history</TextLink>
      </Text>
    </Stack>
  ),
};

export const Standalone: Story = {
  render: (args) => (
    <Stack gap="md" align="flex-start">
      <TextLink {...args} variant="body">
        Forgot your password?
      </TextLink>
      <TextLink {...args} variant="label">
        See all training modules
      </TextLink>
      <TextLink {...args} variant="bodySm">
        Why do we ask for this?
      </TextLink>
    </Stack>
  ),
};

/** Consent copy under the sign-in form. */
export const ConsentNotice: Story = {
  render: (args) => (
    <Text variant="bodySm" color="secondary" align="center">
      By continuing you agree to the NOMOS{' '}
      <TextLink onPress={args.onPress}>Code of conduct</TextLink> and{' '}
      <TextLink onPress={args.onPress}>Privacy notice</TextLink>. Your organisation can see your
      verified credentials.
    </Text>
  ),
};
