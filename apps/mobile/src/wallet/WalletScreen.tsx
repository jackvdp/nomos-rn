import {
  Banner,
  Card,
  EmptyState,
  Icon,
  makeStyles,
  Screen,
  Skeleton,
  Stack,
  Tag,
  Text,
  useTheme,
  type IconName,
} from '@nomos/ui';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { useCredentials } from './useCredentials';
import type { Credential, CredentialStatus } from './walletApi';

// The screen's wording in one place, ready to move into translations.
const copy = {
  title: 'Wallet',
  intro: 'The credentials issued to you.',
  loading: 'Loading your credentials',
  untyped: 'Credential',
  received: (date: string) => `Received ${date}`,
  expires: (date: string) => `Expires ${date}`,
  emptyTitle: 'No credentials yet',
  emptyDescription: 'When an organisation issues you a credential, it will appear here.',
  failedTitle: 'We could not load your credentials',
  failed: 'Check your connection and try again.',
  retry: 'Try again',
  refreshFailed: 'We could not refresh your credentials. This list may be out of date.',
};

const statusTags: Record<
  CredentialStatus,
  { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral'; icon: IconName }
> = {
  active: { label: 'Active', tone: 'success', icon: 'check-circle' },
  expired: { label: 'Expired', tone: 'warning', icon: 'time' },
  revoked: { label: 'Revoked', tone: 'danger', icon: 'close-circle' },
  deleted: { label: 'Deleted', tone: 'neutral', icon: 'trash' },
  unknown: { label: 'Status unknown', tone: 'neutral', icon: 'info' },
};

const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** The credentials in the user's wallet, fetched afresh each time the tab is opened. */
export function WalletScreen() {
  const styles = useStyles();
  const { credentials, error, loading, reload } = useCredentials();
  // Whether the user has pulled the list down and is waiting for it.
  const [refreshing, setRefreshing] = useState(false);

  // A credential can be revoked at any time, so the list is not trusted for
  // longer than the tab stays open.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  async function refresh() {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }

  return (
    // The bottom edge is the tab bar's, and the list keeps clear of that itself.
    <Screen edges={['top']} padding="none">
      <FlatList
        data={credentials}
        keyExtractor={(credential) => credential.id}
        renderItem={({ item }) => <CredentialCard credential={item} />}
        contentContainerStyle={styles.content}
        // iOS: the tab bar floats over the bottom of the screen, so the list
        // has to end above it.
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <Stack gap="lg">
            <Stack gap="xs">
              <Text variant="headingLg">{copy.title}</Text>
              <Text color="secondary">{copy.intro}</Text>
            </Stack>
            {/* The last list is still showing, so say that it may be stale. */}
            {credentials && error ? <Banner tone="warning" message={copy.refreshFailed} /> : null}
          </Stack>
        }
        ListHeaderComponentStyle={styles.header}
        ListEmptyComponent={
          credentials ? (
            <EmptyState
              icon="id-card"
              title={copy.emptyTitle}
              description={copy.emptyDescription}
            />
          ) : loading ? (
            <LoadingCards />
          ) : (
            <EmptyState
              icon="warning"
              tone="warning"
              title={copy.failedTitle}
              description={error?.kind === 'refused' ? error.message : copy.failed}
              action={{ label: copy.retry, onPress: reload, leadingIcon: 'refresh' }}
            />
          )
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      />
    </Screen>
  );
}

function CredentialCard({ credential }: { credential: Credential }) {
  const theme = useTheme();
  const styles = useStyles();
  const tag = statusTags[credential.status];
  const dates = [
    credential.receivedAt && formatDate(credential.receivedAt, copy.received),
    credential.validUntil && formatDate(credential.validUntil, copy.expires),
  ].filter((date) => date !== undefined && date !== '');

  return (
    <Card>
      <Stack direction="row" gap="md">
        <View style={styles.emblem}>
          <Icon name="verified" size="lg" color={theme.colors.accent.onSubtle} />
        </View>
        <Stack fill gap="sm">
          <Stack gap="xxs">
            <Text variant="headingSm">{typeName(credential.type)}</Text>
            {dates.map((date) => (
              <Text key={date} variant="bodySm" color="secondary">
                {date}
              </Text>
            ))}
          </Stack>
          <Tag label={tag.label} tone={tag.tone} icon={tag.icon} size="sm" />
        </Stack>
      </Stack>
    </Card>
  );
}

/** Stands in for the list while it first loads. */
function LoadingCards() {
  return (
    <Stack gap="md" accessible role="progressbar" aria-label={copy.loading} aria-busy>
      {[0, 1].map((card) => (
        <Card key={card}>
          <Stack direction="row" gap="md">
            <Skeleton circle height={44} />
            <Stack fill gap="sm">
              <Skeleton width="70%" height={20} />
              <Skeleton width="50%" />
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

// Issuers write some types as one word: "NomosAdminSignInCredential".
function typeName(type: string) {
  return type.replace(/([a-z0-9])([A-Z])/g, '$1 $2') || copy.untyped;
}

/** `date` in the user's own format, in `phrase`. Nothing if the server sent something that is not a date. */
function formatDate(date: string, phrase: (date: string) => string) {
  const time = new Date(date);
  return Number.isNaN(time.getTime()) ? undefined : phrase(dateFormat.format(time));
}

const useStyles = makeStyles((t) => ({
  content: {
    flexGrow: 1,
    gap: t.space.md,
    padding: t.space.lg,
  },
  // On top of the gap, so that the heading stands apart from the cards.
  header: {
    marginBottom: t.space.sm,
  },
  emblem: {
    width: t.sizes.touchTarget,
    height: t.sizes.touchTarget,
    borderRadius: t.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.accent.subtle,
  },
}));
