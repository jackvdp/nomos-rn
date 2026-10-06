import { useState, type Ref } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon } from '../Icon';

export interface SearchFieldProps extends Omit<
  TextInputProps,
  'style' | 'value' | 'onChangeText' | 'editable' | 'placeholderTextColor' | 'multiline'
> {
  /**
   * Accessibility label, e.g. "Search people". Not shown: put visible hint
   * text in `placeholder`.
   */
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  /** Called after the clear button empties the field. */
  onClear?: () => void;
  /** Accessibility label for the clear button. */
  clearLabel?: string;
  disabled?: boolean;
  /** Style for the outer container. */
  style?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
}

/**
 * A rounded search box with a clear button, for searching people, posts and
 * courses. Controlled: pass `value` and `onChangeText`, and run the search
 * from `onSubmitEditing` or as the text changes.
 */
export function SearchField({
  label,
  value,
  onChangeText,
  onClear,
  clearLabel = 'Clear search',
  disabled = false,
  style,
  ref,
  'aria-label': ariaLabel,
  onFocus,
  onBlur,
  ...rest
}: SearchFieldProps) {
  const theme = useTheme();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);
  const iconColor = disabled ? theme.colors.text.disabled : theme.colors.text.secondary;

  return (
    <View
      style={[
        styles.field,
        {
          backgroundColor: disabled ? theme.colors.action.disabled.bg : theme.colors.bg.surface,
          borderColor: disabled
            ? theme.colors.action.disabled.border
            : focused
              ? theme.colors.border.focus
              : theme.colors.border.strong,
        },
        focused && styles.ring,
        style,
      ]}
    >
      <Icon name="search" color={iconColor} />
      <TextInput
        ref={ref}
        role="searchbox"
        value={value}
        onChangeText={onChangeText}
        aria-label={ariaLabel ?? label}
        aria-disabled={disabled}
        editable={!disabled}
        returnKeyType="search"
        enterKeyHint="search"
        autoCorrect={false}
        clearButtonMode="never"
        placeholderTextColor={theme.colors.text.tertiary}
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
          { color: disabled ? theme.colors.text.disabled : theme.colors.text.primary },
        ]}
        {...rest}
      />
      {value.length > 0 && !disabled ? (
        <Pressable
          role="button"
          aria-label={clearLabel}
          hitSlop={(theme.sizes.touchTarget - theme.sizes.icon.md) / 2}
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Icon name="close-circle" color={theme.colors.text.tertiary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    minHeight: t.sizes.control.md,
    paddingHorizontal: t.space.lg,
    borderRadius: t.radii.full,
    borderWidth: t.borderWidths.thin,
  },
  // An outline on top of the border makes a 2dp focus ring without shifting the layout.
  ring: {
    outlineColor: t.colors.border.focus,
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
  pressed: {
    opacity: t.opacity.pressed,
  },
}));
