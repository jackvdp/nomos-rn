import { AccessibilityInfo, Animated } from 'react-native';

import { act, isHiddenFromAccessibility, renderWithTheme, screen } from '../../test-utils';
import { Skeleton, SkeletonText } from './Skeleton';

function mockLoop() {
  const animation = { start: jest.fn(), stop: jest.fn(), reset: jest.fn() };
  const spy = jest.spyOn(Animated, 'loop').mockReturnValue(animation);
  return { animation, spy };
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Skeleton', () => {
  test('is hidden from screen readers', async () => {
    await renderWithTheme(<Skeleton testID="placeholder" />);
    expect(screen.queryByTestId('placeholder')).toBeNull();
    const placeholder = screen.getByTestId('placeholder', { includeHiddenElements: true });
    expect(isHiddenFromAccessibility(placeholder)).toBe(true);
  });

  test('pulses while mounted and stops on unmount', async () => {
    const { animation } = mockLoop();
    const { unmount } = await renderWithTheme(<Skeleton />);
    expect(animation.start).toHaveBeenCalled();
    expect(animation.stop).not.toHaveBeenCalled();
    await unmount();
    expect(animation.stop).toHaveBeenCalled();
  });

  test('stops pulsing when the user asks for reduced motion', async () => {
    jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockResolvedValueOnce(true);
    const { animation, spy } = mockLoop();
    await renderWithTheme(<Skeleton />);
    await act(async () => {});
    expect(animation.stop).toHaveBeenCalledTimes(spy.mock.calls.length);
  });
});

describe('SkeletonText', () => {
  test('renders the requested number of lines', async () => {
    await renderWithTheme(<SkeletonText lines={4} testID="paragraph" />);
    const paragraph = screen.getByTestId('paragraph', { includeHiddenElements: true });
    expect(paragraph.children).toHaveLength(4);
    expect(isHiddenFromAccessibility(paragraph)).toBe(true);
  });
});
