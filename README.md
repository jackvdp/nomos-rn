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
