import type { Space } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { lightTheme, makeStyles, useTheme } from '../../theme';
import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { IconButton } from '../IconButton';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Screen } from './Screen';

const meta = {
  title: 'Layout/Screen',
  component: Screen,
  parameters: { fullscreen: true },
  args: {
    scroll: true,
    padding: 'lg',
    edges: ['top', 'bottom'],
  },
  argTypes: {
    padding: { control: 'select', options: Object.keys(lightTheme.space) as Space[] },
    edges: { control: 'check', options: ['top', 'right', 'bottom', 'left'] },
    keyboardVerticalOffset: { control: 'number' },
  },
} satisfies Meta<typeof Screen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Screen {...args} footer={<Button label="Confirm availability" fullWidth />}>
      <Stack gap="md">
        <Text variant="headingLg">Election day shifts</Text>
        <Text color="secondary">
          Choose the shifts you can cover at Station 12. Your presiding officer confirms the rota by
          Friday.
        </Text>
      </Stack>
    </Screen>
  ),
};

function AppBar({ title }: { title: string }) {
  return (
    <Stack direction="row" align="center" gap="xs" paddingHorizontal="xs" paddingVertical="xs">
      <IconButton icon="arrow-back" aria-label="Back" />
      <Stack fill>
        <Text variant="headingSm" numberOfLines={1}>
          {title}
        </Text>
      </Stack>
      <IconButton icon="edit" aria-label="Edit profile" />
      <IconButton icon="more-vertical" aria-label="More options" />
    </Stack>
  );
}

function CredentialRow({
  icon,
  title,
  detail,
  warning,
}: {
  icon: IconName;
  title: string;
  detail: string;
  warning?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Stack direction="row" gap="md" align="flex-start">
      <Icon name={icon} color={warning ? colors.tone.warning.onSubtle : colors.accent.solid} />
      <Stack gap="xxs" fill>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="bodySm" color="secondary">
          {detail}
        </Text>
      </Stack>
    </Stack>
  );
}

function ProfileScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <Screen
      scroll
      header={<AppBar title="Profile" />}
      footer={<Button label="Share credential" leadingIcon="qr" fullWidth />}
    >
      <Stack gap="xl">
        <Stack align="center" gap="sm">
          <View style={styles.avatar}>
            <Text variant="headingLg" color="onBrand">
              AO
            </Text>
          </View>
          <Stack direction="row" align="center" gap="xs">
            <Text variant="headingLg">Amara Okafor</Text>
            <Icon name="verified" color={colors.accent.solid} aria-label="Verified" />
          </Stack>
          <Text color="secondary" align="center">
            Presiding officer · Northshire Electoral Commission
          </Text>
        </Stack>

        <Stack gap="sm">
          <Text variant="overline" color="secondary">
            Credentials
          </Text>
          <Stack gap="lg" style={styles.card}>
            <CredentialRow
              icon="verified"
              title="Presiding officer certificate"
              detail="Verified by Northshire Electoral Commission"
            />
            <CredentialRow
              icon="school"
              title="Poll worker training: Module 3"
              detail="Completed 2 September 2026"
            />
            <CredentialRow
              icon="warning"
              title="Data protection refresher"
              detail="Credential expires in 14 days"
              warning
            />
          </Stack>
        </Stack>

        <Stack gap="sm">
          <Text variant="overline" color="secondary">
            About
          </Text>
          <Stack gap="md" style={styles.card}>
            <Text>
              Eight years running polling stations in Riverside ward. Happy to mentor new poll
              workers before election day.
            </Text>
            <Stack direction="row" align="center" gap="sm">
              <Icon name="location" size="sm" color={colors.text.secondary} />
              <Text variant="bodySm" color="secondary">
                Station 12, Riverside Community Hall
              </Text>
            </Stack>
            <Stack direction="row" align="center" gap="sm">
              <Icon name="people" size="sm" color={colors.text.secondary} />
              <Text variant="bodySm" color="secondary">
                Works with Daniel Mwangi and Priya Raman
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Screen>
  );
}

export const Profile: Story = {
  render: () => <ProfileScreen />,
};

function ConfirmationScreen() {
  const { colors } = useTheme();
  return (
    <Screen footer={<Button label="Done" fullWidth />}>
      <Stack fill align="center" justify="center" gap="md">
        <Icon name="check-circle" size="xl" color={colors.tone.success.solid} />
        <Text variant="headingMd" align="center">
          You are on the rota
        </Text>
        <Text color="secondary" align="center">
          Station 12, Riverside Community Hall. 14 November, 06:30 to 14:00.
        </Text>
      </Stack>
    </Screen>
  );
}

export const Static: Story = {
  render: () => <ConfirmationScreen />,
};

const useStyles = makeStyles((t) => ({
  avatar: {
    width: t.sizes.avatar.xl,
    height: t.sizes.avatar.xl,
    borderRadius: t.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.bg.brand,
  },
  card: {
    padding: t.space.lg,
    borderRadius: t.radii.lg,
    backgroundColor: t.colors.bg.surface,
    boxShadow: t.shadows.sm,
  },
}));
