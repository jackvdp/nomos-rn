import { textVariants } from '@nomos/tokens';
import { useEffect, useRef, useState, type Ref } from 'react';
import {
  AccessibilityInfo,
  I18nManager,
  Platform,
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { makeStyles, useTheme, type Theme } from '../../theme';
import { useReducedMotion } from '../../utils';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';

/** An icon button at the end of the field, such as "Scan QR code". */
export interface TextFieldAction {
  icon: IconName;
  /** Accessibility label for the button. */
  label: string;
  onPress: () => void;
}

export interface TextFieldProps extends Omit<
  TextInputProps,
  'style' | 'editable' | 'placeholderTextColor' | 'value'
> {
  /**
   * Visible label, inside the field. It sits where the text goes while the
   * field is empty, and moves up out of the way when the field is focused or
   * filled. Also the input's accessibility label.
   */
  label: string;
  value: string;
  /** Guidance under the field. Hidden while `errorText` is shown. */
  helperText?: string;
  /** Marks the field invalid and explains why. Announced to screen readers when it appears. */
  errorText?: string;
  /** Shows a required marker next to the label. */
  required?: boolean;
  /** Read to screen readers for required fields. */
  requiredLabel?: string;
  disabled?: boolean;
  leadingIcon?: IconName;
  /** Decorative icon at the end of the field. */
  trailingIcon?: IconName;
  trailingAction?: TextFieldAction;
  /** Hides the text and adds a show/hide toggle. */
  secureTextEntry?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
  /** Height of a multiline field, in lines. Defaults to 4. */
  numberOfLines?: number;
  /** Shows a character counter when `maxLength` is set. Defaults to true. */
  showCount?: boolean;
  /** Screen reader text for the counter. */
  formatCountLabel?: (count: number, max: number) => string;
  /** Style for the outer container. */
  style?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
}

const defaultCountLabel = (count: number, max: number) => `${count} of ${max} characters`;

const { body, caption } = textVariants;
// The label shrinks to caption size when it moves up.
const raisedLabelScale = caption.fontSize / body.fontSize;
const raisedLabelHeight = body.lineHeight * raisedLabelScale;
// iOS draws text at the bottom of its line, not in the middle. A typeface's
// own line is about 1.2 times its size, so in a taller line the text sits low
// by half the difference.
const iosTextSag = Platform.OS === 'ios' ? (body.lineHeight - 1.2 * body.fontSize) / 2 : 0;
// How far the glow reaches round a focused field, and how strong it is.
const haloSpread = 4;
const haloOpacity = 0.2;

/**
 * A labelled text input for forms: sign-in, profile details, incident
 * reports. Always shows its label; use SearchField for search boxes.
 */
export function TextField({
  label,
  value,
  helperText,
  errorText,
  required = false,
  requiredLabel = 'Required',
  disabled = false,
  leadingIcon,
  trailingIcon,
  trailingAction,
  secureTextEntry = false,
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
  multiline = false,
  numberOfLines = 4,
  maxLength,
  showCount = true,
  formatCountLabel = defaultCountLabel,
  style,
  ref,
  'aria-label': ariaLabel,
  accessibilityHint,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const invalid = Boolean(errorText);
  useAnnounceError(errorText);

  const ringColor = focused
    ? theme.colors.border.focus
    : invalid
      ? theme.colors.border.danger
      : undefined;
  const iconColor = disabled ? theme.colors.text.disabled : theme.colors.text.secondary;
  const counting = maxLength !== undefined && showCount;
  const message = errorText ?? helperText;
  const iconSlop = (theme.sizes.touchTarget - theme.sizes.icon.md) / 2;
  // The label is up out of the way whenever there is, or may soon be, text under it.
  const raised = focused || value.length > 0;
  const motion = useFieldMotion(raised, focused && !disabled, multiline);
  const labelColor = disabled ? 'disabled' : invalid ? 'danger' : focused ? 'link' : 'secondary';

  return (
    <View style={style}>
      <View>
        {/* A soft glow round the field while it has focus. */}
        <Animated.View
          style={[styles.halo, { backgroundColor: theme.colors.border.focus }, motion.haloStyle]}
        />
        <View
          style={[
            styles.field,
            multiline && styles.fieldMultiline,
            {
              backgroundColor: disabled ? theme.colors.action.disabled.bg : theme.colors.bg.surface,
              borderColor: disabled
                ? theme.colors.action.disabled.border
                : (ringColor ?? theme.colors.border.strong),
            },
            // An outline on top of the border makes a 2dp ring without shifting the layout.
            ringColor !== undefined && !disabled && [styles.ring, { outlineColor: ringColor }],
          ]}
        >
          {leadingIcon ? (
            <Icon
              name={leadingIcon}
              color={focused && !disabled ? theme.colors.text.link : iconColor}
              style={multiline && styles.iconMultiline}
            />
          ) : null}
          <View style={styles.body}>
            <Animated.View style={[styles.label, motion.labelStyle]}>
              <Text color={labelColor} numberOfLines={1} aria-hidden>
                {label}
                {required ? <Text color={disabled ? 'disabled' : 'danger'}>{' *'}</Text> : null}
              </Text>
            </Animated.View>
            <TextInput
              ref={ref}
              value={value}
              aria-label={ariaLabel ?? label}
              accessibilityHint={joinHints(
                errorText,
                required ? requiredLabel : undefined,
                helperText,
                accessibilityHint,
              )}
              aria-disabled={disabled}
              // Web only; native screen readers get the error through the hint and announcement.
              aria-invalid={invalid}
              aria-required={required}
              editable={!disabled}
              multiline={multiline}
              numberOfLines={multiline ? numberOfLines : undefined}
              maxLength={maxLength}
              secureTextEntry={secureTextEntry && !revealed}
              placeholderTextColor={theme.colors.text.tertiary}
              textAlignVertical={multiline ? 'top' : 'center'}
              {...rest}
              // Shown once the label has moved up; before that it would be under the label.
              placeholder={raised ? rest.placeholder : undefined}
              onFocus={(event) => {
                setFocused(true);
                onFocus?.(event);
              }}
              onBlur={(event) => {
                setFocused(false);
                onBlur?.(event);
              }}
              style={[
                styles.input,
                multiline && [
                  styles.inputMultiline,
                  // As tall as its lines, on top of the padding that holds the label.
                  {
                    minHeight:
                      numberOfLines * body.lineHeight + raisedLabelHeight + 2 * fieldEdge(theme),
                  },
                ],
                { color: disabled ? theme.colors.text.disabled : theme.colors.text.primary },
              ]}
            />
          </View>
          {trailingIcon ? (
            <Icon name={trailingIcon} color={iconColor} style={multiline && styles.iconMultiline} />
          ) : null}
          {trailingAction ? (
            <Pressable
              role="button"
              aria-label={trailingAction.label}
              aria-disabled={disabled}
              disabled={disabled}
              hitSlop={iconSlop}
              onPress={trailingAction.onPress}
              style={({ pressed }) => [
                multiline && styles.iconMultiline,
                pressed && styles.pressed,
              ]}
            >
              <Icon name={trailingAction.icon} color={iconColor} />
            </Pressable>
          ) : null}
          {secureTextEntry ? (
            <Pressable
              role="button"
              aria-label={revealed ? hidePasswordLabel : showPasswordLabel}
              aria-disabled={disabled}
              disabled={disabled}
              hitSlop={iconSlop}
              onPress={() => setRevealed((current) => !current)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Icon name={revealed ? 'eye-off' : 'eye'} color={iconColor} />
            </Pressable>
          ) : null}
        </View>
      </View>
      {/* Mounted even when empty so Android and web announce a message when it appears. */}
      <View style={[styles.footer, (message || counting) && styles.footerFilled]}>
        <View style={styles.message} aria-live="polite">
          {errorText ? (
            <>
              <Icon
                name="error"
                size="sm"
                color={theme.colors.text.danger}
                style={styles.messageIcon}
              />
              <Text variant="bodySm" color="danger" style={styles.messageText}>
                {errorText}
              </Text>
            </>
          ) : helperText ? (
            <Text variant="bodySm" color="secondary" style={styles.messageText}>
              {helperText}
            </Text>
          ) : null}
        </View>
        {counting ? (
          <Text
            variant="caption"
            color={value.length > maxLength ? 'danger' : 'tertiary'}
            aria-label={formatCountLabel(value.length, maxLength)}
            style={styles.counter}
          >
            {`${value.length}/${maxLength}`}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/**
 * The field's motion: the label moving up and shrinking as it is `raised`,
 * and the glow fading in with `focused`. With reduced motion both change at
 * once.
 */
function useFieldMotion(raised: boolean, focused: boolean, multiline: boolean) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  // 0 with the label where the text goes, 1 with it up at the top.
  const lift = useSharedValue(raised ? 1 : 0);
  const glow = useSharedValue(focused ? 1 : 0);
  const duration = reducedMotion ? 0 : theme.duration.fast;
  const [x1, y1, x2, y2] = theme.easing.standard;
  // How far below its raised place the label rests. In a multiline field it
  // is on the first line of text, a raised label's height down. In a
  // single-line field it is in the middle, level with the icons: half as far,
  // less what iOS adds by itself.
  const drop = multiline ? raisedLabelHeight : raisedLabelHeight / 2 - iosTextSag;

  useEffect(() => {
    const timing = { duration, easing: Easing.bezier(x1, y1, x2, y2) };
    lift.value = withTiming(raised ? 1 : 0, timing);
    glow.value = withTiming(focused ? 1 : 0, timing);
  }, [raised, focused, lift, glow, duration, x1, y1, x2, y2]);

  const labelStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: (1 - lift.value) * drop },
        { scale: 1 - lift.value * (1 - raisedLabelScale) },
      ],
    }),
    [lift, drop],
  );
  const haloStyle = useAnimatedStyle(() => ({ opacity: glow.value * haloOpacity }), [glow]);

  return { labelStyle, haloStyle };
}

/**
 * The space above the raised label, and below the text, in a single-line
 * field. The label and the text share what is left inside the border.
 */
function fieldEdge(theme: Theme) {
  const inside = theme.sizes.control.lg - 2 * theme.borderWidths.thin;
  return (inside - body.lineHeight - raisedLabelHeight) / 2;
}

/**
 * iOS ignores live regions, so read new error text out explicitly. Errors
 * present on first render are left alone to avoid a burst of announcements
 * when a screen opens.
 */
function useAnnounceError(errorText: string | undefined) {
  const previous = useRef(errorText);
  useEffect(() => {
    if (Platform.OS === 'ios' && errorText && errorText !== previous.current) {
      AccessibilityInfo.announceForAccessibility(errorText);
    }
    previous.current = errorText;
  }, [errorText]);
}

/** Joins hint sentences, adding a full stop where one is missing so screen readers pause. */
function joinHints(...parts: (string | undefined)[]): string | undefined {
  const sentences = parts.filter((part): part is string => Boolean(part));
  if (sentences.length === 0) return undefined;
  return sentences.map((part) => (/[.!?。！？]$/.test(part) ? part : `${part}.`)).join(' ');
}

const useStyles = makeStyles((t) => {
  const height = t.sizes.control.lg;
  const edge = fieldEdge(t);
  // Where the text's line starts: under the raised label.
  const textTop = edge + raisedLabelHeight;
  return {
    halo: {
      position: 'absolute',
      top: -haloSpread,
      bottom: -haloSpread,
      start: -haloSpread,
      end: -haloSpread,
      borderRadius: t.radii.xl + haloSpread,
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.space.sm,
      minHeight: height,
      paddingHorizontal: t.space.lg,
      borderRadius: t.radii.xl,
      borderWidth: t.borderWidths.thin,
    },
    fieldMultiline: {
      alignItems: 'flex-start',
    },
    ring: {
      outlineWidth: t.borderWidths.thin,
      outlineStyle: 'solid',
    },
    // Holds the input with the label over it.
    body: {
      flex: 1,
      alignSelf: 'stretch',
    },
    // In its raised place; `useFieldMotion` moves it down to rest. It scales
    // from its leading edge, and lets touches through to the input.
    label: {
      position: 'absolute',
      top: edge,
      start: t.space.none,
      end: t.space.none,
      transformOrigin: I18nManager.isRTL ? 'right top' : 'left top',
      pointerEvents: 'none',
    },
    input: {
      flex: 1,
      margin: t.space.none,
      paddingHorizontal: t.space.none,
      paddingTop: textTop,
      paddingBottom: edge,
      fontSize: t.typography.body.fontSize,
      fontFamily: t.typography.body.fontFamily,
      // The container draws the focus ring; stop browsers adding their own.
      outlineWidth: t.borderWidths.none,
    },
    inputMultiline: {
      lineHeight: body.lineHeight,
    },
    iconMultiline: {
      marginTop: textTop + (body.lineHeight - t.sizes.icon.md) / 2,
    },
    pressed: {
      opacity: t.opacity.pressed,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: t.space.sm,
    },
    footerFilled: {
      marginTop: t.space.xs,
    },
    message: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: t.space.xs,
    },
    messageIcon: {
      marginTop: (textVariants.bodySm.lineHeight - t.sizes.icon.sm) / 2,
    },
    messageText: {
      flex: 1,
    },
    counter: {
      marginTop: (textVariants.bodySm.lineHeight - textVariants.caption.lineHeight) / 2,
    },
  };
});
