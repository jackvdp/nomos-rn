import { sizes, type IconSize } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';

import { useTheme } from '../../theme';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Icon, iconGlyphs, type IconName } from './Icon';

const iconSizes = Object.keys(sizes.icon) as IconSize[];

const meta = {
  title: 'Display/Icon',
  component: Icon,
  args: {
    name: 'verified',
    size: 'lg',
  },
  argTypes: {
    name: { control: 'select', options: Object.keys(iconGlyphs) as IconName[] },
    size: { control: 'select', options: iconSizes },
    color: { control: 'color' },
    'aria-label': { control: 'text' },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" align="flex-end" gap="lg">
      {iconSizes.map((size) => (
        <Stack key={size} align="center" gap="xs">
          <Icon {...args} size={size} />
          <Text variant="caption" color="secondary">
            {`${size} · ${sizes.icon[size]}`}
          </Text>
        </Stack>
      ))}
    </Stack>
  ),
};

function ColorsDemo({ name }: { name: IconName }) {
  const { colors } = useTheme();
  const swatches = [
    { label: 'text.primary', color: colors.text.primary },
    { label: 'text.secondary', color: colors.text.secondary },
    { label: 'text.link', color: colors.text.link },
    { label: 'tone.success.solid', color: colors.tone.success.solid },
    { label: 'tone.warning.onSubtle', color: colors.tone.warning.onSubtle },
    { label: 'tone.danger.solid', color: colors.tone.danger.solid },
  ];
  return (
    <Stack gap="sm">
      {swatches.map(({ label, color }) => (
        <Stack key={label} direction="row" align="center" gap="sm">
          <Icon name={name} color={color} />
          <Text variant="bodySm">{label}</Text>
        </Stack>
      ))}
    </Stack>
  );
}

export const Colors: Story = {
  render: (args) => <ColorsDemo name={args.name} />,
};

/**
 * Next to text, an icon is decorative and stays hidden from screen readers.
 * On its own it carries meaning, so it needs a label.
 */
function LabelledDemo() {
  const { colors } = useTheme();
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text variant="labelSm" color="secondary">
          Decorative: the text says it all
        </Text>
        <Stack direction="row" align="center" gap="xs">
          <Icon name="location" size="sm" color={colors.text.secondary} />
          <Text variant="bodySm" color="secondary">
            Station 12, Riverside Community Hall
          </Text>
        </Stack>
      </Stack>
      <Stack gap="xs">
        <Text variant="labelSm" color="secondary">
          Labelled: the icon stands alone
        </Text>
        <Stack direction="row" align="center" gap="xs">
          <Text variant="bodyStrong">Amara Okafor</Text>
          <Icon name="verified" size="sm" color={colors.accent.solid} aria-label="Verified" />
        </Stack>
      </Stack>
    </Stack>
  );
}

export const LabelledVsDecorative: Story = {
  name: 'Labelled vs decorative',
  render: () => <LabelledDemo />,
};

function CredentialNotice() {
  const { colors } = useTheme();
  return (
    <Stack direction="row" align="center" gap="sm">
      <Icon name="warning" color={colors.tone.warning.onSubtle} />
      <Text variant="bodyStrong">Credential expires in 14 days</Text>
    </Stack>
  );
}

export const WithText: Story = {
  render: () => <CredentialNotice />,
};
