# Background: Jack's upcoming role at Chase

## Why this file exists

Jack Vanderpump is about to start a React Native role at Chase UK (part of JPMorgan Chase). Onboarding has cleared; he has not started yet and has no access to Chase's code or internal docs.

This repo builds a real React Native app for NOMOS, a company Jack works with. It has a second purpose: Jack is using it to get hands-on with the stack he will meet at Chase. Where a technical choice is open, prefer the option that matches Chase's stack below, unless it would clearly hurt the NOMOS app. If the two pull apart, say so and let Jack decide.

## Where this repo deliberately differs from Chase

Jack decided these on 5 October 2026. Do not "correct" them back towards Chase's stack.

- **Managed Expo, not bare React Native.** The native `ios/` and `android/` projects are generated from app config, not committed and hand-edited. Jack wants to be told, at the point it comes up, wherever the same thing would look very different in a bare app like Chase's.
- **Apollo Client over a REST backend.** NOMOS has a single REST API and no GraphQL endpoint. Jack wants practice with the Apollo cache, so the app uses Apollo Client with the GraphQL schema and resolvers running inside the app, where the resolvers call REST. There is no gateway server. Chase, by contrast, talks to real GraphQL services. The resolvers return mock data until Jack has API access. If NOMOS later agrees to host a gateway, the same schema and resolvers can move to it without changing the app's queries.
- **The React Native version follows the Expo SDK.** Expo SDK 57 ships React Native 0.86. The New Architecture is on.

One choice follows Chase exactly: navigation uses React Navigation directly (native stack and bottom tabs), not Expo Router.

The app will ship to real NOMOS users on iOS and Android and is a long-term build. Jack starts at Chase in early November 2026.

## Source

Everything under "What Chase told us" comes from one email from Rhiad Jaffar at Chase, replying to questions Jack sent on 1 October 2026. Rhiad answered "broadly" and held detail back for Jack's first week. Treat it as an accurate outline, not a specification.

## What Chase told us

| Area | Chase's answer |
| --- | --- |
| React Native version | "A current 0.8x version", kept "reasonably close to upstream". |
| Navigation | React Navigation, with native stack and bottom tabs. |
| Data fetching | Mostly GraphQL through Apollo Client. Most screen-level data comes from collocated queries. |
| REST | Used "in a few choice places", mostly for auth. |
| State management | Mostly local component state. Apollo cache for server state. A small amount of app-level state through internal utilities. No Redux, MobX or Zustand app-wide. |
| New Architecture | Not fully enabled yet. Migration work is in flight and Jack "may well end up contributing". |
| Expo | Not an Expo-managed app. They do use Expo Modules, plus a growing set of first-party and in-house Expo modules for native functionality. "The direction of travel is more Expo, not less." |

## Reading Chase recommended before day one

- Browse the Chase UK app and website to learn the customer product and its features.
- Skim the React Native docs and the React Navigation docs.
- Refresh GraphQL and Apollo Client fundamentals: queries, mutations, cache.

## What we do not know

Chase will not share internal repos, manuals, recorded sessions, ADRs or architecture docs until Jack has access on day one. A walkthrough is planned for his first week. So the following are unknown, and anything this repo does in these areas is a guess:

- The exact React Native version, and the Apollo Client and React Navigation major versions.
- What the "internal utilities" for app-level state look like.
- Repo structure (single app or monorepo, how features are split).
- Testing tools, styling approach, design system, CI and release process.
- How far the New Architecture migration has got, and what is blocking it.

## Notes and inferences (ours, not Chase's)

- React Native 0.82 (October 2025) removed the option to turn the New Architecture off. "0.8x" together with "not fully enabled" therefore suggests either Chase is on 0.80 or 0.81, or they are on a later version and still lean on the interop layer for older native modules. Worth asking in week one.
- The email's heading "New Architecture (Expo)" covers two separate things: the New Architecture (Fabric, Turbo Modules) and Expo adoption. The table above splits them.
- "Not Expo-managed, but uses Expo Modules" describes a bare React Native app with committed `ios/` and `android/` projects and the Expo Modules runtime installed on top. It rules out Expo Router as their navigation layer.
- As of 5 October 2026 the current releases are React Native 0.87, Expo SDK 57, Apollo Client 4.3 and React Navigation 7.
