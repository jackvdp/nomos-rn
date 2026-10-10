import { makeStyles, useReducedMotion, useTheme } from '@nomos/ui';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { LoginScreen } from './auth/LoginScreen';
import { bandShare, BrandBand, coveringShare } from './brand/BrandBand';
import { headerLogoWidth, Logo, logoAspectRatio, splashLogoWidth } from './brand/Logo';
import { OnboardingScreen } from './onboarding/OnboardingScreen';

export interface SignedOutProps {
  /** The onboarding pages have been seen, so the sign-in screen is the one to start on. */
  onboarded: boolean;
  onOnboarded: () => void;
  /**
   * The app has just started and the splash screen is still up. The
   * onboarding pages then start out looking like it, take it down, and move
   * into place.
   */
  fromSplash: boolean;
  /** The move in from the splash screen has finished. */
  onArrived: () => void;
}

/**
 * What a signed-out user sees: the onboarding pages, then the sign-in screen,
 * which is revealed from under them and can be left for them again.
 *
 * Both screens sit on one brand band, which lives here. It reaches a
 * different way down each screen, and as one gives way to the other the band
 * itself moves between the two, while the screens' own content cross-fades
 * over it. When the app starts, the band covers the whole screen as the
 * splash screen does, and draws up to where the onboarding pages have it.
 */
export function SignedOut({ onboarded, onOnboarded, fromSplash, onArrived }: SignedOutProps) {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  // The screen the user is on, or on the way to.
  const [screen, setScreen] = useState<'onboarding' | 'signIn'>(
    onboarded ? 'signIn' : 'onboarding',
  );
  // The sign-in screen sits under the onboarding pages, from when it is asked
  // for until they have taken its place again.
  const [signInMounted, setSignInMounted] = useState(onboarded);
  const onSignIn = screen === 'signIn';
  const change = useScreenChange(onSignIn, onOnboarded, () => setSignInMounted(false));
  const arrival = useArrival(fromSplash, onArrived);
  const covering = coveringShare(width, height);
  const share = useDerivedValue(() => {
    const resting = interpolate(change.value, [0, 1], [bandShare.onboarding, bandShare.signIn]);
    return interpolate(arrival.progress.value, [0, 1], [covering, resting]);
  }, [change, arrival.progress, covering]);
  // The onboarding pages are out of sight while the sign-in screen has their
  // place, and at first on the way in from the splash screen: they wait for
  // the band's edge to have gone up past their words.
  const cover = useDerivedValue(
    () =>
      Math.max(
        change.value,
        interpolate(arrival.progress.value, [0.8, 1], [1, 0], Extrapolation.CLAMP),
      ),
    [change, arrival.progress],
  );

  // Both screens have the logo's top this far down.
  const headerLogoTop = insets.top + theme.space.lg;
  const headerLogoCentre = headerLogoTop + headerLogoWidth / logoAspectRatio / 2;
  const logoStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: arrival.progress.value * (headerLogoCentre - height / 2) },
        {
          scale: interpolate(
            arrival.progress.value,
            [0, 1],
            [1, headerLogoWidth / splashLogoWidth],
          ),
        },
      ],
    }),
    [arrival.progress, headerLogoCentre, height],
  );

  return (
    <View style={styles.root}>
      {/* The band is dark in both colour schemes, so the status bar is light in both. */}
      <StatusBar style="light" />
      <BrandBand share={share} motif={arrival.progress} />
      {signInMounted && <LoginScreen reveal={change} onBack={() => setScreen('onboarding')} />}
      <View
        aria-hidden={onSignIn}
        style={[StyleSheet.absoluteFill, onSignIn && styles.untouchable]}
      >
        <OnboardingScreen
          hidden={onSignIn}
          arriving={fromSplash}
          cover={cover}
          onSignIn={() => {
            setSignInMounted(true);
            setScreen('signIn');
          }}
        />
      </View>
      {/*
        The splash screen's logo, where the splash screen has it. It goes to
        where the onboarding pages have theirs, which then takes over from it.
      */}
      {fromSplash && (
        <Animated.View aria-hidden style={[StyleSheet.absoluteFill, styles.splashLogo, logoStyle]}>
          <Logo width={splashLogoWidth} onLoadEnd={arrival.begin} />
        </Animated.View>
      )}
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

/**
 * The move in from the splash screen. `progress` is 0 while the screen looks
 * like the splash screen and 1 once it is in place, which is where it starts
 * unless `fromSplash`. Call `begin` when the screen has drawn its copy of the
 * splash screen: the real one is taken down and the move starts. With reduced
 * motion it arrives at once.
 */
function useArrival(fromSplash: boolean, onArrived: () => void) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(fromSplash ? 0 : 1);
  const begun = useRef(false);
  // Further to go than a change of screen, so it takes longer over it.
  const duration = reducedMotion ? 0 : 2 * theme.duration.slow;
  const [x1, y1, x2, y2] = theme.easing.standard;

  function begin() {
    if (begun.current) return;
    begun.current = true;
    // A frame later, so that the copy is on the screen before the splash
    // screen is taken off it.
    requestAnimationFrame(() => {
      SplashScreen.hide();
      const done = () => onArrived();
      progress.value = withTiming(
        1,
        { duration, easing: Easing.bezier(x1, y1, x2, y2) },
        (finished) => {
          if (finished) scheduleOnRN(done);
        },
      );
    });
  }

  return { progress, begin };
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
  // In the middle of the screen, as it is on the splash screen.
  splashLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
}));
