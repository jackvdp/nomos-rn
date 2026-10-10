import { makeStyles, useReducedMotion, useTheme } from '@nomos/ui';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useEffectEvent, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Easing,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { LoginScreen } from './auth/LoginScreen';
import { bandShare, BrandBand } from './brand/BrandBand';
import { OnboardingScreen } from './onboarding/OnboardingScreen';

export interface SignedOutProps {
  /** The onboarding pages have been seen, so the sign-in screen is the one to start on. */
  onboarded: boolean;
  onOnboarded: () => void;
}

/**
 * What a signed-out user sees: the onboarding pages, then the sign-in screen,
 * which is revealed from under them and can be left for them again.
 *
 * Both screens sit on one brand band, which lives here. It reaches a
 * different way down each screen, and as one gives way to the other the band
 * itself moves between the two, while the screens' own content cross-fades
 * over it.
 */
export function SignedOut({ onboarded, onOnboarded }: SignedOutProps) {
  const styles = useStyles();
  // The screen the user is on, or on the way to.
  const [screen, setScreen] = useState<'onboarding' | 'signIn'>(
    onboarded ? 'signIn' : 'onboarding',
  );
  // The sign-in screen sits under the onboarding pages, from when it is asked
  // for until they have taken its place again.
  const [signInMounted, setSignInMounted] = useState(onboarded);
  const onSignIn = screen === 'signIn';
  const change = useScreenChange(onSignIn, onOnboarded, () => setSignInMounted(false));
  const share = useDerivedValue(
    () => interpolate(change.value, [0, 1], [bandShare.onboarding, bandShare.signIn]),
    [change],
  );

  return (
    <View style={styles.root}>
      {/* The band is dark in both colour schemes, so the status bar is light in both. */}
      <StatusBar style="light" />
      <BrandBand share={share} />
      {signInMounted && <LoginScreen reveal={change} onBack={() => setScreen('onboarding')} />}
      <View
        aria-hidden={onSignIn}
        style={[StyleSheet.absoluteFill, onSignIn && styles.untouchable]}
      >
        <OnboardingScreen
          hidden={onSignIn}
          cover={change}
          onSignIn={() => {
            setSignInMounted(true);
            setScreen('signIn');
          }}
        />
      </View>
    </View>
  );
}

/**
 * How far the change from the onboarding pages to the sign-in screen has
 * got: 0 on the onboarding pages, 1 on the sign-in screen. It follows
 * `onSignIn` and says when it has arrived at either. With reduced motion it
 * arrives at once.
 */
function useScreenChange(onSignIn: boolean, atSignIn: () => void, atOnboarding: () => void) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(onSignIn ? 1 : 0);
  const arrived = useEffectEvent(() => (onSignIn ? atSignIn() : atOnboarding()));
  const duration = reducedMotion ? 0 : theme.duration.slow;
  const [x1, y1, x2, y2] = theme.easing.standard;

  useEffect(() => {
    const target = onSignIn ? 1 : 0;
    // Already there when this first shows.
    if (progress.value === target) return;
    const done = () => arrived();
    progress.value = withTiming(
      target,
      { duration, easing: Easing.bezier(x1, y1, x2, y2) },
      (finished) => {
        if (finished) scheduleOnRN(done);
      },
    );
  }, [onSignIn, progress, duration, x1, y1, x2, y2]);

  return progress;
}

const useStyles = makeStyles((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.bg.canvas,
  },
  // Lets touches through to the sign-in screen underneath.
  untouchable: {
    pointerEvents: 'none',
  },
}));
