# @nomos/ui

The NOMOS component library for React Native: a theme layer built on
[`@nomos/tokens`](../tokens/README.md) and the components the app's screens
are built from. Each component works on iOS, Android and web
(react-native-web), in light and dark, and in left-to-right and
right-to-left layouts.

## Components

| Group              | Components                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Layout, typography | `Screen`, `Stack`, `Text`, `Icon`, `Divider`                                                                       |
| Actions            | `Button`, `IconButton`, `TextLink`                                                                                 |
| Forms              | `TextField`, `SearchField`, `Checkbox`, `RadioGroup` + `Radio`, `Switch`, `SegmentedControl`, `Chip` + `ChipGroup` |
| Display            | `Avatar`, `AvatarGroup`, `Badge`, `Card`, `ListItem`, `Tag`                                                        |
| Feedback           | `Banner`, `ToastProvider` + `useToast`, `Spinner`, `ProgressBar`, `Skeleton` + `SkeletonText`, `EmptyState`        |
| Overlays           | `Dialog`, `Sheet`                                                                                                  |
| NOMOS              | `ContextLabel` (where am I, who can see this), `VerifiedBadge`                                                     |
| Theme              | `ThemeProvider`, `useTheme`, `makeStyles`, `lightTheme`, `darkTheme`, `useReducedMotion`                           |

Every component has stories. Run `npm run storybook` from the repo root and
browse them by group. `Patterns/Home feed` combines components into a mock
NOMOS home screen.

## Using it in an app

Install the peer dependencies in the app with `npx expo install`, so you get
the SDK-matched versions:

```sh
npx expo install react-native-safe-area-context @expo/vector-icons expo-font \
  react-native-reanimated react-native-worklets
```

Expo sets up Reanimated's Babel plugin by itself. In a bare React Native app,
add `react-native-worklets/plugin` to `babel.config.js` and run `pod install`.

Load the fonts before rendering, and wrap the app root once:

```tsx
import { fonts, ThemeProvider, ToastProvider } from '@nomos/ui';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [fontsLoaded, fontsError] = useFonts(fonts);
  if (!fontsLoaded && !fontsError) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>{/* navigation and screens */}</ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

`ThemeProvider` follows the device's light or dark setting by default. Pass
`colorScheme="light"` or `"dark"` to force one, for example from a setting
the user picks.

## Styling your own components

Read the theme through `makeStyles` for static styles and `useTheme` for
values that depend on props:

```tsx
import { makeStyles, Text, useTheme } from '@nomos/ui';
import { View } from 'react-native';

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', gap: t.space.sm, padding: t.space.lg },
}));

function Example({ urgent }: { urgent: boolean }) {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <View style={[styles.row, urgent && { backgroundColor: theme.colors.tone.danger.subtle }]}>
      <Text variant="bodyStrong">Polling station 14B</Text>
    </View>
  );
}
```

`makeStyles` builds the StyleSheet once per theme and shares it across
instances.

## Conventions for adding a component

Copy the shape of `src/components/Button/`:

- **Files.** Each component gets `Name.tsx`, `Name.stories.tsx`,
  `Name.test.tsx` and `index.ts`. Export it from `src/index.ts`. Anything not
  exported there is private to the package.
- **Theme values only.** Use semantic colours (`colors.text.secondary`, not
  `navy[700]`) and the space, radius, size and type scales. Never hard-code
  hex values.
- **Right-to-left.** Use logical properties (`marginStart`, `paddingEnd`,
  `start`, `end`), never `left`/`right`. `Icon` mirrors directional glyphs
  itself.
- **Accessibility.**
  - Use ARIA props (`role`, `aria-label`, `aria-checked`, `aria-disabled`, …).
  - Touch targets must be at least 44pt; reach it with `hitSlop` when the
    visual is smaller.
  - Icons are hidden from screen readers unless they have a label.
  - Colour is never the only signal.
- **Internationalisation.** Visible text comes from props. Accessibility
  labels for a component's own controls (clear, dismiss, show password) are
  props with English defaults, so the app can translate them.
- **Motion.**
  - Use Reanimated (`react-native-reanimated`) for new motion. `Button` is the
    example to follow.
  - Components written before it (`Dialog`, `Sheet`, `Toast`, `Switch`,
    `ProgressBar`, `Skeleton`) use React Native's `Animated` with the native
    driver. Move one to Reanimated when it needs something `Animated` can't
    do smoothly.
  - Keep durations and easing to the tokens.
  - Skip or shorten animations when `useReducedMotion()` is true.
  - Give `useAnimatedStyle` its dependency list. Reanimated's Babel plugin
    works it out on iOS and Android, but the web Storybook runs without the
    plugin.
- **Stories.**
  - Title is `'<Group>/<Name>'`.
  - Include a `Playground` with controls, plus stories for variants, states
    and a realistic NOMOS example.
  - Don't use remote images: the smoke test runs offline.
- **Tests.**
  - Use React Native Testing Library v14, where `render`, `fireEvent` and
    `act` are async.
  - Import from `src/test-utils.tsx`, which wraps the theme and safe-area
    providers.
  - Prefer `getByRole` with a name and `userEvent`.
  - Test behaviour and accessibility, not styles.

`src/stories.test.tsx` renders every story in light and dark, so a new story
is smoke-tested without extra work.

```sh
npm test -w @nomos/ui                 # all tests
npm test -w @nomos/ui -- Button       # one component
npm run typecheck -w @nomos/ui
```

## Known gaps

- **Brand placeholders.** The colours are placeholders (see the tokens
  README). The fonts are the two trustnomos.com uses. The icons are Ionicons
  behind our own names (`IconName`), so a NOMOS icon set can replace them
  without changing call sites.
- **Toasts under modals.** On iOS and Android, toasts render underneath an
  open `Dialog` or `Sheet`, because native modals sit above the app root.
- **Chip touch area.** `Chip` reaches 44pt with `hitSlop` from a 36pt chip.
  On Android, a tap in that extra area only registers if it also falls
  inside the parent's bounds.
- **Not built yet.** Navigation chrome: headers and tab bars come from React
  Navigation, styled with the theme when navigation is added. Also missing:
  date and time pickers, a select/menu, and a tooltip.
