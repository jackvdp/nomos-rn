import type { Space } from '@nomos/tokens';
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';

export interface StackProps extends ViewProps {
  /** `column` (the default) stacks vertically; `row` lays out horizontally. */
  direction?: 'column' | 'row';
  /** Space between children. */
  gap?: Space;
  padding?: Space;
  paddingHorizontal?: Space;
  paddingVertical?: Space;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
  /** Shorthand for `flex: 1`. */
  fill?: boolean;
}

/**
 * Layout primitive: lays out children with consistent gaps from the spacing
 * scale, so screens don't hand-roll margins. Uses logical properties, so it
 * mirrors correctly in right-to-left languages.
 */
export function Stack({
  direction = 'column',
  gap,
  padding,
  paddingHorizontal,
  paddingVertical,
  align,
  justify,
  wrap,
  fill,
  style,
  ...rest
}: StackProps) {
  const { space } = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap: gap && space[gap],
          padding: padding && space[padding],
          paddingHorizontal: paddingHorizontal && space[paddingHorizontal],
          paddingVertical: paddingVertical && space[paddingVertical],
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : undefined,
          flex: fill ? 1 : undefined,
        },
        style,
      ]}
      {...rest}
    />
  );
}
