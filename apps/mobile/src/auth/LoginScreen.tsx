import { makeStyles, Screen, useTheme } from '@nomos/ui';
import { useState } from 'react';
import { Image, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CodeForm } from './CodeForm';
import { CredentialsForm } from './CredentialsForm';

// The logo as supplied, and a copy with the wordmark turned white for dark
// backgrounds, where the original's dark navy wordmark does not show.
const logo = {
  light: require('../../assets/nomos-logo.png'),
  dark: require('../../assets/nomos-logo-on-dark.png'),
};
const logoAspectRatio = 1888 / 427;
// Nearly fills the width on a phone without growing past this on a tablet.
const logoMaxWidth = 400;
const logoLabel = 'NOMOS';
const screenPadding = 'lg';
// Space around the logo, on top of the screen's own padding. `bottom` is the
// least there can be between the logo and the form.
const logoPadding = { horizontal: 'lg', top: 'xxxl', bottom: 'lg' } as const;

export function LoginScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  // An image does not size itself from a width and a ratio alone, so work the size out.
  const sidePadding = theme.space[screenPadding] + theme.space[logoPadding.horizontal];
  const logoWidth = Math.min(windowWidth - 2 * sidePadding, logoMaxWidth);
  const logoHeight = logoWidth / logoAspectRatio;
  const logoAreaHeight =
    theme.space[logoPadding.top] + logoHeight + theme.space[logoPadding.bottom];
  // Set once the password has been accepted and a one-time code emailed to this address.
  const [codeSentTo, setCodeSentTo] = useState<string>();

  return (
    <Screen scroll padding={screenPadding}>
      {/*
        The form is centred on the screen, not in the space left under the
        logo. The areas above and below it start at the same height, enough for
        the logo, and share any spare height equally.
      */}
      <View style={[styles.above, { minHeight: logoAreaHeight }]}>
        <Image
          source={logo[theme.colorScheme]}
          accessible
          aria-label={logoLabel}
          resizeMode="contain"
          style={{ width: logoWidth, height: logoHeight }}
        />
      </View>
      {codeSentTo ? (
        <CodeForm email={codeSentTo} onBack={() => setCodeSentTo(undefined)} />
      ) : (
        <CredentialsForm onNeedsCode={setCodeSentTo} />
      )}
      <View
        style={[
          styles.below,
          // The screen keeps more clear at the top than at the bottom, so this
          // area makes up the difference.
          { minHeight: logoAreaHeight + Math.max(0, insets.top - insets.bottom) },
        ]}
      />
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  above: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: t.space[logoPadding.top],
  },
  below: {
    flexGrow: 1,
  },
}));
