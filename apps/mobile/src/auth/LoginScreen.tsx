import { Card, Icon, makeStyles, Screen, useReducedMotion, useTheme } from '@nomos/ui';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useEffectEvent, useState } from 'react';
import {
  BackHandler,
  Keyboard,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bandShare, BrandBand } from '../brand/BrandBand';
import { Drawing } from '../brand/Drawing';
import { headerLogoWidth, Logo } from '../brand/Logo';
import { CodeForm } from './CodeForm';
import { CredentialsForm } from './CredentialsForm';

const backLabel = 'Back';
const screenPadding = 'lg';
// A drawing for each step: a padlock for the email and password, an envelope
// for the code.
const drawings = {
  credentials: require('../../assets/lottie/sign-in.json'),
  code: require('../../assets/lottie/code.json'),
};
// The drawing's size: a share of the screen's height, within limits.
const drawingShare = 0.2;
const drawingMinSize = 112;
const drawingMaxSize = 184;
// Keeps the form a comfortable width on a tablet.
const cardMaxWidth = 480;

export interface LoginScreenProps {
  /** Go back to the onboarding pages. */
  onBack: () => void;
}

export function LoginScreen({ onBack }: LoginScreenProps) {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  // Set once the password has been accepted and a one-time code emailed to this address.
  const [codeSentTo, setCodeSentTo] = useState<string>();
  const step = codeSentTo ? 'code' : 'credentials';
  const drawingSize = Math.min(Math.max(height * drawingShare, drawingMinSize), drawingMaxSize);

  // The drawing and the back button fade in, and the card follows them up.
  const appear = useEntrance();
  const rise = useEntrance(theme.duration.fast);
  const { offset, shake } = useShake();
  const riseDistance = theme.space.xl;
  const appearStyle = useAnimatedStyle(() => ({ opacity: appear.value }), [appear]);
  const shakeStyle = useAnimatedStyle(
    () => ({ transform: [{ translateX: offset.value }] }),
    [offset],
  );
  const cardStyle = useAnimatedStyle(
    () => ({
      opacity: rise.value,
      transform: [{ translateY: interpolate(rise.value, [0, 1], [riseDistance, 0]) }],
    }),
    [rise, riseDistance],
  );

  function back() {
    // The keyboard would otherwise stay up over the onboarding pages.
    Keyboard.dismiss();
    onBack();
  }

  // Android's back button goes back a step: from the code to the email and
  // password, and from there to the onboarding pages.
  const onHardwareBack = useEffectEvent(() => {
    if (codeSentTo) {
      setCodeSentTo(undefined);
    } else {
      back();
    }
  });
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onHardwareBack();
      return true;
    });
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.root}>
      {/* The band is dark in both colour schemes, so the status bar is light in both. */}
      <StatusBar style="light" />
      <BrandBand share={bandShare.signIn} />
      <Screen scroll padding={screenPadding} style={styles.screen}>
        {/*
          Where it is on the onboarding pages, and not part of the entrance,
          so that the logo holds still as one screen gives way to the other.
        */}
        <View style={styles.logo}>
          <Logo width={headerLogoWidth} />
        </View>
        {/*
          The drawing and the card sit towards the top of the space under the
          logo, where the card overlaps the band and stays clear of the keyboard.
        */}
        <View style={styles.above} />
        <Animated.View aria-hidden style={[styles.drawing, appearStyle, shakeStyle]}>
          {/* Keyed so that each step's drawing plays from the start. */}
          <Drawing key={step} source={drawings[step]} size={drawingSize} />
        </Animated.View>
        <Animated.View style={cardStyle}>
          <Card padding="xl" style={styles.card}>
            {codeSentTo ? (
              <CodeForm
                email={codeSentTo}
                onBack={() => setCodeSentTo(undefined)}
                onRejected={shake}
              />
            ) : (
              <CredentialsForm onNeedsCode={setCodeSentTo} onRejected={shake} />
            )}
          </Card>
        </Animated.View>
        <View style={styles.below} />
      </Screen>
      {/*
        Over the band, clear of the content. The code step has its own way
        back to the email and password, so this shows on the first step only.
      */}
      {!codeSentTo && (
        <Animated.View
          style={[
            styles.back,
            { top: insets.top + theme.space.xs, start: theme.space.sm },
            appearStyle,
          ]}
        >
          <Pressable
            role="button"
            aria-label={backLabel}
            onPress={back}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: theme.opacity.pressed },
            ]}
          >
            <Icon
              // Each platform's own back glyph.
              name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
              size="lg"
              color={theme.colors.text.onBrand}
            />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

/**
 * Runs 0 → 1 once, after `delay`, when the screen first shows. With reduced
 * motion it goes straight to 1.
 */
function useEntrance(delay = 0) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const duration = theme.duration.slow;
  const [x1, y1, x2, y2] = theme.easing.enter;

  useEffect(() => {
    progress.value = reducedMotion
      ? 1
      : withDelay(delay, withTiming(1, { duration, easing: Easing.bezier(x1, y1, x2, y2) }));
  }, [progress, reducedMotion, delay, duration, x1, y1, x2, y2]);

  return progress;
}

/**
 * A sideways shake, for when an attempt is turned down. `offset` is the
 * distance to move by and `shake` starts it. With reduced motion nothing
 * moves: the form's own messages say what went wrong.
 */
function useShake() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const offset = useSharedValue(0);
  const distance = theme.space.sm;
  // Four swings from side to side in all.
  const swing = theme.duration.slow / 4;

  function shake() {
    if (reducedMotion) return;
    offset.value = withSequence(
      withTiming(-distance, { duration: swing / 2 }),
      withRepeat(withTiming(distance, { duration: swing }), 3, true),
      withTiming(0, { duration: swing / 2 }),
    );
  }

  return { offset, shake };
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
  logo: {
    alignItems: 'center',
    paddingBottom: t.space.md,
  },
  // Spare height goes mostly under the card.
  above: {
    flexGrow: 1,
  },
  below: {
    flexGrow: 3,
  },
  drawing: {
    alignItems: 'center',
    paddingBottom: t.space.lg,
  },
  back: {
    position: 'absolute',
  },
  backButton: {
    width: t.sizes.touchTarget,
    height: t.sizes.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: cardMaxWidth,
    alignSelf: 'center',
    borderRadius: t.radii.xxl,
    boxShadow: t.shadows.lg,
  },
}));
