import { AccessibilityInfo } from 'react-native';

import { act, renderHook, renderWithTheme, screen, userEvent } from '../../test-utils';
import { Button } from '../Button';
import { ToastProvider, useToast, type ToastOptions } from './Toast';

function Trigger({ options }: { options: ToastOptions[] }) {
  const toast = useToast();
  return <Button label="Show" onPress={() => options.forEach((option) => toast.show(option))} />;
}

async function showToasts(...options: ToastOptions[]) {
  await renderWithTheme(
    <ToastProvider>
      <Trigger options={options} />
    </ToastProvider>,
  );
  await userEvent.press(screen.getByRole('button', { name: 'Show' }));
}

/** Lets the auto-dismiss timer or the exit animation run. */
const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));

describe('Toast', () => {
  test('shows the message and announces it', async () => {
    await showToasts({ message: 'Link copied' });
    expect(screen.getByText('Link copied')).toBeOnTheScreen();
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith('Link copied');
  });

  test('hides itself after its duration', async () => {
    await showToasts({ message: 'Post published' });
    await advance(3900);
    expect(screen.getByText('Post published')).toBeOnTheScreen();
    await advance(100);
    await advance(500);
    expect(screen.queryByText('Post published')).toBeNull();
  });

  test('a sticky toast stays until its close button is pressed', async () => {
    await showToasts({ message: "You're offline", duration: 0 });
    await advance(60_000);
    expect(screen.getByText("You're offline")).toBeOnTheScreen();
    await userEvent.press(screen.getByRole('button', { name: 'Dismiss' }));
    await advance(500);
    expect(screen.queryByText("You're offline")).toBeNull();
  });

  test('pressing the action calls it and hides the toast', async () => {
    const onUndo = jest.fn();
    await showToasts({ message: 'Draft deleted', action: { label: 'Undo', onPress: onUndo } });
    await userEvent.press(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    await advance(500);
    expect(screen.queryByText('Draft deleted')).toBeNull();
  });

  test('shows at most three at once and queues the rest', async () => {
    await showToasts(
      { message: 'One', duration: 1000 },
      { message: 'Two', duration: 5000 },
      { message: 'Three', duration: 5000 },
      { message: 'Four', duration: 5000 },
    );
    expect(screen.getByText('Three')).toBeOnTheScreen();
    expect(screen.queryByText('Four')).toBeNull();
    await advance(1000);
    await advance(500);
    expect(screen.queryByText('One')).toBeNull();
    expect(screen.getByText('Four')).toBeOnTheScreen();
  });

  test('useToast throws outside a ToastProvider', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(renderHook(() => useToast())).rejects.toThrow(/inside a <ToastProvider>/);
    jest.mocked(console.error).mockRestore();
  });
});
