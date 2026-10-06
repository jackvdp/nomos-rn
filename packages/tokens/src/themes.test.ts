import { contrastRatio } from './contrast';
import { themes, type ColorTokens, type ThemeTokens } from './themes';

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;

interface Pair {
  name: string;
  fg: string;
  bg: string;
  min: number;
}

function pairsFor({ colors: c }: { colors: ColorTokens }): Pair[] {
  const pairs: Pair[] = [];
  for (const bgName of ['canvas', 'surface', 'raised'] as const) {
    const bg = c.bg[bgName];
    pairs.push(
      { name: `text.primary on bg.${bgName}`, fg: c.text.primary, bg, min: AA_TEXT },
      { name: `text.secondary on bg.${bgName}`, fg: c.text.secondary, bg, min: AA_TEXT },
      { name: `text.tertiary on bg.${bgName}`, fg: c.text.tertiary, bg, min: AA_TEXT },
      { name: `text.link on bg.${bgName}`, fg: c.text.link, bg, min: AA_TEXT },
      { name: `text.danger on bg.${bgName}`, fg: c.text.danger, bg, min: AA_TEXT },
      { name: `text.success on bg.${bgName}`, fg: c.text.success, bg, min: AA_TEXT },
      { name: `action.tertiary.fg on bg.${bgName}`, fg: c.action.tertiary.fg, bg, min: AA_TEXT },
    );
  }
  pairs.push(
    { name: 'text.onBrand on bg.brand', fg: c.text.onBrand, bg: c.bg.brand, min: AA_TEXT },
    { name: 'text.inverse on bg.inverse', fg: c.text.inverse, bg: c.bg.inverse, min: AA_TEXT },
    { name: 'border.strong on bg.surface', fg: c.border.strong, bg: c.bg.surface, min: AA_NON_TEXT },
    { name: 'control.checked on bg.surface', fg: c.control.checked, bg: c.bg.surface, min: AA_NON_TEXT },
    { name: 'control.onChecked on control.checked', fg: c.control.onChecked, bg: c.control.checked, min: AA_NON_TEXT },
    { name: 'accent.onSolid on accent.solid', fg: c.accent.onSolid, bg: c.accent.solid, min: AA_TEXT },
    { name: 'accent.onSubtle on accent.subtle', fg: c.accent.onSubtle, bg: c.accent.subtle, min: AA_TEXT },
  );
  for (const name of ['primary', 'secondary', 'danger'] as const) {
    const a = c.action[name];
    pairs.push({ name: `action.${name}.fg on action.${name}.bg`, fg: a.fg, bg: a.bg, min: AA_TEXT });
    pairs.push({ name: `action.${name}.fg on action.${name}.bgPressed`, fg: a.fg, bg: a.bgPressed, min: AA_TEXT });
  }
  for (const [group, entries] of [
    ['tone', c.tone],
    ['context', c.context],
  ] as const) {
    for (const [name, t] of Object.entries(entries)) {
      pairs.push({ name: `${group}.${name}.onSolid on solid`, fg: t.onSolid, bg: t.solid, min: AA_TEXT });
      pairs.push({ name: `${group}.${name}.onSubtle on subtle`, fg: t.onSubtle, bg: t.subtle, min: AA_TEXT });
    }
  }
  return pairs;
}

describe.each(Object.values(themes) as ThemeTokens[])('$colorScheme theme', (theme) => {
  test.each(pairsFor(theme))('$name is at least $min:1', ({ fg, bg, min }) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});

test('contrastRatio matches known values', () => {
  expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  expect(contrastRatio('#FFF', '#FFF')).toBeCloseTo(1, 5);
  expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
});
