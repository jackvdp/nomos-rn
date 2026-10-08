import { palette, type ColorTokens, type ToneColors } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { makeStyles, useTheme } from '../theme';
import { flattenTokens, Grid, Note, Page, Section, Swatch } from './helpers';

const meta = {
  title: 'Foundations/Colors',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const placeholderNote =
  'Brand hexes are placeholders. NOMOS is navy and cyan, but the exact brand values have not been supplied yet; every colour here derives from navy 700 and cyan 500 and will shift when they arrive.';

const groups: { key: keyof ColorTokens; description: string }[] = [
  {
    key: 'bg',
    description: 'Backgrounds, from the canvas behind cards to the scrim behind modals.',
  },
  {
    key: 'text',
    description: 'Text and icon colours. Use inverse on bg.inverse and onBrand on bg.brand.',
  },
  { key: 'border', description: 'Dividers, card outlines, input outlines and the focus ring.' },
  { key: 'action', description: 'Button fills, pressed fills, labels and outlines per variant.' },
  { key: 'control', description: 'Checkbox, radio and switch.' },
  { key: 'accent', description: 'Cyan emphasis that is not a status.' },
  {
    key: 'tone',
    description:
      'Status colours for Tag, Badge, Banner and Toast. Always pair with an icon or text.',
  },
  {
    key: 'context',
    description:
      'Organisation, Network and Workspace. Our proposal, not a NOMOS decision; always shown with the context icon and name.',
  },
  { key: 'skeleton', description: 'Loading placeholders.' },
];

/** Groups whose children are themselves colour sets get one sub-section per child. */
const nestedGroups: ReadonlySet<keyof ColorTokens> = new Set(['action', 'tone', 'context']);

function isToneColors(value: object): value is ToneColors {
  return 'solid' in value && 'onSubtle' in value;
}

/** Shows a tone set as it is used: text on the solid fill and on the subtle fill. */
function TonePreview({ colors }: { colors: ToneColors }) {
  const styles = useStyles();
  return (
    <Stack direction="row" wrap gap="sm">
      <View style={[styles.pill, { backgroundColor: colors.solid, borderColor: colors.solid }]}>
        <Text variant="labelSm" style={{ color: colors.onSolid }}>
          solid / onSolid
        </Text>
      </View>
      <View style={[styles.pill, { backgroundColor: colors.subtle, borderColor: colors.border }]}>
        <Text variant="labelSm" style={{ color: colors.onSubtle }}>
          subtle / onSubtle / border
        </Text>
      </View>
    </Stack>
  );
}

function ColorSet({ value, path }: { value: object; path: string }) {
  return (
    <Stack gap="sm">
      {isToneColors(value) ? <TonePreview colors={value} /> : null}
      <Grid>
        {flattenTokens(value, path).map((token) => (
          <Swatch key={token.path} name={token.path} color={token.value} />
        ))}
      </Grid>
    </Stack>
  );
}

function SemanticColors() {
  const theme = useTheme();
  return (
    <Page
      title="Colours"
      intro={`Semantic colours for the ${theme.colorScheme} scheme. Components read these, never the raw palette. Switch the theme to compare.`}
    >
      <Note>{placeholderNote}</Note>
      {groups.map(({ key, description }) => {
        const value = theme.colors[key];
        return (
          <Section key={key} title={`colors.${key}`} description={description}>
            {nestedGroups.has(key) ? (
              <Stack gap="xl">
                {Object.entries(value).map(([name, set]) => (
                  <Stack key={name} gap="sm">
                    <Text variant="label" color="secondary">
                      {name}
                    </Text>
                    <ColorSet value={set} path={`colors.${key}.${name}`} />
                  </Stack>
                ))}
              </Stack>
            ) : (
              <ColorSet value={value} path={`colors.${key}`} />
            )}
          </Section>
        );
      })}
    </Page>
  );
}

const anchors: Record<string, string> = {
  'navy.700': 'Brand anchor (placeholder)',
  'cyan.500': 'Brand anchor (placeholder)',
};

function PaletteScales() {
  return (
    <Page
      title="Palette"
      intro="Raw scales from @nomos/tokens. Components never use these directly; they go through the semantic colours, so a scale can be retuned without touching component code."
    >
      <Note>{placeholderNote}</Note>
      {Object.entries(palette).map(([scale, steps]) => (
        <Section key={scale} title={`palette.${scale}`}>
          <Grid>
            {Object.entries(steps).map(([step, hex]) => (
              <Swatch
                key={step}
                name={`${scale}.${step}`}
                color={hex}
                note={anchors[`${scale}.${step}`]}
              />
            ))}
          </Grid>
        </Section>
      ))}
    </Page>
  );
}

export const Semantic: Story = {
  render: () => <SemanticColors />,
};

export const Palette: Story = {
  render: () => <PaletteScales />,
};

const useStyles = makeStyles((t) => ({
  pill: {
    paddingHorizontal: t.space.md,
    paddingVertical: t.space.xs,
    borderRadius: t.radii.full,
    borderWidth: t.borderWidths.thin,
  },
}));
