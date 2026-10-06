# @nomos/storybook

A small Expo app that runs Storybook for the `@nomos/ui` components. The
stories live next to the components in `packages/ui/src`. This app only hosts
them, so the production app (`apps/mobile`) never bundles Storybook.

There are two ways to view the same stories.

## On a device or simulator (the source of truth)

```sh
npm run storybook            # from the repo root
```

Then press `i` for the iOS simulator or `a` for Android, or scan the QR code
with Expo Go. Every native module used here is one that Expo Go for SDK 57
already includes, so you don't need a development build.

- The theme follows the device. Switch the simulator to dark mode to see the
  dark theme.
- The on-device addons are controls (edit props live), actions (logs `onPress`
  and similar) and notes.

## In a browser

```sh
npm run storybook:web -w @nomos/storybook          # dev server on http://localhost:6006
npm run build-storybook:web -w @nomos/storybook    # static build in storybook-static/
```

This renders the same stories through react-native-web in the standard
Storybook UI. A **Theme** toolbar button switches between light and dark.
It's handy for reviewing on a laptop or sharing a static build. Check final
look and feel on a device, because web rendering differs in places: shadows,
fonts and the platform `Modal`.

## Files

| Path | Purpose |
| --- | --- |
| `.rnstorybook/main.ts` | On-device config: where stories are, which addons |
| `.rnstorybook/preview.tsx` | Global decorators and parameters for on-device |
| `.rnstorybook/index.tsx` | Storybook's root component, which `App.tsx` renders |
| `.rnstorybook/storybook.requires.ts` | Generated. Metro regenerates it on start, or run `npm run storybook-generate` |
| `.storybook/` | Browser Storybook config (`@storybook/react-native-web-vite`) |
| `decorators.tsx` | Wraps every story in `SafeAreaProvider`, `ThemeProvider` and the themed canvas |
| `metro.config.js` | Expo's default config wrapped in `withStorybook` |

Stories that need the whole screen (overlays, `Screen`) set
`parameters: { fullscreen: true }` to skip the padded scroll canvas.

## Why Storybook is pinned to 10.5.1

From 10.5.2, `@storybook/react-native` requires exactly
`react-native-safe-area-context@5.8.0`. Expo SDK 57, and so Expo Go, ships
5.7, and npm won't install a conflicting peer. Until Storybook loosens that
pin or Expo moves to 5.8:

- `@storybook/react-native` and the `addon-ondevice-*` packages are pinned to
  `10.5.1`.
- The root `package.json` `overrides` holds its internal UI packages at
  `10.5.1` too.

Bump all of these together.
