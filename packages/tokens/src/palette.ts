/**
 * Raw colour scales. Components never read these directly: they go through
 * the semantic colours in `themes.ts`, so a scale can be retuned without
 * touching component code.
 *
 * PLACEHOLDER VALUES. NOMOS's identity is "navy and cyan", but the exact brand
 * hex values were not available when these were written. Replace `navy[700]`
 * and `cyan[500]` (the two anchor shades) with the brand values and regenerate
 * the rest of each scale around them, then re-run the contrast tests.
 */

export const navy = {
  50: '#EEF2F8',
  100: '#D7DFEC',
  200: '#B0BFD9',
  300: '#8199C0',
  400: '#5874A6',
  500: '#3B5A8E',
  600: '#284575',
  700: '#1A345F',
  800: '#12264A',
  900: '#0C1B36',
  950: '#071124',
} as const;

export const cyan = {
  50: '#E9FAFD',
  100: '#C8F1F9',
  200: '#93E3F3',
  300: '#57D0EA',
  400: '#22BBDD',
  500: '#0AA2C5',
  600: '#0683A2',
  700: '#086884',
  800: '#0C546A',
  900: '#0E4458',
  950: '#062C3A',
} as const;

export const slate = {
  0: '#FFFFFF',
  25: '#FAFBFC',
  50: '#F3F5F8',
  100: '#E8ECF1',
  200: '#D5DBE3',
  300: '#B5BFCC',
  400: '#8A96A7',
  500: '#5E6D82',
  600: '#4A576A',
  700: '#364152',
  800: '#232B38',
  900: '#161C26',
  950: '#0C1017',
} as const;

export const green = {
  50: '#EAF8F0',
  100: '#CDEFDB',
  200: '#9EDFB9',
  300: '#68CB93',
  400: '#38B26F',
  500: '#1E9759',
  600: '#167A48',
  700: '#12613A',
  800: '#0F4D2F',
  900: '#0B3B24',
  950: '#062415',
} as const;

export const amber = {
  50: '#FFF7E6',
  100: '#FEEBC2',
  200: '#FCD687',
  300: '#F8BE4D',
  400: '#EEA524',
  500: '#D28A0C',
  600: '#AA6D07',
  700: '#855407',
  800: '#66410A',
  900: '#4D310A',
  950: '#2D1C04',
} as const;

export const red = {
  50: '#FDEEEE',
  100: '#FAD5D5',
  200: '#F4ABAB',
  300: '#EC7F7F',
  400: '#E25757',
  500: '#CF3A3A',
  600: '#AE2C2C',
  700: '#8C2424',
  800: '#6E1E1E',
  900: '#541818',
  950: '#330D0D',
} as const;

export const violet = {
  50: '#F3F0FD',
  100: '#E4DDFA',
  200: '#C8BBF4',
  300: '#A994EC',
  400: '#8B6FE2',
  500: '#7052D3',
  600: '#5B40B4',
  700: '#483291',
  800: '#382871',
  900: '#2A1F55',
  950: '#191233',
} as const;

export const palette = { navy, cyan, slate, green, amber, red, violet } as const;

export type Palette = typeof palette;
