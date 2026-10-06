import type { Space } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { lightTheme, makeStyles } from '../../theme';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { Stack } from './Stack';

const spaceKeys = Object.keys(lightTheme.space) as Space[];

/** A labelled block so layout is visible. */
function Box({ label }: { label: string }) {
  const styles = useStyles();
  return (
    <View style={styles.box}>
      <Text variant="labelSm" style={styles.boxText}>
        {label}
      </Text>
    </View>
  );
}

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: {
    direction: 'column',
    gap: 'md',
    padding: 'none',
    wrap: false,
    fill: false,
  },
  argTypes: {
    direction: { control: 'select', options: ['column', 'row'] },
    gap: { control: 'select', options: spaceKeys },
    padding: { control: 'select', options: spaceKeys },
    paddingHorizontal: { control: 'select', options: spaceKeys },
    paddingVertical: { control: 'select', options: spaceKeys },
    align: {
      control: 'select',
      options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
    },
    justify: {
      control: 'select',
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
    },
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="One" />
      <Box label="Two" />
      <Box label="Three" />
    </Stack>
  ),
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Direction: Story = {
  render: () => (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="labelSm" color="secondary">
          column (default)
        </Text>
        <Stack gap="sm">
          <Box label="One" />
          <Box label="Two" />
        </Stack>
      </Stack>
      <Stack gap="xs">
        <Text variant="labelSm" color="secondary">
          row
        </Text>
        <Stack direction="row" gap="sm">
          <Box label="One" />
          <Box label="Two" />
        </Stack>
      </Stack>
    </Stack>
  ),
};

export const Gap: Story = {
  render: () => (
    <Stack gap="lg">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((gap) => (
        <Stack key={gap} gap="xs">
          <Text
            variant="labelSm"
            color="secondary"
          >{`gap="${gap}" (${lightTheme.space[gap]})`}</Text>
          <Stack direction="row" gap={gap}>
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};

function Frame({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <View style={styles.frame}>{children}</View>;
}

export const AlignAndJustify: Story = {
  name: 'Align and justify',
  render: () => (
    <Stack gap="lg">
      {(
        [
          ['flex-start', 'flex-start'],
          ['center', 'center'],
          ['flex-end', 'space-between'],
        ] as const
      ).map(([align, justify]) => (
        <Stack key={align} gap="xs">
          <Text variant="labelSm" color="secondary">{`align="${align}" justify="${justify}"`}</Text>
          <Frame>
            <Stack direction="row" gap="sm" align={align} justify={justify} fill>
              <Box label="One" />
              <Box label="Two" />
            </Stack>
          </Frame>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Wrap: Story = {
  render: () => (
    <Stack direction="row" gap="sm" wrap>
      {[
        'Poll worker',
        'Presiding officer',
        'Count supervisor',
        'Polling clerk',
        'Returning officer',
        'Trainer',
        'Logistics',
      ].map((role) => (
        <Box key={role} label={role} />
      ))}
    </Stack>
  ),
};

/** A member header: initials, name and role side by side, actions below. */
function MemberHeader() {
  const styles = useStyles();
  return (
    <Stack gap="lg" padding="lg" style={styles.card}>
      <Stack direction="row" align="center" gap="md">
        <View style={styles.initials}>
          <Text variant="label" color="onBrand">
            DM
          </Text>
        </View>
        <Stack gap="xxs" fill>
          <Stack direction="row" align="center" gap="xs">
            <Text variant="headingSm">Daniel Mwangi</Text>
            <Icon name="verified" size="sm" aria-label="Verified" />
          </Stack>
          <Text variant="bodySm" color="secondary">
            Presiding officer · Northshire Electoral Commission
          </Text>
        </Stack>
      </Stack>
      <Stack direction="row" gap="sm" wrap>
        <Button label="Message" leadingIcon="chat" size="sm" />
        <Button label="View credential" variant="secondary" leadingIcon="id-card" size="sm" />
      </Stack>
    </Stack>
  );
}

export const MemberCard: Story = {
  render: () => <MemberHeader />,
};

const useStyles = makeStyles((t) => ({
  box: {
    paddingHorizontal: t.space.md,
    paddingVertical: t.space.sm,
    borderRadius: t.radii.sm,
    borderWidth: t.borderWidths.thin,
    borderColor: t.colors.accent.border,
    backgroundColor: t.colors.accent.subtle,
  },
  boxText: {
    color: t.colors.accent.onSubtle,
  },
  frame: {
    height: t.space.huge + t.space.xl,
    padding: t.space.sm,
    borderRadius: t.radii.md,
    borderWidth: t.borderWidths.thin,
    borderStyle: 'dashed',
    borderColor: t.colors.border.strong,
  },
  card: {
    borderRadius: t.radii.lg,
    backgroundColor: t.colors.bg.surface,
    boxShadow: t.shadows.sm,
  },
  initials: {
    width: t.sizes.avatar.md,
    height: t.sizes.avatar.md,
    borderRadius: t.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.bg.brand,
  },
}));
