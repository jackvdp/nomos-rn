import { Button, makeStyles, Screen, Stack, Text, useReducedMotion, useTheme } from '@nomos/ui';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { useEffect, useEffectEvent, useRef, useState, type ComponentProps } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bandShare, BrandBand } from '../brand/BrandBand';
import { Logo, logoAspectRatio } from '../brand/Logo';

// The screen's wording in one place, ready to move into translations.
const copy = {
  next: 'Next',
  skip: 'Skip',
  signIn: 'Sign in',
  position: (page: number, count: number) => `Page ${page} of ${count}`,
};

// Each drawing is a Lottie file that draws itself once and holds its last frame.
const pages = [
  {
    key: 'passport',
    drawing: require('../../assets/lottie/passport.json'),
    title: 'Verified people',
    body: 'Your Professional Passport holds your identity, role and training, confirmed by the institution you work for.',
  },
  {
    key: 'workplace',
    drawing: require('../../assets/lottie/workplace.json'),
    title: 'Secure workplaces',
    body: 'A private space for your organisation’s announcements, messages and documents.',
  },
  {
    key: 'network',
    drawing: require('../../assets/lottie/network.json'),
    title: 'A trusted network',
    body: 'Find verified colleagues, join communities and learn together across the NOMOS Network.',
  },
];
// The last frame of every drawing.
const drawingEnd = 150;

const logoWidth = 128;
const drawingMaxSize = 300;
// Keep the words and the buttons a comfortable width on a tablet.
const wordsMaxWidth = 440;
const footerMaxWidth = 480;

export interface OnboardingScreenProps {
  /** The user has asked for the sign-in screen. */
  onSignIn: () => void;
  /** Set once the sign-in screen is underneath. This screen then fades out to reveal it. */
  leaving: boolean;
  /** The screen has faded out and can be removed. */
  onLeft: () => void;
}

/**
 * The first thing a new user sees: a few pages on what NOMOS is, swiped or
 * stepped through, ending at the sign-in screen.
 */
export function OnboardingScreen({ onSignIn, leaving, onLeft }: OnboardingScreenProps) {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const pager = useRef<ScrollView>(null);
  const [current, setCurrent] = useState(0);
  const exit = useExit(leaving, onLeft);
  const last = current === pages.length - 1;

  const bandHeight = height * bandShare.onboarding;
  const logoAreaHeight = theme.space.lg + logoWidth / logoAspectRatio + theme.space.md;
  // The drawings get what is left of the band under the logo.
  const drawingAreaHeight = Math.max(0, bandHeight - insets.top - logoAreaHeight);
  const drawingSize = Math.min(
    // Keeps the drawing off the band's curved edge.
    Math.max(0, drawingAreaHeight - theme.space.lg),
    width - 2 * theme.space.xxl,
    drawingMaxSize,
  );

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    // Whichever page fills most of the screen is the current one.
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrent(Math.min(Math.max(page, 0), pages.length - 1));
  }

  function next() {
    pager.current?.scrollTo({ x: (current + 1) * width, animated: !reducedMotion });
  }

  return (
    <Animated.View
      style={[
        styles.root,
        { opacity: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) },
      ]}
    >
      {/* The band is dark in both colour schemes, so the status bar is light in both. */}
      <StatusBar style="light" />
      {/*
        While the screen fades out, its band rises to where the sign-in
        screen's band is, so the band appears to stay as the rest changes.
      */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateY: exit.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, (bandShare.signIn - bandShare.onboarding) * height],
                }),
              },
            ],
          },
        ]}
      >
        <BrandBand share={bandShare.onboarding} />
      </Animated.View>
      <Screen
        scroll
        padding="none"
        style={styles.screen}
        footer={
          <Stack gap="lg" paddingHorizontal="lg" style={styles.footer}>
            <View
              accessible
              aria-label={copy.position(current + 1, pages.length)}
              style={styles.dots}
            >
              {pages.map((page, index) => (
                <View key={page.key} style={[styles.dot, index === current && styles.currentDot]} />
              ))}
            </View>
            <Stack direction="row" gap="sm">
              {!last && (
                <Button label={copy.skip} variant="tertiary" size="lg" onPress={onSignIn} />
              )}
              <Button
                label={last ? copy.signIn : copy.next}
                size="lg"
                style={styles.grow}
                onPress={last ? onSignIn : next}
              />
            </Stack>
          </Stack>
        }
      >
        <View style={[styles.logo, { height: logoAreaHeight }]}>
          <Logo width={logoWidth} />
        </View>
        <ScrollView
          ref={pager}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {pages.map((page, index) => (
            <View key={page.key} style={{ width }}>
              <View aria-hidden style={[styles.drawing, { height: drawingAreaHeight }]}>
                <Drawing source={page.drawing} size={drawingSize} playing={index === current} />
              </View>
              <Stack gap="sm" padding="xl" style={styles.words}>
                <Text variant="display" align="center">
                  {page.title}
                </Text>
                <Text variant="bodyLg" color="secondary" align="center">
                  {page.body}
                </Text>
              </Stack>
            </View>
          ))}
        </ScrollView>
      </Screen>
    </Animated.View>
  );
}

interface DrawingProps {
  source: ComponentProps<typeof LottieView>['source'];
  /** Width and height. */
  size: number;
  /** The drawing plays from the start each time this becomes true. */
  playing: boolean;
}

function Drawing({ source, size, playing }: DrawingProps) {
  const reducedMotion = useReducedMotion();
  const lottie = useRef<LottieView>(null);

  useEffect(() => {
    if (!playing) return;
    if (reducedMotion) {
      lottie.current?.pause();
    } else {
      lottie.current?.play(0, drawingEnd);
    }
  }, [playing, reducedMotion]);

  return (
    <LottieView
      ref={lottie}
      source={source}
      loop={false}
      // With reduced motion the finished drawing shows from the start.
      progress={reducedMotion ? 1 : undefined}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * Runs 0 → 1 once `leaving` is set, then calls `onLeft`. With reduced motion
 * it calls `onLeft` straight away.
 */
function useExit(leaving: boolean, onLeft: () => void) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));
  const left = useEffectEvent(onLeft);
  const duration = theme.duration.slow;
  const [x1, y1, x2, y2] = theme.easing.standard;

  useEffect(() => {
    if (!leaving) return;
    if (reducedMotion) {
      left();
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) left();
    });
    return () => animation.stop();
  }, [leaving, progress, reducedMotion, duration, x1, y1, x2, y2]);

  return progress;
}

const dotSize = 8;

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
    paddingTop: t.space.lg,
  },
  drawing: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: t.space.lg,
  },
  words: {
    width: '100%',
    maxWidth: wordsMaxWidth,
    alignSelf: 'center',
  },
  footer: {
    width: '100%',
    maxWidth: footerMaxWidth,
    alignSelf: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: t.space.sm,
  },
  dot: {
    width: dotSize,
    height: dotSize,
    borderRadius: t.radii.full,
    backgroundColor: t.colors.control.track,
  },
  currentDot: {
    width: 3 * dotSize,
    backgroundColor: t.colors.control.checked,
  },
  grow: {
    flex: 1,
  },
}));
