import { act, renderWithTheme, screen, userEvent } from '../../test-utils';
import { Dialog, type DialogProps } from './Dialog';

function renderDialog(props: Partial<DialogProps> = {}) {
  return renderWithTheme(
    <Dialog
      visible
      onDismiss={() => {}}
      title="Revoke credential?"
      message="Amara Okafor will no longer be able to show this credential."
      actions={[
        { label: 'Cancel', onPress: () => {} },
        { label: 'Revoke', variant: 'danger', onPress: () => {} },
      ]}
      testID="dialog"
      {...props}
    />,
  );
}

describe('Dialog', () => {
  test('shows its title, message and actions when visible', async () => {
    await renderDialog();
    expect(screen.getByRole('heading', { name: 'Revoke credential?' })).toBeOnTheScreen();
    expect(screen.getByText(/no longer be able to show/)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Revoke' })).toBeOnTheScreen();
    expect(screen.getByTestId('dialog')).toHaveProp('aria-modal', true);
  });

  test('renders nothing when hidden', async () => {
    await renderDialog({ visible: false });
    expect(screen.queryByText('Revoke credential?')).toBeNull();
  });

  test('calls the pressed action', async () => {
    const revoke = jest.fn();
    const cancel = jest.fn();
    await renderDialog({
      actions: [
        { label: 'Cancel', onPress: cancel },
        { label: 'Revoke', variant: 'danger', onPress: revoke },
      ],
    });
    await userEvent.press(screen.getByRole('button', { name: 'Revoke' }));
    expect(revoke).toHaveBeenCalledTimes(1);
    expect(cancel).not.toHaveBeenCalled();
  });

  test('a backdrop tap calls onDismiss', async () => {
    const onDismiss = jest.fn();
    await renderDialog({ onDismiss });
    await userEvent.press(screen.getByTestId('dialog-backdrop', { includeHiddenElements: true }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('ignores the backdrop when not dismissable', async () => {
    const onDismiss = jest.fn();
    await renderDialog({ onDismiss, dismissable: false });
    await userEvent.press(screen.getByTestId('dialog-backdrop', { includeHiddenElements: true }));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('animates out, then unmounts, when hidden', async () => {
    const { rerender } = await renderDialog();
    await rerender(
      <Dialog visible={false} onDismiss={() => {}} title="Revoke credential?" />,
    );
    expect(screen.getByText('Revoke credential?')).toBeOnTheScreen();
    await act(() => jest.advanceTimersByTime(500));
    expect(screen.queryByText('Revoke credential?')).toBeNull();
  });
});
