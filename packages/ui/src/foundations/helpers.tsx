// Building blocks for the Foundations stories. Not exported from the package.
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Icon } from '../components/Icon';
import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { makeStyles, useTheme } from '../theme';

/** Fixed tile widths keep grids tidy; no token exists for documentation tiles. */
const swatchWidth = 160;
const tileWidth = 104;

export function Page({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <Stack gap="xxl">
      <Stack gap="xs">
        <Text variant="headingLg">{title}</Text>
        {intro ? <Text color="secondary">{intro}</Text> : null}
      </Stack>
      {children}
    </Stack>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Stack gap="md">
      <Stack gap="xxs">
        <Text variant="headingSm">{title}</Text>
        {description ? (
          <Text variant="bodySm" color="secondary">
            {description}
          </Text>
        ) : null}
      </Stack>
      {children}
    </Stack>
  );
}

/** A highlighted caption for caveats such as placeholder values. */
export function Note({ children }: { children: string }) {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.note}>
      <Icon name="warning" size="sm" color={theme.colors.tone.warning.onSubtle} />
      <Text variant="bodySm" style={[styles.noteText, styles.flexShrink]}>
        {children}
      </Text>
    </View>
  );
}

export function Grid({ children }: { children: ReactNode }) {
  return (
    <Stack direction="row" wrap gap="md">
      {children}
    </Stack>
  );
}

/** A colour chip with its token path and value. */
export function Swatch({ color, name, note }: { color: string; name: string; note?: string }) {
  const styles = useStyles();
  return (
    <View style={styles.swatch}>
      <View style={[styles.chip, { backgroundColor: color }]} />
      <View style={styles.swatchText}>
        <Text variant="labelSm" numberOfLines={2} selectable>
          {name}
        </Text>
        <Text variant="caption" color="secondary" selectable>
          {color}
        </Text>
        {note ? (
          <Text variant="caption" color="tertiary">
            {note}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/** A small centred tile with a visual on top and labels below, e.g. an icon. */
export function Tile({
  children,
  name,
  detail,
}: {
  children: ReactNode;
  name: string;
  detail?: string;
}) {
  const styles = useStyles();
  return (
    <View style={styles.tile}>
      <View style={styles.tileVisual}>{children}</View>
      <Text variant="labelSm" align="center" numberOfLines={1} selectable>
        {name}
      </Text>
      {detail ? (
        <Text variant="caption" color="tertiary" align="center" numberOfLines={1}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

/** Turns a nested token object into `[{ path, value }]`, e.g. `colors.action.primary.bg`. */
export function flattenTokens(tree: object, prefix: string): { path: string; value: string }[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? flattenTokens(value, `${prefix}.${key}`)
      : [{ path: `${prefix}.${key}`, value: String(value) }],
  );
}

const useStyles = makeStyles((t) => ({
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: t.space.sm,
    padding: t.space.md,
    borderRadius: t.radii.md,
    borderWidth: t.borderWidths.thin,
    backgroundColor: t.colors.tone.warning.subtle,
    borderColor: t.colors.tone.warning.border,
  },
  noteText: {
    color: t.colors.tone.warning.onSubtle,
  },
  flexShrink: {
    flexShrink: 1,
  },
  swatch: {
    width: swatchWidth,
    borderRadius: t.radii.md,
    borderWidth: t.borderWidths.thin,
    borderColor: t.colors.border.default,
    backgroundColor: t.colors.bg.surface,
    overflow: 'hidden',
  },
  chip: {
    height: t.space.xxxl,
    borderBottomWidth: t.borderWidths.thin,
    borderBottomColor: t.colors.border.default,
  },
  swatchText: {
    padding: t.space.sm,
    gap: t.space.xxs,
  },
  tile: {
    width: tileWidth,
    alignItems: 'center',
    gap: t.space.xxs,
    padding: t.space.sm,
    borderRadius: t.radii.md,
    borderWidth: t.borderWidths.thin,
    borderColor: t.colors.border.subtle,
    backgroundColor: t.colors.bg.surface,
  },
  tileVisual: {
    minHeight: t.space.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
