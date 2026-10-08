import type { Space } from '@nomos/tokens';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Text } from '../Text';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerEmphasis = 'subtle' | 'default';

export interface DividerProps extends Omit<ViewProps, 'children'> {
  /** `horizontal` (the default) spans the width; `vertical` spans the height of a row. */
  orientation?: DividerOrientation;
  /** `default` (the default) for separating sections; `subtle` inside dense lists. */
  emphasis?: DividerEmphasis;
  /**
   * Space before the line: at the start edge when horizontal (e.g. to line
   * up with list text), at both ends when vertical.
   */
  inset?: Space;
  /** Short text in the middle of a horizontal divider, e.g. "or". */
  label?: string;
}

/** A hairline that separates content. */
export function Divider({
  orientation = 'horizontal',
  emphasis = 'default',
  inset,
  label,
  style,
  ...rest
}: DividerProps) {
  const theme = useTheme();
  const styles = useStyles();
  const color = theme.colors.border[emphasis];
  const insetPx = inset ? theme.space[inset] : 0;

  if (orientation === 'vertical') {
    return (
      <View
        role="separator"
        style={[styles.vertical, { backgroundColor: color, marginVertical: insetPx }, style]}
        {...rest}
      />
    );
  }

  if (label) {
    const line = <View aria-hidden style={[styles.line, { backgroundColor: color }]} />;
    return (
      <View style={[styles.labelled, { marginStart: insetPx }, style]} {...rest}>
        {line}
        <Text variant="caption" color="secondary">
          {label}
        </Text>
        {line}
      </View>
    );
  }

  return (
    <View
      role="separator"
      style={[styles.horizontal, { backgroundColor: color, marginStart: insetPx }, style]}
      {...rest}
    />
  );
}

const useStyles = makeStyles((t) => ({
  horizontal: {
    alignSelf: 'stretch',
    height: StyleSheet.hairlineWidth,
  },
  vertical: {
    alignSelf: 'stretch',
    width: StyleSheet.hairlineWidth,
  },
  labelled: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: t.space.md,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
}));
