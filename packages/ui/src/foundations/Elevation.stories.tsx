import type { ShadowTokens } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { makeStyles, useTheme } from '../theme';
import { Page } from './helpers';

const meta = {
  title: 'Foundations/Elevation',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const levels: {
  shadow: Exclude<keyof ShadowTokens, 'none'>;
  surface: 'surface' | 'raised';
  usage: string;
}[] = [
  { shadow: 'sm', surface: 'surface', usage: 'Cards and list groups resting on the canvas.' },
  { shadow: 'md', surface: 'raised', usage: 'Menus, popovers and sticky bars.' },
  { shadow: 'lg', surface: 'raised', usage: 'Sheets, dialogs and toasts above the page.' },
];

function Shadows() {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <Page
      title="Elevation"
      intro="Shadows are CSS box-shadow strings, which React Native supports on the New Architecture: style={{ boxShadow: theme.shadows.sm }}. In dark mode, elevation reads mostly from the lighter bg.raised surface."
    >
      <Stack gap="xl">
        {levels.map(({ shadow, surface, usage }) => (
          <View
            key={shadow}
            style={[
              styles.card,
              { boxShadow: theme.shadows[shadow], backgroundColor: theme.colors.bg[surface] },
            ]}
          >
            <Text variant="headingSm">{`shadows.${shadow}`}</Text>
            <Text variant="caption" color="tertiary">{`on colors.bg.${surface}`}</Text>
            <Text variant="bodySm" color="secondary">
              {usage}
            </Text>
          </View>
        ))}
      </Stack>
    </Page>
  );
}

export const Elevation: Story = {
  render: () => <Shadows />,
};

const useStyles = makeStyles((t) => ({
  card: {
    gap: t.space.xs,
    padding: t.space.lg,
    borderRadius: t.radii.lg,
  },
}));
