import { fontWeight, type FontWeight, type TextVariant } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';
import type { TextStyle } from 'react-native';

import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { useTheme } from '../theme';
import { Page, Section } from './helpers';

const meta = {
  title: 'Foundations/Typography',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const weights = Object.keys(fontWeight) as FontWeight[];

const weightName = Object.fromEntries(
  Object.entries(fontWeight).map(([name, value]) => [value, name]),
) as Record<string, FontWeight>;

const samples: Record<TextVariant, { text: string; usage: string }> = {
  display: {
    text: '1,284 poll workers',
    usage: 'One per screen at most: hero numbers, onboarding.',
  },
  headingLg: { text: 'Northshire Electoral Commission', usage: 'Screen titles.' },
  headingMd: { text: 'Upcoming training', usage: 'Section headings.' },
  headingSm: { text: 'Poll worker training: Module 3', usage: 'Card and dialog titles.' },
  bodyLg: {
    text: 'Polling stations open at 7:00 and close at 22:00.',
    usage: 'Lead paragraphs and roomy reading.',
  },
  body: {
    text: 'Presiding officers check the ballot box seals before the first voter arrives.',
    usage: 'Default for paragraphs and list rows.',
  },
  bodyStrong: { text: 'Credential expires in 14 days', usage: 'Emphasis inside body text.' },
  bodySm: {
    text: 'Amara Okafor shared this with your workplace.',
    usage: 'Secondary rows and dense lists.',
  },
  label: { text: 'Continue', usage: 'Buttons, tabs, field labels.' },
  labelSm: { text: 'See all', usage: 'Small buttons, chips.' },
  caption: { text: 'Updated 5 minutes ago', usage: 'Timestamps, helper text, metadata.' },
  overline: { text: 'Organisation', usage: 'Eyebrows above titles and group labels.' },
};

function formatStyle(style: TextStyle): string {
  const parts = [`${style.fontSize}/${style.lineHeight}`];
  if (style.fontWeight) parts.push(`${weightName[String(style.fontWeight)]} ${style.fontWeight}`);
  if (style.letterSpacing) parts.push(`tracking ${style.letterSpacing}`);
  if (style.textTransform) parts.push(style.textTransform);
  if (style.fontFamily) parts.push(style.fontFamily);
  return parts.join(' · ');
}

function TypeScale() {
  const { typography } = useTheme();
  return (
    <Page
      title="Typography"
      intro="Every text variant with size/line height, weight and tracking. The font is the platform default (San Francisco on iOS, Roboto on Android) until NOMOS supplies a brand typeface. Headings are announced as headings by screen readers."
    >
      <Stack gap="xl">
        {(Object.keys(typography) as TextVariant[]).map((variant) => (
          <Stack key={variant} gap="xxs">
            <Text variant="caption" color="tertiary">
              {`${variant} · ${formatStyle(typography[variant])}`}
            </Text>
            <Text variant={variant}>{samples[variant].text}</Text>
            <Text variant="bodySm" color="secondary">
              {samples[variant].usage}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Page>
  );
}

export const Scale: Story = {
  render: () => <TypeScale />,
};

export const Weights: Story = {
  render: () => (
    <Section
      title="Font weights"
      description="Variants set their own weight; Text's weight prop overrides it when needed."
    >
      <Stack gap="md">
        {weights.map((weight) => (
          <Stack key={weight} gap="xxs">
            <Text variant="caption" color="tertiary">{`${weight} · ${fontWeight[weight]}`}</Text>
            <Text weight={weight}>Daniel Mwangi, Presiding officer</Text>
          </Stack>
        ))}
      </Stack>
    </Section>
  ),
};
