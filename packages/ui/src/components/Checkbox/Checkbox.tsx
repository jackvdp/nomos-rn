import { textVariants } from '@nomos/tokens';
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export type CheckboxState = boolean | 'indeterminate';

export interface CheckboxProps
  extends Omit<PressableProps, 'children' | 'style' | 'onPress' | 'disabled'> {
  /** `indeterminate` shows a dash, e.g. for "select all" when only some items are selected. */
  checked: CheckboxState;
  /** Called with the new value. An indeterminate checkbox becomes checked. */
  onChange: (next: boolean) => void;
  /** Visible text. Also the accessibility label unless you pass one. */
  label: string;
  /** Secondary text under the label, read to screen readers as a hint. */
  description?: string;
  /** Marks the checkbox invalid and explains why, e.g. a consent that must be given. */
  errorText?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * A single on/off choice in a form, such as "Remember this device" or a
 * consent. The whole row is pressable. For settings that apply immediately,
 * use Switch.
 */
export function Checkbox({
  checked,
  onChange,
  label,
  description,
  errorText,
  disabled = false,
  style,
  'aria-label': ariaLabel,
  accessibilityHint,
  ...rest
}: CheckboxProps) {
  const theme = useTheme();
  const styles = useStyles();
  const on = checked !== false;
  const boxBorder = on
    ? theme.colors.control.checked
    : errorText
      ? theme.colors.tone.danger.solid
      : theme.colors.border.strong;

  return (
    <Pressable
      role="checkbox"
      aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
      aria-label={ariaLabel ?? label}
      accessibilityHint={joinHints(errorText, description, accessibilityHint)}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={() => onChange(checked !== true)}
      style={[styles.row, disabled && styles.disabled, style]}
      {...rest}
    >
      {({ pressed }) => (
        <>
          <View
            style={[
              styles.box,
              {
                backgroundColor: on ? theme.colors.control.checked : theme.colors.bg.surface,
                borderColor: boxBorder,
              },
              pressed && styles.pressed,
            ]}
          >
            {on ? (
              <Icon
                name={checked === 'indeterminate' ? 'minus' : 'check'}
                size="sm"
                color={theme.colors.control.onChecked}
              />
            ) : null}
          </View>
          <View style={styles.text}>
            <Text>{label}</Text>
            {description ? (
              <Text variant="bodySm" color="secondary">
                {description}
              </Text>
            ) : null}
            {errorText ? (
              <View style={styles.error}>
                <Icon
                  name="error"
                  size="sm"
                  color={theme.colors.text.danger}
                  style={styles.errorIcon}
                />
                <Text variant="bodySm" color="danger" style={styles.errorText}>
                  {errorText}
                </Text>
              </View>
            ) : null}
          </View>
        </>
      )}
    </Pressable>
  );
}

/** Joins hint sentences, adding a full stop where one is missing so screen readers pause between them. */
function joinHints(...parts: (string | undefined)[]): string | undefined {
  const sentences = parts.filter((part): part is string => Boolean(part));
  if (sentences.length === 0) return undefined;
  return sentences.map((part) => (/[.!?。！？]$/.test(part) ? part : `${part}.`)).join(' ');
}

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: t.space.md,
    minHeight: t.sizes.touchTarget,
    paddingVertical: t.space.sm,
  },
  disabled: {
    opacity: t.opacity.disabled,
  },
  box: {
    width: t.sizes.icon.md,
    height: t.sizes.icon.md,
    // Centre the box on the first line of the label.
    marginTop: (textVariants.body.lineHeight - t.sizes.icon.md) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radii.xs,
    borderWidth: t.borderWidths.thick,
  },
  pressed: {
    opacity: t.opacity.pressed,
  },
  text: {
    flex: 1,
    gap: t.space.xxs,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: t.space.xs,
    marginTop: t.space.xxs,
  },
  errorIcon: {
    marginTop: (textVariants.bodySm.lineHeight - t.sizes.icon.sm) / 2,
  },
  errorText: {
    flex: 1,
  },
}));
