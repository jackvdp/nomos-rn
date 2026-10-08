import type { ContextKind } from '@nomos/tokens';
import { View, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';

export type ContextLabelSize = 'sm' | 'md';
export type ContextLabelVariant = 'subtle' | 'solid';

export interface ContextLabelParts {
  kind: ContextKind;
  name: string;
  audience?: string;
}

export interface ContextLabelProps extends Omit<ViewProps, 'children'> {
  /** Where the content lives: an organisation's workplace, the Network, or a workspace. */
  kind: ContextKind;
  /** e.g. "Northshire Electoral Commission", "NOMOS Network", "Polling logistics workspace". */
  name: string;
  /** Who can see it, e.g. "Members only" or "Public to the Network". Shown after the name. */
  audience?: string;
  /** `sm` (the default) for post headers and rows; `md` for screen headers and composers. */
  size?: ContextLabelSize;
  /** `subtle` (the default) tinted pill; `solid` for headers on a plain background. */
  variant?: ContextLabelVariant;
  /** Builds what screen readers hear. The default reads the name, then the audience. */
  formatAccessibilityLabel?: (parts: ContextLabelParts) => string;
}

/** The icon for each context kind, for any UI that names a context. */
export const contextIcons = {
  organisation: 'building',
  network: 'globe',
  workspace: 'layers',
} as const satisfies Record<ContextKind, IconName>;

const defaultFormatAccessibilityLabel = ({ name, audience }: ContextLabelParts) =>
  audience ? `${name}, ${audience}` : name;

/**
 * Answers "where am I, and who can see this?". Use it in headers, post
 * headers and composers wherever content could belong to more than one
 * context. Colour, icon and text all carry the kind.
 */
export function ContextLabel({
  kind,
  name,
  audience,
  size = 'sm',
  variant = 'subtle',
  formatAccessibilityLabel = defaultFormatAccessibilityLabel,
  style,
  'aria-label': ariaLabel,
  ...rest
}: ContextLabelProps) {
  const theme = useTheme();
  const styles = useStyles();
  const colors = theme.colors.context[kind];
  const solid = variant === 'solid';
  const fg = solid ? colors.onSolid : colors.onSubtle;
  const textVariant = size === 'sm' ? 'caption' : 'labelSm';

  return (
    <View
      accessible
      aria-label={ariaLabel ?? formatAccessibilityLabel({ kind, name, audience })}
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        {
          backgroundColor: solid ? colors.solid : colors.subtle,
          borderColor: solid ? colors.solid : colors.border,
        },
        style,
      ]}
      {...rest}
    >
      <Icon name={contextIcons[kind]} size={size === 'sm' ? 'xs' : 'sm'} color={fg} />
      {/*
        One line of text, so truncation eats the audience before the name.
        Separate flex items would shave sub-pixels off the name and ellipsise it.
      */}
      <Text
        variant={textVariant}
        weight="regular"
        numberOfLines={1}
        style={[styles.text, { color: fg }]}
      >
        <Text variant={textVariant} weight="semibold" style={{ color: fg }}>
          {name}
        </Text>
        {audience ? (
          <>
            {'  ·  '}
            <Text variant={textVariant} weight="regular" style={{ color: fg }}>
              {audience}
            </Text>
          </>
        ) : null}
      </Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    borderRadius: t.radii.full,
    borderWidth: t.borderWidths.thin,
  },
  sm: {
    gap: t.space.xs,
    paddingHorizontal: t.space.sm - t.borderWidths.thin,
    paddingVertical: t.space.xxs - t.borderWidths.thin,
  },
  md: {
    gap: t.space.xs,
    paddingHorizontal: t.space.md - t.borderWidths.thin,
    paddingVertical: t.space.xs - t.borderWidths.thin,
  },
  text: {
    flexShrink: 1,
  },
}));
