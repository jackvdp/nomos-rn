import { createRef, useState } from 'react';
import { AccessibilityInfo, TextInput } from 'react-native';

import { fireEvent, renderWithTheme, screen, userEvent } from '../../test-utils';
import { TextField, type TextFieldProps } from './TextField';

function Controlled(props: Omit<TextFieldProps, 'value'> & { initial?: string }) {
  const [value, setValue] = useState(props.initial ?? '');
  return <TextField {...props} value={value} onChangeText={setValue} />;
}

describe('TextField', () => {
  test('is labelled by its visible label and accepts typing', async () => {
    await renderWithTheme(
      <Controlled label="Work email" helperText="Use your commission address." />,
    );
    const input = screen.getByLabelText('Work email');

    await userEvent.type(input, 'amara@northshire.gov');
    expect(input).toHaveDisplayValue('amara@northshire.gov');
    expect(input).toHaveProp('accessibilityHint', 'Use your commission address.');
  });

  test('shows the error, puts it in the hint and announces it when it appears', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockClear();
    const { rerender } = await renderWithTheme(
      <TextField label="Work email" value="amara" helperText="Use your commission address." />,
    );
    expect(announce).not.toHaveBeenCalled();

    await rerender(
      <TextField
        label="Work email"
        value="amara"
        helperText="Use your commission address."
        errorText="Enter your work email address"
        required
      />,
    );
    expect(screen.getByText('Enter your work email address')).toBeOnTheScreen();
    expect(screen.queryByText('Use your commission address.')).not.toBeOnTheScreen();
    expect(screen.getByLabelText('Work email')).toHaveProp(
      'accessibilityHint',
      'Enter your work email address. Required. Use your commission address.',
    );
    expect(announce).toHaveBeenCalledWith('Enter your work email address');
  });

  test('holds the placeholder back while the label is where the text goes', async () => {
    await renderWithTheme(<Controlled label="Work email" placeholder="name@northshire.gov" />);
    const input = screen.getByLabelText('Work email');
    expect(screen.queryByPlaceholderText('name@northshire.gov')).not.toBeOnTheScreen();

    // Focus moves the label up, which leaves room for the placeholder.
    await fireEvent(input, 'focus');
    expect(screen.getByPlaceholderText('name@northshire.gov')).toBeOnTheScreen();

    await fireEvent(input, 'blur');
    expect(screen.queryByPlaceholderText('name@northshire.gov')).not.toBeOnTheScreen();
  });

  test('toggles password visibility', async () => {
    await renderWithTheme(<Controlled label="Password" initial="correct horse" secureTextEntry />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveProp('secureTextEntry', true);

    await userEvent.press(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveProp('secureTextEntry', false);

    await userEvent.press(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveProp('secureTextEntry', true);
  });

  test('counts characters against maxLength', async () => {
    await renderWithTheme(<Controlled label="Short summary" maxLength={80} />);
    expect(screen.getByLabelText('0 of 80 characters')).toHaveTextContent('0/80');

    await userEvent.type(screen.getByLabelText('Short summary'), 'Queue at entrance');
    expect(screen.getByLabelText('17 of 80 characters')).toHaveTextContent('17/80');
  });

  test('cannot be edited when disabled', async () => {
    const onChangeText = jest.fn();
    await renderWithTheme(
      <TextField label="Polling station" value="Hall B" onChangeText={onChangeText} disabled />,
    );
    const input = screen.getByLabelText('Polling station');
    await userEvent.type(input, 'C');
    expect(onChangeText).not.toHaveBeenCalled();
    expect(input).toBeDisabled();
  });

  test('runs the trailing action and forwards the ref to the input', async () => {
    const onScan = jest.fn();
    const ref = createRef<TextInput>();
    await renderWithTheme(
      <TextField
        ref={ref}
        label="Credential code"
        value=""
        trailingAction={{ icon: 'qr', label: 'Scan QR code', onPress: onScan }}
      />,
    );
    await userEvent.press(screen.getByRole('button', { name: 'Scan QR code' }));
    expect(onScan).toHaveBeenCalledTimes(1);
    expect(ref.current).toBeInstanceOf(TextInput);
  });
});
