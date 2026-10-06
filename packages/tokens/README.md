# @nomos/tokens

The NOMOS design decisions as plain TypeScript values: colour, spacing, type,
radii, elevation, motion and sizes. It has no React or React Native imports,
so the same values could feed a web stylesheet, a Figma plugin or a docs site.

Components don't import from here directly. They read the theme that
`@nomos/ui` builds from these tokens (`useTheme()` / `makeStyles()`).

## What's in it

| File | Exports |
| --- | --- |
| `palette.ts` | Raw colour scales: `navy`, `cyan`, `slate`, `green`, `amber`, `red`, `violet` |
| `themes.ts` | `light` and `dark` semantic colours and shadows, plus the `ColorTokens`, `Tone` and `ContextKind` types |
| `scale.ts` | `space`, `radii`, `borderWidths`, `sizes`, `opacity`, `duration`, `easing`, `zIndex`, `breakpoints` |
| `typography.ts` | `textVariants` (the type scale), `fontWeight`, `fontFamily` |
| `contrast.ts` | `contrastRatio(fg, bg)`, the WCAG contrast formula |

## Two layers of colour

1. **Palette**: raw scales such as `navy[700]`. Only `themes.ts` reads these.
2. **Semantic colours**: names describe what the colour is for, e.g.
   `colors.text.secondary`, `colors.action.primary.bg`,
   `colors.tone.warning.subtle` and `colors.context.organisation.solid`. Each
   name has a value in `light` and one in `dark`.

Components only use semantic names. So dark mode, a brand refresh or an
accessibility fix is a change in `themes.ts`, not in every component.

## Placeholder brand values

NOMOS's identity is navy and cyan, but its exact brand hex values weren't
available when the scales were written. To swap them in:

1. Put the brand navy at `navy[700]` and the brand cyan at `cyan[500]`, then
   rebuild the rest of each scale around them.
2. Run `npm test -w @nomos/tokens`.

The tests check every text/background pair in both themes against WCAG AA:
4.5:1 for text, 3:1 for borders, icons and controls. If a pair fails, adjust
the semantic mapping in `themes.ts` rather than relaxing the test.

The colour for each context (organisation navy, Network cyan, workspace
violet) is our proposal, not a NOMOS decision.

## Fonts

`fontFamily.sans` is `undefined`, so text uses the platform font (San
Francisco on iOS, Roboto on Android). When NOMOS supplies a typeface, set it
here and load the font files in each app with `expo-font`.
