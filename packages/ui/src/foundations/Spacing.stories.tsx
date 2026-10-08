import type { Radius, Space as SpaceKey } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { makeStyles, useTheme } from '../theme';
import { Grid, Section, Tile } from './helpers';

const meta = {
  title: 'Foundations/Spacing',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const radiusUsage: Partial<Record<Radius, string>> = {
  md: 'Buttons, inputs',
  lg: 'Cards',
  xxl: 'Sheets, dialogs',
  full: 'Pills, avatars',
};

function SpaceScale() {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <Section
      title="Space"
      description="A 4-point grid for padding, margin and gap. Stack's gap and padding props take these keys."
    >
      <Stack gap="sm">
        {(Object.keys(theme.space) as SpaceKey[]).map((key) => (
          <Stack key={key} direction="row" align="center" gap="md">
            <View style={[styles.bar, { width: theme.space[key] }]} />
            <Text variant="labelSm">{`space.${key}`}</Text>
            <Text variant="caption" color="secondary">
              {String(theme.space[key])}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Section>
  );
}

function RadiusScale() {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <Section title="Radii" description="Corner radii. full makes a pill or a circle.">
      <Grid>
        {(Object.keys(theme.radii) as Radius[]).map((key) => (
          <Tile
            key={key}
            name={`radii.${key}`}
            detail={[String(theme.radii[key]), radiusUsage[key]].filter(Boolean).join(' · ')}
          >
            <View style={[styles.box, { borderRadius: theme.radii[key] }]} />
          </Tile>
        ))}
      </Grid>
    </Section>
  );
}

export const Space: Story = {
  render: () => <SpaceScale />,
};

export const Radii: Story = {
  render: () => <RadiusScale />,
};

const useStyles = makeStyles((t) => ({
  bar: {
    height: t.space.lg,
    borderRadius: t.radii.xs,
    backgroundColor: t.colors.accent.solid,
  },
  box: {
    width: t.space.xxxl,
    height: t.space.xxxl,
    borderWidth: t.borderWidths.thick,
    borderColor: t.colors.accent.border,
    backgroundColor: t.colors.accent.subtle,
  },
}));
