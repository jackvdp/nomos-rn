import { amber, cyan, green, navy, red, slate, violet } from './palette';

/**
 * A colour set for one meaning, used by any component that takes a `tone`
 * (Tag, Badge, Banner, Toast) or a context kind (ContextLabel).
 *
 * - `solid` / `onSolid`: filled background and the text or icon on it.
 * - `subtle` / `onSubtle`: tinted background and the text or icon on it.
 * - `border`: outline that sits with `subtle`.
 */
export interface ToneColors {
  solid: string;
  onSolid: string;
  subtle: string;
  onSubtle: string;
  border: string;
}

export type Tone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/**
 * The three places a NOMOS user can be (product model, September 2026):
 * an organisation's private workplace, the shared Network, or a shared
 * workspace. The colour per kind is our proposal, not a NOMOS decision, and
 * components always pair it with an icon and a name so colour is never the
 * only signal.
 */
export type ContextKind = 'organisation' | 'network' | 'workspace';

export interface ActionColors {
  bg: string;
  bgPressed: string;
  fg: string;
  border: string;
}

export interface ColorTokens {
  bg: {
    /** Screen background, behind cards. */
    canvas: string;
    /** Cards, list rows, inputs. */
    surface: string;
    /** Sheets, dialogs, toasts: anything above the page. */
    raised: string;
    /** Wells and grouped backgrounds inside a surface. */
    sunken: string;
    /** Brand-coloured areas such as a header band. */
    brand: string;
    /** Opposite-scheme background, e.g. a tooltip. */
    inverse: string;
    /** Scrim behind modals. */
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    /** Metadata and placeholders. Still meets 4.5:1 on surface. */
    tertiary: string;
    disabled: string;
    inverse: string;
    link: string;
    onBrand: string;
    /** Error messages and destructive labels on surface. */
    danger: string;
    success: string;
  };
  border: {
    subtle: string;
    default: string;
    /** Input outlines. Meets 3:1 against surface for non-text contrast. */
    strong: string;
    focus: string;
  };
  action: {
    primary: ActionColors;
    secondary: ActionColors;
    tertiary: ActionColors;
    danger: ActionColors;
    disabled: { bg: string; fg: string; border: string };
  };
  control: {
    /** Checked checkbox, selected radio, switch track when on. */
    checked: string;
    onChecked: string;
    /** Switch track when off. */
    track: string;
    thumb: string;
  };
  accent: ToneColors;
  tone: Record<Tone, ToneColors>;
  context: Record<ContextKind, ToneColors>;
  skeleton: { base: string; highlight: string };
}

export interface ShadowTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
}

export interface ThemeTokens {
  colorScheme: 'light' | 'dark';
  colors: ColorTokens;
  /** CSS box-shadow strings. React Native supports these on the New Architecture. */
  shadows: ShadowTokens;
}

const white = slate[0];

export const light: ThemeTokens = {
  colorScheme: 'light',
  colors: {
    bg: {
      canvas: slate[50],
      surface: white,
      raised: white,
      sunken: slate[100],
      brand: navy[700],
      inverse: navy[900],
      overlay: 'rgba(7, 17, 36, 0.48)',
    },
    text: {
      primary: slate[900],
      secondary: slate[600],
      tertiary: slate[500],
      disabled: slate[400],
      inverse: white,
      link: cyan[700],
      onBrand: white,
      danger: red[600],
      success: green[700],
    },
    border: {
      subtle: slate[100],
      default: slate[200],
      strong: slate[500],
      focus: cyan[500],
    },
    action: {
      primary: { bg: navy[700], bgPressed: navy[800], fg: white, border: navy[700] },
      secondary: { bg: white, bgPressed: slate[100], fg: navy[700], border: slate[300] },
      tertiary: { bg: 'transparent', bgPressed: slate[100], fg: navy[600], border: 'transparent' },
      danger: { bg: red[600], bgPressed: red[700], fg: white, border: red[600] },
      disabled: { bg: slate[100], fg: slate[400], border: slate[200] },
    },
    control: {
      checked: navy[700],
      onChecked: white,
      track: slate[300],
      thumb: white,
    },
    accent: { solid: cyan[700], onSolid: white, subtle: cyan[50], onSubtle: cyan[800], border: cyan[200] },
    tone: {
      brand: { solid: navy[700], onSolid: white, subtle: navy[50], onSubtle: navy[700], border: navy[100] },
      neutral: { solid: slate[600], onSolid: white, subtle: slate[100], onSubtle: slate[700], border: slate[200] },
      info: { solid: cyan[700], onSolid: white, subtle: cyan[50], onSubtle: cyan[800], border: cyan[200] },
      success: { solid: green[600], onSolid: white, subtle: green[50], onSubtle: green[700], border: green[200] },
      warning: { solid: amber[300], onSolid: amber[950], subtle: amber[50], onSubtle: amber[800], border: amber[200] },
      danger: { solid: red[600], onSolid: white, subtle: red[50], onSubtle: red[700], border: red[200] },
    },
    context: {
      organisation: { solid: navy[700], onSolid: white, subtle: navy[50], onSubtle: navy[700], border: navy[100] },
      network: { solid: cyan[700], onSolid: white, subtle: cyan[50], onSubtle: cyan[800], border: cyan[200] },
      workspace: { solid: violet[600], onSolid: white, subtle: violet[50], onSubtle: violet[700], border: violet[100] },
    },
    skeleton: { base: slate[200], highlight: slate[100] },
  },
  shadows: {
    none: 'none',
    sm: '0px 1px 2px rgba(12, 27, 54, 0.06), 0px 1px 3px rgba(12, 27, 54, 0.10)',
    md: '0px 2px 4px rgba(12, 27, 54, 0.06), 0px 4px 12px rgba(12, 27, 54, 0.10)',
    lg: '0px 4px 8px rgba(12, 27, 54, 0.08), 0px 12px 32px rgba(12, 27, 54, 0.16)',
  },
};

export const dark: ThemeTokens = {
  colorScheme: 'dark',
  colors: {
    bg: {
      canvas: navy[950],
      surface: navy[900],
      raised: navy[800],
      sunken: '#050C1A',
      brand: navy[800],
      inverse: slate[50],
      overlay: 'rgba(0, 0, 0, 0.6)',
    },
    text: {
      primary: slate[50],
      secondary: slate[300],
      tertiary: slate[400],
      disabled: slate[600],
      inverse: slate[900],
      link: cyan[300],
      onBrand: white,
      danger: red[300],
      success: green[300],
    },
    border: {
      subtle: navy[800],
      default: navy[700],
      strong: slate[500],
      focus: cyan[300],
    },
    action: {
      primary: { bg: cyan[400], bgPressed: cyan[300], fg: navy[950], border: cyan[400] },
      secondary: { bg: navy[900], bgPressed: navy[800], fg: slate[50], border: navy[600] },
      tertiary: { bg: 'transparent', bgPressed: navy[800], fg: cyan[300], border: 'transparent' },
      danger: { bg: red[400], bgPressed: red[300], fg: red[950], border: red[400] },
      disabled: { bg: navy[800], fg: slate[600], border: navy[700] },
    },
    control: {
      checked: cyan[400],
      onChecked: navy[950],
      track: navy[600],
      thumb: white,
    },
    accent: { solid: cyan[400], onSolid: navy[950], subtle: cyan[950], onSubtle: cyan[200], border: cyan[800] },
    tone: {
      brand: { solid: navy[300], onSolid: navy[950], subtle: navy[800], onSubtle: navy[100], border: navy[600] },
      neutral: { solid: slate[300], onSolid: slate[950], subtle: slate[800], onSubtle: slate[200], border: slate[700] },
      info: { solid: cyan[400], onSolid: navy[950], subtle: cyan[950], onSubtle: cyan[200], border: cyan[800] },
      success: { solid: green[400], onSolid: green[950], subtle: green[950], onSubtle: green[200], border: green[800] },
      warning: { solid: amber[300], onSolid: amber[950], subtle: amber[950], onSubtle: amber[200], border: amber[800] },
      danger: { solid: red[400], onSolid: red[950], subtle: red[950], onSubtle: red[200], border: red[800] },
    },
    context: {
      organisation: { solid: navy[300], onSolid: navy[950], subtle: navy[800], onSubtle: navy[100], border: navy[600] },
      network: { solid: cyan[400], onSolid: navy[950], subtle: cyan[950], onSubtle: cyan[200], border: cyan[800] },
      workspace: { solid: violet[300], onSolid: violet[950], subtle: violet[950], onSubtle: violet[200], border: violet[800] },
    },
    skeleton: { base: navy[800], highlight: navy[700] },
  },
  shadows: {
    none: 'none',
    sm: '0px 1px 2px rgba(0, 0, 0, 0.30)',
    md: '0px 2px 4px rgba(0, 0, 0, 0.30), 0px 4px 12px rgba(0, 0, 0, 0.35)',
    lg: '0px 4px 8px rgba(0, 0, 0, 0.35), 0px 12px 32px rgba(0, 0, 0, 0.45)',
  },
};

export const themes = { light, dark } as const;

export type ColorScheme = keyof typeof themes;
