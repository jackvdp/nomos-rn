# NOMOS mobile

The React Native app for NOMOS, plus its design library, in one npm-workspaces
monorepo.

```
nomos-rn/
├── apps/
│   ├── mobile/        @nomos/mobile     the Expo app that ships to users
│   └── storybook/     @nomos/storybook  Storybook host app (device + browser)
├── packages/
│   ├── tokens/        @nomos/tokens     design tokens, plain TypeScript
│   └── ui/            @nomos/ui         theme + components, built on tokens
└── background/        context notes for whoever works in this repo
```

Dependencies only point one way: **apps → ui → tokens**. `tokens` knows
nothing about React Native, `ui` knows nothing about the apps, and an app can
only use what a package exports from its `index.ts`.

## Commands

Run everything from the repo root.

```sh
npm install                 # installs and links every workspace
npm run mobile              # start the app (Expo)
npm run storybook           # start on-device Storybook (Expo)
npm run typecheck           # tsc in every workspace
npm test                    # Jest in every workspace
npm run test:visual -w @nomos/mobile   # screenshot comparison on the iOS simulator
```

To run a script in a single workspace, use `-w`, e.g.
`npm test -w @nomos/ui` or `npm run storybook:web -w @nomos/storybook`.

## How the packages work

- **No build step.** Each package's `exports` points at `src/index.ts`, and
  Metro compiles the TypeScript like app code, so an edit in `packages/ui`
  hot-reloads in both apps. Since SDK 52, Expo detects the workspace and
  configures Metro for it, so no app needs a custom Metro config for the
  monorepo.
- **Peer dependencies.** `@nomos/ui` lists `react`, `react-native`,
  `react-native-safe-area-context` and `@expo/vector-icons` as
  `peerDependencies`, so each app provides one shared copy.
- **Adding a dependency.** Use `npm install <pkg> -w @nomos/ui` for a plain
  JS package. For anything with native code, install it in each app with
  `npx expo install <pkg>`, run from that app's folder so Expo picks the
  SDK-matched version, and add it to the library's `peerDependencies` if the
  library uses it.

## Visual regression test

`npm run test:visual -w @nomos/mobile` opens the app on the iOS simulator,
screenshots the sign-in screen in light and dark mode, and compares each
screenshot with its reference image in `apps/mobile/.maestro/screenshots/`.
It fails when a screenshot is less than a 99.9% match for its reference, and
leaves a `_diff.png` beside the reference with the changed areas boxed in red.

Set up once:

```sh
brew tap mobile-dev-inc/tap
brew trust --formula mobile-dev-inc/tap/maestro
brew install mobile-dev-inc/tap/maestro git-lfs
git lfs install
```

Before each run:

- Boot the **iPhone 16e** simulator. The references were recorded on it, on
  iOS 18.6, and another model has a different screen.
- Start the dev server with `npm run mobile` and open the app in Expo Go once.

After a change that is meant to alter the screen, run
`npm run test:visual:update -w @nomos/mobile`, look at the new images, and
commit them.

How it works:

- [Maestro](https://maestro.dev) drives the simulator. The steps are in
  `apps/mobile/.maestro/sign-in.yaml`.
- `apps/mobile/.maestro/run.sh` sets what would otherwise differ between
  machines: light or dark mode, and Expo Go's floating tools button, which it
  hides. It puts both back when it finishes.
- Each screenshot is cropped to the safe area, so it includes the screen's
  padding but not the status bar or home indicator, which iOS draws
  differently from one moment to the next.
- The reference images are stored with Git LFS.

It covers only the first screen. The states that follow a sign-in attempt need
a reply from the server, and the app in Expo Go always talks to the real one.

## Version pins in the root package.json

`overrides` is there for two reasons:

- **`react` / `react-dom` at 19.2.3.** One Expo package has an open
  `react: *` peer, and without the override npm hoists the newest React
  (19.3) to the root while the workspaces nest 19.2.3. Two copies of React in
  one bundle is the classic monorepo "Invalid hook call" bug. Keep this in
  step with the version Expo's SDK expects. `npm ls react` should show a
  single version.
- **`@storybook/react-native-ui*` at 10.5.1.** See
  [apps/storybook/README.md](apps/storybook/README.md#why-storybook-is-pinned-to-1051).

## Managed Expo vs a bare app

The native `ios/` and `android/` projects here are generated from app config
(`npx expo prebuild`), not committed. In a bare React Native app, a monorepo
also touches the native side:

- Metro needs `watchFolders` and `nodeModulesPaths` set for the workspace root.
- The Podfile and `settings.gradle` refer to paths inside `node_modules`, and
  those paths move when dependencies are hoisted to the repo root.

Expo's autolinking and config handle both of those here.

## Further reading

- [packages/tokens/README.md](packages/tokens/README.md): tokens, semantic colours, placeholder brand values
- [packages/ui/README.md](packages/ui/README.md): using the library, conventions for adding components
- [apps/storybook/README.md](apps/storybook/README.md): running Storybook on a device and in the browser
