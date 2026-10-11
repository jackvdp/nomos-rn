import type { Space } from '@nomos/tokens';
import type { ReactNode, Ref } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { makeStyles, useTheme } from '../../theme';

export type ScreenEdge = Edge;

export interface ScreenProps extends Omit<ViewProps, 'style'> {
  children?: ReactNode;
  /**
   * Wraps the content in a ScrollView. Taps on buttons register while the
   * keyboard is open, and on iOS the content moves above the keyboard.
   */
  scroll?: boolean;
  /** The ScrollView, when `scroll`. */
  scrollRef?: Ref<ScrollView>;
  /**
   * With `scroll`, lets the content scroll up under the status bar instead
   * of being cut off below it. It still starts clear of it. For a screen with
   * a background of its own behind the status bar; over the canvas, the
   * content would run into the clock. Has no effect under a `header`.
   */
  scrollUnderStatusBar?: boolean;
  /**
   * Safe-area edges to keep clear of the notch, status bar and home
   * indicator. Defaults to `['top', 'bottom']`; add `left` and `right` for
   * landscape.
   */
  edges?: readonly ScreenEdge[];
  /** Padding around the content. Defaults to `lg`. */
  padding?: Space;
  /**
   * Fixed above the content, below the top inset. Not padded, so an app bar
   * can run edge to edge.
   */
  header?: ReactNode;
  /**
   * Pinned to the bottom, above the bottom inset (and the keyboard on iOS
   * when `scroll`). Use it for the screen's primary action.
   */
  footer?: ReactNode;
  /** iOS: height of anything above the screen, such as a navigator's header. */
  keyboardVerticalOffset?: number;
  style?: StyleProp<ViewStyle>;
  /** Style for the content area (the ScrollView's content container when `scroll`). */
  contentStyle?: StyleProp<ViewStyle>;
}

const defaultEdges: readonly ScreenEdge[] = ['top', 'bottom'];

/**
 * The root of every screen: canvas background, safe-area insets, content
 * padding and optional header and footer slots.
 */
export function Screen({
  children,
  scroll = false,
  scrollRef,
  scrollUnderStatusBar = false,
  edges = defaultEdges,
  padding = 'lg',
  header,
  footer,
  keyboardVerticalOffset = 0,
  style,
  contentStyle,
  ...rest
}: ScreenProps) {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const inset = (edge: ScreenEdge) => (edges.includes(edge) ? insets[edge] : 0);
  const gutter = theme.space[padding];
  const top = inset('top');
  const bottom = inset('bottom');
  // The content then clears the top inset instead of the screen. A header
  // stays put below the inset, so under one the content has nothing to clear.
  const scrollsUnder = scroll && scrollUnderStatusBar && !header;
  const contentPadding = {
    padding: gutter,
    paddingTop: gutter + (scrollsUnder ? top : 0),
    // With a footer, the footer clears the bottom inset instead of the content.
    paddingBottom: gutter + (footer ? 0 : bottom),
  };

  const body = (
    <>
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          style={styles.fill}
          contentContainerStyle={[styles.grow, contentPadding, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, contentPadding, contentStyle]}>{children}</View>
      )}
      {footer ? (
        <View
          style={[
            styles.footer,
            { paddingHorizontal: gutter, paddingBottom: theme.space.md + bottom },
          ]}
        >
          {footer}
        </View>
      ) : null}
    </>
  );

  return (
    <View
      style={[
        styles.root,
        // Insets are physical: a landscape notch is on the device's left
        // whatever the reading direction, so these are not start/end.
        {
          paddingTop: scrollsUnder ? 0 : top,
          paddingLeft: inset('left'),
          paddingRight: inset('right'),
        },
        style,
      ]}
      {...rest}
    >
      {header}
      {scroll && Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={styles.fill}
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.bg.canvas,
  },
  fill: {
    flex: 1,
  },
  grow: {
    flexGrow: 1,
  },
  footer: {
    gap: t.space.sm,
    paddingTop: t.space.md,
    borderTopWidth: t.borderWidths.thin,
    borderTopColor: t.colors.border.subtle,
    backgroundColor: t.colors.bg.canvas,
  },
}));
