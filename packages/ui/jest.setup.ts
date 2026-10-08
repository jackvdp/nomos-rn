import { cleanup } from '@testing-library/react-native';

// Fake timers keep Animated-based components (Skeleton, Toast, Sheet) deterministic.
beforeEach(() => {
  jest.useFakeTimers();
});

// Unmount first so components clear their own timers, then flush whatever is left.
afterEach(async () => {
  await cleanup();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
