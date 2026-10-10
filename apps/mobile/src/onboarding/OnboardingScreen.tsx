import { Button, makeStyles, Screen, Stack, Text, useReducedMotion, useTheme } from '@nomos/ui';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { useEffect, useEffectEvent, useRef, useState, type ComponentProps } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useScrollOffset,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

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
  /**
   * The sign-in screen is showing instead. This screen fades out over it, and
   * fades back in when this is cleared.
   */
  hidden: boolean;
  /** The user has asked for the sign-in screen. */
  onSignIn: () => void;
  /** The screen has finished fading out. */
  onHidden: () => void;
  /** The screen has finished fading back in, so the sign-in screen under it can go. */
  onShown: () => void;
}

/**
 * The first thing a new user sees: a few pages on what NOMOS is, swiped or
 * stepped through, ending at the sign-in screen.
 */
export function OnboardingScreen({ hidden, onSignIn, onHidden, onShown }: OnboardingScreenProps) {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const pager = useAnimatedRef<Animated.ScrollView>();
  const offset = useScrollOffset(pager);
  // Where the pager is, in pages: 1.5 is half-way from the second page to the
  // third. The footer's motion follows it, so it keeps pace with a swipe.
  const position = useDerivedValue(
    () => Math.min(Math.max(offset.value / width, 0), pages.length - 1),
    [offset, width],
  );
  const [current, setCurrent] = useState(0);
  const cover = useCover(hidden, onHidden, onShown);
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
  // While the screen fades out, its band rises to where the sign-in screen's
  // band is, so the band appears to stay as the rest changes.
  const bandRise = (bandShare.signIn - bandShare.onboarding) * height;

  const rootStyle = useAnimatedStyle(() => ({ opacity: 1 - cover.value }), [cover]);
  const bandStyle = useAnimatedStyle(
    () => ({ transform: [{ translateY: cover.value * bandRise }] }),
    [cover, bandRise],
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
    <Animated.View style={[styles.root, rootStyle]}>
      {/* The band is dark in both colour schemes, so the status bar is light in both. */}
      <StatusBar style="light" />
      <Animated.View style={[StyleSheet.absoluteFill, bandStyle]}>
        <BrandBand share={bandShare.onboarding} />
      </Animated.View>
      <Screen
        scroll
        padding="none"
        style={styles.screen}
        footer={
          <Stack gap="lg" paddingHorizontal="lg" style={styles.footer}>
            <Steps position={position} label={copy.position(current + 1, pages.length)} />
            <Actions position={position} last={last} onNext={next} onSignIn={onSignIn} />
          </Stack>
        }
      >
        <View style={[styles.logo, { height: logoAreaHeight }]}>
          <Logo width={logoWidth} />
        </View>
        <Animated.ScrollView
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
                <Drawing
                  source={page.drawing}
                  size={drawingSize}
                  playing={index === current && !hidden}
                />
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
        </Animated.ScrollView>
      </Screen>
    </Animated.View>
  );
}

interface StepsProps {
  /** Where the pager is, in pages. */
  position: SharedValue<number>;
  /** Read out by screen readers in place of the dots. */
  label: string;
}

/**
 * The page indicator: a dot for each page and a longer marker on the current
 * one. The marker is a single element that slides from dot to dot as the
 * pager moves, and the dots shift along to make room for it.
 */
function Steps({ position, label }: StepsProps) {
  const theme = useTheme();
  const styles = useStyles();
  // From the start of one dot's room to the start of the next.
  const pitch = stepSize + theme.space.sm;
  const markerStyle = useAnimatedStyle(
    () => ({ transform: [{ translateX: position.value * pitch }] }),
    [position, pitch],
  );

  return (
    <View accessible aria-label={label} style={styles.steps}>
      {pages.map((page, index) => (
        <Step key={page.key} index={index} position={position} />
      ))}
      <Animated.View style={[styles.marker, markerStyle]} />
    </View>
  );
}

interface StepProps {
  index: number;
  position: SharedValue<number>;
}

function Step({ index, position }: StepProps) {
  const styles = useStyles();
  // A dot's room is as wide as the marker while the marker is on it, and
  // closes to the dot's own width as the marker leaves.
  const roomStyle = useAnimatedStyle(
    () => ({
      width: interpolate(
        position.value,
        [index - 1, index, index + 1],
        [stepSize, markerWidth, stepSize],
        Extrapolation.CLAMP,
      ),
    }),
    [position, index],
  );

  return (
    <Animated.View style={[styles.step, roomStyle]}>
      <View style={styles.dot} />
    </Animated.View>
  );
}

interface ActionsProps {
  /** Where the pager is, in pages. */
  position: SharedValue<number>;
  /** The last page is the current one. */
  last: boolean;
  onNext: () => void;
  onSignIn: () => void;
}

/**
 * The buttons under the pages. On the way to the last page Skip fades out,
 * and Next spreads over its place and turns into Sign in. Next and Sign in
 * are two buttons in the same spot, the second fading in over the first.
 */
function Actions({ position, last, onNext, onSignIn }: ActionsProps) {
  const styles = useStyles();
  // Skip's width with the gap after it, once it has been laid out.
  const skipWidth = useSharedValue(0);
  // 0 up to the page before the last, 1 on the last.
  const arrival = useDerivedValue(
    () => Math.max(0, position.value - (pages.length - 2)),
    [position],
  );

  // Gone early, before the main button reaches its label.
  const skipStyle = useAnimatedStyle(
    () => ({ opacity: interpolate(arrival.value, [0, 0.3], [1, 0], Extrapolation.CLAMP) }),
    [arrival],
  );
  // Skip keeps its place in the row, and so its width, and the main button is
  // pulled back over it.
  const mainStyle = useAnimatedStyle(
    () => ({ marginStart: -skipWidth.value * arrival.value }),
    [skipWidth, arrival],
  );
  // Next stays solid under Sign in, so the button never looks see-through. It
  // goes once Sign in has covered it, or it would show when Sign in is pressed.
  const nextStyle = useAnimatedStyle(() => ({ opacity: arrival.value > 0.99 ? 0 : 1 }), [arrival]);
  const signInStyle = useAnimatedStyle(() => ({ opacity: arrival.value }), [arrival]);

  function onSkipLayout(event: LayoutChangeEvent) {
    skipWidth.value = event.nativeEvent.layout.width;
  }

  return (
    <View style={styles.actions}>
      <Animated.View
        onLayout={onSkipLayout}
        aria-hidden={last}
        style={[styles.skip, last && styles.untouchable, skipStyle]}
      >
        <Button label={copy.skip} variant="tertiary" size="lg" onPress={onSignIn} />
      </Animated.View>
      <Animated.View style={[styles.grow, mainStyle]}>
        <Animated.View aria-hidden={last} style={[last && styles.untouchable, nextStyle]}>
          <Button label={copy.next} size="lg" fullWidth onPress={onNext} />
        </Animated.View>
        <Animated.View
          aria-hidden={!last}
          style={[StyleSheet.absoluteFill, !last && styles.untouchable, signInStyle]}
        >
          <Button label={copy.signIn} size="lg" fullWidth onPress={onSignIn} />
        </Animated.View>
      </Animated.View>
    </View>
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
 * How far the screen has faded out over the sign-in screen: 0 when it is
 * fully showing, 1 when it is gone. It follows `hidden` and says when it has
 * got there. With reduced motion it gets there at once.
 */
function useCover(hidden: boolean, onHidden: () => void, onShown: () => void) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(hidden ? 1 : 0);
  const arrived = useEffectEvent(() => (hidden ? onHidden() : onShown()));
  const duration = reducedMotion ? 0 : theme.duration.slow;
  const [x1, y1, x2, y2] = theme.easing.standard;

  useEffect(() => {
    const target = hidden ? 1 : 0;
    // Already there when the screen first shows.
    if (progress.value === target) return;
    const done = () => arrived();
    progress.value = withTiming(
      target,
      { duration, easing: Easing.bezier(x1, y1, x2, y2) },
      (finished) => {
        if (finished) scheduleOnRN(done);
      },
    );
  }, [hidden, progress, duration, x1, y1, x2, y2]);

  return progress;
}

const stepSize = 8;
const markerWidth = 3 * stepSize;

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
  // As wide as its dots, so that the marker can be placed from its edge.
  steps: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: t.space.sm,
  },
  step: {
    alignItems: 'center',
  },
  dot: {
    width: stepSize,
    height: stepSize,
    borderRadius: t.radii.full,
    backgroundColor: t.colors.control.track,
  },
  marker: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: markerWidth,
    height: stepSize,
    borderRadius: t.radii.full,
    backgroundColor: t.colors.control.checked,
  },
  actions: {
    flexDirection: 'row',
  },
  // The gap before the main button is in here so that it is covered too.
  skip: {
    paddingEnd: t.space.sm,
  },
  grow: {
    flex: 1,
  },
  untouchable: {
    pointerEvents: 'none',
  },
}));
