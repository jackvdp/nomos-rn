import type { ContextKind } from '@nomos/tokens';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Avatar } from '../components/Avatar';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip, ChipGroup } from '../components/Chip';
import { ContextLabel } from '../components/ContextLabel';
import { Icon } from '../components/Icon';
import { IconButton } from '../components/IconButton';
import { Screen } from '../components/Screen';
import { Skeleton, SkeletonText } from '../components/Skeleton';
import { Stack } from '../components/Stack';
import { Tag } from '../components/Tag';
import { Text } from '../components/Text';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { makeStyles, useTheme } from '../theme';

/**
 * Not a component: a mock of the NOMOS home feed built only from library
 * parts, to check they compose into a screen and to show the intended feel.
 */
const meta = {
  title: 'Patterns/Home feed',
  parameters: { fullscreen: true },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const filters = ['All', 'My Organisation', 'NOMOS Network', 'My Communities', 'Following'];

interface Post {
  author: string;
  role: string;
  time: string;
  context: { kind: ContextKind; name: string; audience: string };
  body: string;
  topic: string;
}

const posts: Post[] = [
  {
    author: 'Amara Okafor',
    role: 'Presiding officer',
    time: '2 h',
    context: {
      kind: 'organisation',
      name: 'Northshire Electoral Commission',
      audience: 'All staff',
    },
    body: 'Ballot box seals for stations 10 to 18 are ready to collect from the returning office from 8:00 tomorrow. Bring your staff ID.',
    topic: 'Logistics',
  },
  {
    author: 'Daniel Mwangi',
    role: 'Trainer, Eastvale Elections Office',
    time: '5 h',
    context: { kind: 'network', name: 'NOMOS Network', audience: 'Public to the Network' },
    body: 'We have just published a short module on handling spoilt ballots. It takes 20 minutes and counts towards your poll worker certificate.',
    topic: 'Training',
  },
];

function AppBar() {
  const styles = useStyles();
  return (
    <Stack direction="row" align="center" gap="sm" paddingHorizontal="lg" paddingVertical="sm">
      <Pressable
        role="button"
        aria-label="Switch context. Current: Northshire Electoral Commission"
        style={styles.switcher}
      >
        <Avatar name="Northshire Electoral Commission" shape="rounded" size="sm" aria-hidden />
        <View style={styles.switcherText}>
          <Text variant="overline" color="secondary">
            Workplace
          </Text>
          <Text variant="labelSm" numberOfLines={1}>
            Northshire Electoral Commission
          </Text>
        </View>
        <Icon name="chevron-down" size="sm" />
      </Pressable>
      <IconButton icon="search" aria-label="Search" />
      <IconButton icon="bell" aria-label="Notifications" badge={3} />
    </Stack>
  );
}

function Composer() {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <Card padding="md">
      <Stack gap="md">
        <Stack direction="row" align="center" gap="md">
          <Avatar name="Priya Raman" size="sm" aria-hidden />
          <Pressable role="button" aria-label="Write a post" style={styles.composerInput}>
            <Text color="tertiary">Share an update…</Text>
          </Pressable>
          <IconButton icon="image" aria-label="Add a photo" />
        </Stack>
        <Stack direction="row" align="center" gap="xs">
          <Icon name="eye" size="sm" color={theme.colors.text.secondary} />
          <Text variant="caption" color="secondary">
            Posting to
          </Text>
          <ContextLabel
            kind="organisation"
            name="Northshire Electoral Commission"
            audience="All staff"
          />
        </Stack>
      </Stack>
    </Card>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <Stack gap="md">
        <Stack direction="row" gap="md">
          <Avatar name={post.author} verified aria-hidden />
          <Stack fill gap="xxs">
            <Stack direction="row" align="center" gap="xs">
              <Text variant="bodyStrong" numberOfLines={1}>
                {post.author}
              </Text>
              <VerifiedBadge />
            </Stack>
            <Text variant="caption" color="secondary" numberOfLines={1}>
              {`${post.role} · ${post.time}`}
            </Text>
          </Stack>
          <IconButton icon="more" aria-label={`More options for ${post.author}'s post`} size="sm" />
        </Stack>
        <ContextLabel {...post.context} />
        <Text>{post.body}</Text>
        <Tag label={post.topic} tone="neutral" size="sm" />
        <Stack direction="row" gap="xs">
          <Button variant="tertiary" size="sm" leadingIcon="heart" label="Like" />
          <Button variant="tertiary" size="sm" leadingIcon="chat" label="Comment" />
          <Button variant="tertiary" size="sm" leadingIcon="share" label="Share" />
        </Stack>
      </Stack>
    </Card>
  );
}

function PostPlaceholder() {
  return (
    <Card>
      <Stack gap="md">
        <Stack direction="row" align="center" gap="md">
          <Skeleton circle width={40} />
          <Stack fill gap="xs">
            <Skeleton width="50%" height={14} />
            <Skeleton width="30%" height={12} />
          </Stack>
        </Stack>
        <SkeletonText lines={3} />
      </Stack>
    </Card>
  );
}

function HomeFeed({ loading = false }: { loading?: boolean }) {
  const theme = useTheme();
  const [filter, setFilter] = useState(filters[0]);
  return (
    <Screen scroll padding="none" header={<AppBar />}>
      <Stack gap="lg" paddingVertical="sm">
        <ChipGroup scrollable contentContainerStyle={{ paddingHorizontal: theme.space.lg }}>
          {filters.map((label) => (
            <Chip
              key={label}
              label={label}
              selected={filter === label}
              onPress={() => setFilter(label)}
            />
          ))}
        </ChipGroup>
        <Stack gap="md" paddingHorizontal="lg">
          <Banner
            tone="warning"
            message="Your presiding officer credential expires in 14 days."
            action={{ label: 'Renew', onPress: () => {} }}
          />
          <Composer />
          {loading ? (
            <>
              <PostPlaceholder />
              <PostPlaceholder />
            </>
          ) : (
            posts.map((post) => <PostCard key={post.author} post={post} />)
          )}
        </Stack>
      </Stack>
    </Screen>
  );
}

export const Default: Story = {
  render: () => <HomeFeed />,
};

export const Loading: Story = {
  render: () => <HomeFeed loading />,
};

const useStyles = makeStyles((t) => ({
  switcher: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    minHeight: t.sizes.touchTarget,
  },
  switcherText: {
    flexShrink: 1,
  },
  composerInput: {
    flex: 1,
    justifyContent: 'center',
    minHeight: t.sizes.control.md,
    paddingHorizontal: t.space.lg,
    borderRadius: t.radii.full,
    backgroundColor: t.colors.bg.sunken,
  },
}));
