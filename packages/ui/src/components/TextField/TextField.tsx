import { textVariants } from '@nomos/tokens';
import { useEffect, useRef, useState, type Ref } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';

/** An icon button at the end of the field, such as "Scan QR code". */
export interface TextFieldAction {
  icon: IconName;
  /** Accessibility label for the button. */
  label: string;
  onPress: () => void;
}

export interface TextFieldProps
  extends Omit<TextInputProps, 'style' | 'editable' | 'placeholderTextColor' | 'value'> {
  /** Visible label above the field. Also the input's accessibility label. */
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

  return (
    <View style={style}>
      <Text
        variant="label"
        color={disabled ? 'secondary' : 'primary'}
        style={styles.label}
        aria-hidden
      >
        {label}
        {required ? <Text variant="label" color="danger">{' *'}</Text> : null}
      </Text>
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
          <Icon name={leadingIcon} color={iconColor} style={multiline && styles.iconMultiline} />
        ) : null}
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
              { minHeight: numberOfLines * textVariants.body.lineHeight + 2 * theme.space.sm },
            ],
            { color: disabled ? theme.colors.text.disabled : theme.colors.text.primary },
          ]}
          {...rest}
        />
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
            style={({ pressed }) => [multiline && styles.iconMultiline, pressed && styles.pressed]}
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

const useStyles = makeStyles((t) => ({
  label: {
    marginBottom: t.space.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    minHeight: t.sizes.control.md,
    paddingHorizontal: t.space.md,
    borderRadius: t.radii.md,
    borderWidth: t.borderWidths.thin,
  },
  fieldMultiline: {
    alignItems: 'flex-start',
  },
  ring: {
    outlineWidth: t.borderWidths.thin,
    outlineStyle: 'solid',
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    margin: t.space.none,
    paddingHorizontal: t.space.none,
    paddingVertical: t.space.none,
    fontSize: t.typography.body.fontSize,
    fontFamily: t.typography.body.fontFamily,
    // The container draws the focus ring; stop browsers adding their own.
    outlineWidth: t.borderWidths.none,
  },
  inputMultiline: {
    paddingVertical: t.space.sm,
    lineHeight: textVariants.body.lineHeight,
  },
  iconMultiline: {
    marginTop: t.space.sm + (textVariants.body.lineHeight - t.sizes.icon.md) / 2,
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
}));
