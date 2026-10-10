import { Card, makeStyles, Screen, useReducedMotion, useTheme } from '@nomos/ui';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, Easing, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bandShare, BrandBand } from '../brand/BrandBand';
import { Logo, logoAspectRatio } from '../brand/Logo';
import { CodeForm } from './CodeForm';
import { CredentialsForm } from './CredentialsForm';

const logoMaxWidth = 280;
const screenPadding = 'lg';
// Space around the logo, on top of the screen's own padding. `vertical` is the
// least there can be above and below it.
const logoPadding = { horizontal: 'xxl', vertical: 'lg' } as const;
// Keeps the form a comfortable width on a tablet.
const cardMaxWidth = 480;

export function LoginScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const entrance = useEntrance();
  const sidePadding = theme.space[screenPadding] + theme.space[logoPadding.horizontal];
  const logoWidth = Math.min(windowWidth - 2 * sidePadding, logoMaxWidth);
  const logoHeight = logoWidth / logoAspectRatio;
  const logoAreaHeight = logoHeight + 2 * theme.space[logoPadding.vertical];
  // Set once the password has been accepted and a one-time code emailed to this address.
  const [codeSentTo, setCodeSentTo] = useState<string>();

  return (
    <View style={styles.root}>
      {/* The band is dark in both colour schemes, so the status bar is light in both. */}
      <StatusBar style="light" />
      <BrandBand share={bandShare.signIn} />
      <Screen scroll padding={screenPadding} style={styles.screen}>
        {/*
          The card is centred on the screen, not in the space left under the
          logo. The areas above and below it start at the same height, enough
          for the logo, and share any spare height equally.
        */}
        <Animated.View style={[styles.above, { minHeight: logoAreaHeight, opacity: entrance }]}>
          <Logo width={logoWidth} />
        </Animated.View>
        <Animated.View
          style={{
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [theme.space.xl, 0],
                }),
              },
            ],
          }}
        >
          <Card padding="xl" style={styles.card}>
            {codeSentTo ? (
              <CodeForm email={codeSentTo} onBack={() => setCodeSentTo(undefined)} />
            ) : (
              <CredentialsForm onNeedsCode={setCodeSentTo} />
            )}
          </Card>
        </Animated.View>
        <View
          style={[
            styles.below,
            // The screen keeps more clear at the top than at the bottom, so this
            // area makes up the difference.
            { minHeight: logoAreaHeight + Math.max(0, insets.top - insets.bottom) },
          ]}
        />
      </Screen>
    </View>
  );
}

/** Runs 0 → 1 once, when the screen first shows. With reduced motion it starts at 1. */
function useEntrance() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));
  const duration = theme.duration.slow;
  const [x1, y1, x2, y2] = theme.easing.enter;

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reducedMotion, duration, x1, y1, x2, y2]);

  return progress;
}

const useStyles = makeStyles((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.bg.canvas,
  },
  // Lets the band show through.
  screen: {
    backgroundColor: 'transparent',
  },
  above: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  below: {
    flexGrow: 1,
  },
  card: {
    width: '100%',
    maxWidth: cardMaxWidth,
    alignSelf: 'center',
    borderRadius: t.radii.xxl,
    boxShadow: t.shadows.lg,
  },
}));
