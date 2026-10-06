import { textVariants } from '@nomos/tokens';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

interface RadioGroupContextValue {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string = string> extends Omit<ViewProps, 'children'> {
  /** Visible question or heading for the group. Also its accessibility label. */
  label: string;
  /** The selected value, or `undefined` when nothing is selected yet. */
  value: T | undefined;
  onChange: (value: T) => void;
  /** Shorthand for rendering one `Radio` per option. */
  options?: readonly RadioOption<T>[];
  /** `Radio` items, when you need more control than `options` gives. */
  children?: ReactNode;
  /** Secondary text under the group label. */
  description?: string;
  /** Marks the group invalid and explains why, e.g. no option chosen. */
  errorText?: string;
  /** Disables every option. */
  disabled?: boolean;
}

/**
 * One choice from a short list (two to six options) that should all be
 * visible, such as a shift role or a preferred language. Pass `options`, or
 * `Radio` children for custom layouts.
 */
export function RadioGroup<T extends string = string>({
  label,
  value,
  onChange,
  options,
  children,
  description,
  errorText,
  disabled = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}: RadioGroupProps<T>) {
  const theme = useTheme();
  const styles = useStyles();
  const context = useMemo<RadioGroupContextValue>(
    () => ({ value, onChange: (next) => onChange(next as T), disabled }),
    [value, onChange, disabled],
  );

  return (
    <View
      role="radiogroup"
      aria-label={ariaLabel ?? label}
      aria-disabled={disabled}
      style={[styles.group, style]}
      {...rest}
    >
      <View style={styles.header}>
        <Text variant="label">{label}</Text>
        {description ? (
          <Text variant="bodySm" color="secondary">
            {description}
          </Text>
        ) : null}
      </View>
      <RadioGroupContext.Provider value={context}>
        {options?.map((option) => <Radio key={option.value} {...option} />)}
        {children}
      </RadioGroupContext.Provider>
      <View style={styles.error} aria-live="polite">
        {errorText ? (
          <>
            <Icon
              name="error"
              size="sm"
              color={theme.colors.text.danger}
              style={styles.errorIcon}
            />
            <Text variant="bodySm" color="danger" style={styles.errorText}>
              {errorText}
            </Text>
          </>
        ) : null}
      </View>
    </View>
  );
}

export interface RadioProps
  extends Omit<PressableProps, 'children' | 'style' | 'onPress' | 'disabled'> {
  value: string;
  /** Visible text. Also the accessibility label unless you pass one. */
  label: string;
  /** Secondary text under the label, read to screen readers as a hint. */
  description?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** One option in a `RadioGroup`. Must be rendered inside one. */
export function Radio({
  value,
  label,
  description,
  disabled = false,
  style,
  'aria-label': ariaLabel,
  accessibilityHint,
  ...rest
}: RadioProps) {
  const theme = useTheme();
  const styles = useStyles();
  const group = useContext(RadioGroupContext);
  if (!group) {
    throw new Error('Radio must be used inside a <RadioGroup>.');
  }
  const selected = group.value === value;
  const inactive = disabled || group.disabled;

  return (
    <Pressable
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel ?? label}
      accessibilityHint={accessibilityHint ?? description}
      aria-disabled={inactive}
      disabled={inactive}
      onPress={() => {
        if (!selected) group.onChange(value);
      }}
      style={[styles.row, inactive && styles.disabled, style]}
      {...rest}
    >
      {({ pressed }) => (
        <>
          <View
            style={[
              styles.circle,
              {
                backgroundColor: selected ? theme.colors.control.checked : theme.colors.bg.surface,
                borderColor: selected ? theme.colors.control.checked : theme.colors.border.strong,
              },
              pressed && styles.pressed,
            ]}
          >
            {selected ? (
              <View style={[styles.dot, { backgroundColor: theme.colors.control.onChecked }]} />
            ) : null}
          </View>
          <View style={styles.text}>
            <Text>{label}</Text>
            {description ? (
              <Text variant="bodySm" color="secondary">
                {description}
              </Text>
            ) : null}
          </View>
        </>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  group: {
    alignSelf: 'stretch',
  },
  header: {
    gap: t.space.xxs,
    marginBottom: t.space.xs,
  },
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
  circle: {
    width: t.sizes.icon.md,
    height: t.sizes.icon.md,
    // Centre the circle on the first line of the label.
    marginTop: (textVariants.body.lineHeight - t.sizes.icon.md) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radii.full,
    borderWidth: t.borderWidths.thick,
  },
  dot: {
    width: t.sizes.icon.md - 2 * (t.borderWidths.thick + t.space.xxs),
    height: t.sizes.icon.md - 2 * (t.borderWidths.thick + t.space.xxs),
    borderRadius: t.radii.full,
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
  },
  errorIcon: {
    marginTop: (textVariants.bodySm.lineHeight - t.sizes.icon.sm) / 2,
  },
  errorText: {
    flex: 1,
  },
}));
