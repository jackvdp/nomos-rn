import { Button, Screen, Stack, Text } from '@nomos/ui';

import { useAuth } from '../auth/useAuth';

// The screen's wording in one place, ready to move into translations.
const copy = {
  title: 'Home',
  intro: 'News and activity from your organisation will appear here.',
  signOut: 'Sign out',
};

/** The first tab. A placeholder until the feed lands; for now it is also where to sign out. */
export function HomeScreen() {
  const { signOut } = useAuth();
  return (
    // The bottom edge is the tab bar's. Nothing here reaches that far down yet.
    <Screen edges={['top']}>
      <Stack gap="md">
        <Text variant="headingLg">{copy.title}</Text>
        <Text color="secondary">{copy.intro}</Text>
        <Button label={copy.signOut} variant="secondary" leadingIcon="logout" onPress={signOut} />
      </Stack>
    </Screen>
  );
}
