import { fontWeight, textVariants, type FontWeight, type TextVariant } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { lightTheme, makeStyles, useTheme } from '../../theme';
import { Stack } from '../Stack';
import { Text, type TextColor } from './Text';

const variants = Object.keys(textVariants) as TextVariant[];
const colors = Object.keys(lightTheme.colors.text) as TextColor[];
const weights = Object.keys(fontWeight) as FontWeight[];

const meta = {
  title: 'Typography/Text',
  component: Text,
  args: {
    children: 'Poll worker training: Module 3',
    variant: 'body',
    color: 'primary',
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    color: { control: 'select', options: colors },
    weight: { control: 'select', options: weights },
    align: { control: 'select', options: ['auto', 'left', 'center', 'right', 'justify'] },
    numberOfLines: { control: 'number' },
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap="md">
      {variants.map((variant) => (
        <Text key={variant} {...args} variant={variant}>
          {variant}
        </Text>
      ))}
    </Stack>
  ),
};

/** `inverse` and `onBrand` are shown on the backgrounds they are meant for. */
function ColorsDemo() {
  const theme = useTheme();
  const styles = useStyles();
  const backgrounds: Partial<Record<TextColor, string>> = {
    inverse: theme.colors.bg.inverse,
    onBrand: theme.colors.bg.brand,
  };
  return (
    <Stack gap="sm">
      {colors.map((color) => (
        <View
          key={color}
          style={[styles.colorRow, backgrounds[color] && { backgroundColor: backgrounds[color] }]}
        >
          <Text color={color} variant="bodyStrong">
            {color}
          </Text>
        </View>
      ))}
    </Stack>
  );
}

export const Colors: Story = {
  render: () => <ColorsDemo />,
};

export const Weights: Story = {
  render: (args) => (
    <Stack gap="sm">
      {weights.map((weight) => (
        <Text key={weight} {...args} weight={weight}>
          {`${weight}: Amara Okafor, Presiding officer`}
        </Text>
      ))}
    </Stack>
  ),
};

/** Heading variants get `role="heading"`, so screen-reader users can jump between them. */
export const Headings: Story = {
  render: () => (
    <Stack gap="sm">
      <Text variant="headingLg">Northshire Electoral Commission</Text>
      <Text color="secondary">Workplace for poll workers and commission staff.</Text>
      <Text variant="headingMd">Upcoming training</Text>
      <Text variant="headingSm">Poll worker training: Module 3</Text>
      <Text>Opening the polling station, checking seals and logging ballot papers.</Text>
    </Stack>
  ),
};

export const Truncation: Story = {
  render: () => (
    <Stack gap="md">
      <Text numberOfLines={1}>
        Reminder for presiding officers: collect the ballot box keys from the returning officer
        at the district office before 18:00 on Wednesday.
      </Text>
      <Text numberOfLines={2} variant="bodySm" color="secondary">
        Reminder for presiding officers: collect the ballot box keys from the returning officer
        at the district office before 18:00 on Wednesday, and sign the custody log.
      </Text>
    </Stack>
  ),
};

/** A post as it appears in the organisation's workplace feed. */
export const Announcement: Story = {
  render: () => (
    <Stack gap="xs">
      <Text variant="overline" color="secondary">
        Northshire Electoral Commission
      </Text>
      <Text variant="headingSm">Polling station rota published</Text>
      <Text>
        The rota for the 14 November election is now available. Check your station and shift,
        and <Text variant="bodyStrong">confirm by Friday</Text>.
      </Text>
      <Text variant="caption" color="tertiary">
        Priya Raman · 2 hours ago
      </Text>
    </Stack>
  ),
};

const useStyles = makeStyles((t) => ({
  colorRow: {
    paddingHorizontal: t.space.md,
    paddingVertical: t.space.sm,
    borderRadius: t.radii.sm,
    backgroundColor: t.colors.bg.surface,
  },
}));
