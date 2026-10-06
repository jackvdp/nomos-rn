import { Text } from 'react-native';

import { act, renderWithTheme, screen, userEvent } from '../../test-utils';
import { Sheet, type SheetProps } from './Sheet';

function renderSheet(props: Partial<SheetProps> = {}) {
  return renderWithTheme(
    <Sheet visible onDismiss={() => {}} title="Post options" testID="sheet" {...props}>
      <Text>Copy link</Text>
    </Sheet>,
  );
}

/**
 * Drives the sheet's PanResponder through a one-finger drag of `dy` taking `ms`.
 * Calls the responder props directly: fireEvent can't run the capture-phase
 * negotiation that hands a real drag to the sheet.
 */
async function drag(sheet: ReturnType<typeof screen.getByTestId>, dy: number, ms: number) {
  const touch = (y: number, time: number) => ({
    touchHistory: {
      numberActiveTouches: 1,
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: time,
      touchBank: [
        {
          touchActive: true,
          startPageX: 0,
          startPageY: 0,
          startTimeStamp: 0,
          currentPageX: 0,
          currentPageY: y,
          currentTimeStamp: time,
          previousPageX: 0,
          previousPageY: 0,
          previousTimeStamp: 0,
        },
      ],
    },
  });
  await act(() => {
    sheet.props.onResponderGrant(touch(0, 0));
    sheet.props.onResponderMove(touch(dy, ms));
    sheet.props.onResponderRelease(touch(dy, ms));
  });
}

describe('Sheet', () => {
  test('shows its title and content as a modal when visible', async () => {
    await renderSheet();
    expect(screen.getByRole('heading', { name: 'Post options' })).toBeOnTheScreen();
    expect(screen.getByText('Copy link')).toBeOnTheScreen();
    const sheet = screen.getByTestId('sheet');
    expect(sheet).toHaveProp('aria-modal', true);
    expect(sheet).toHaveProp('aria-label', 'Post options');
  });

  test('renders nothing when hidden', async () => {
    await renderSheet({ visible: false });
    expect(screen.queryByText('Copy link')).toBeNull();
  });

  test('the drag handle closes it', async () => {
    const onDismiss = jest.fn();
    await renderSheet({ onDismiss });
    await userEvent.press(screen.getByRole('button', { name: 'Close' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('a backdrop tap calls onDismiss', async () => {
    const onDismiss = jest.fn();
    await renderSheet({ onDismiss });
    await userEvent.press(screen.getByTestId('sheet-backdrop', { includeHiddenElements: true }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('cannot be dismissed when not dismissable', async () => {
    const onDismiss = jest.fn();
    await renderSheet({ onDismiss, dismissable: false });
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    await userEvent.press(screen.getByTestId('sheet-backdrop', { includeHiddenElements: true }));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('a swipe down past the threshold dismisses it', async () => {
    const onDismiss = jest.fn();
    await renderSheet({ onDismiss });
    await drag(screen.getByTestId('sheet'), 600, 2000);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('a short, slow drag snaps back without dismissing', async () => {
    const onDismiss = jest.fn();
    await renderSheet({ onDismiss });
    await drag(screen.getByTestId('sheet'), 40, 2000);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('slides out, then unmounts, when hidden', async () => {
    const { rerender } = await renderSheet();
    await rerender(
      <Sheet visible={false} onDismiss={() => {}} title="Post options">
        <Text>Copy link</Text>
      </Sheet>,
    );
    expect(screen.getByText('Copy link')).toBeOnTheScreen();
    await act(() => jest.advanceTimersByTime(500));
    expect(screen.queryByText('Copy link')).toBeNull();
  });
});
