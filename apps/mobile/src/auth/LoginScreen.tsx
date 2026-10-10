import { Card, Icon, makeStyles, Screen, useReducedMotion, useTheme } from '@nomos/ui';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useEffectEvent, useState } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  Keyboard,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bandShare, BrandBand } from '../brand/BrandBand';
import { Logo, logoAspectRatio } from '../brand/Logo';
import { CodeForm } from './CodeForm';
import { CredentialsForm } from './CredentialsForm';

const backLabel = 'Back';
const logoMaxWidth = 280;
const screenPadding = 'lg';
// Space around the logo, on top of the screen's own padding. `vertical` is the
// least there can be above and below it.
const logoPadding = { horizontal: 'xxl', vertical: 'lg' } as const;
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
  const { width: windowWidth } = useWindowDimensions();
  const entrance = useEntrance();
  const sidePadding = theme.space[screenPadding] + theme.space[logoPadding.horizontal];
  const logoWidth = Math.min(windowWidth - 2 * sidePadding, logoMaxWidth);
  const logoHeight = logoWidth / logoAspectRatio;
  const logoAreaHeight = logoHeight + 2 * theme.space[logoPadding.vertical];
  // Set once the password has been accepted and a one-time code emailed to this address.
  const [codeSentTo, setCodeSentTo] = useState<string>();

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
      {/*
        Over the band, clear of the content. The code step has its own way
        back to the email and password, so this shows on the first step only.
      */}
      {!codeSentTo && (
        <Animated.View
          style={[
            styles.back,
            { top: insets.top + theme.space.xs, start: theme.space.sm, opacity: entrance },
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
