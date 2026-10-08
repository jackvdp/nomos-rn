import { sizes, type IconSize } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';

import { Icon, iconGlyphs, type IconName } from '../components/Icon';
import { Grid, Page, Section, Tile } from './helpers';

const meta = {
  title: 'Foundations/Icons',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const names = Object.keys(iconGlyphs) as IconName[];
const iconSizes = Object.keys(sizes.icon) as IconSize[];

export const All: Story = {
  render: () => (
    <Page
      title="Icons"
      intro={`${names.length} icons, named by meaning rather than glyph. They map to Ionicons today, so a NOMOS icon set can replace it without changing call sites. Arrows, back/forward chevrons, send and log out mirror in right-to-left layouts.`}
    >
      <Grid>
        {names.map((name) => (
          <Tile key={name} name={name} detail={iconGlyphs[name]}>
            <Icon name={name} size="lg" />
          </Tile>
        ))}
      </Grid>
    </Page>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section
      title="Sizes"
      description="sizes.icon. md (20) is the default; buttons use md, or lg at the large size."
    >
      <Grid>
        {iconSizes.map((size) => (
          <Tile key={size} name={size} detail={`${sizes.icon[size]} dp`}>
            <Icon name="verified" size={size} />
          </Tile>
        ))}
      </Grid>
    </Section>
  ),
};
