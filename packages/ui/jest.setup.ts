import { cleanup } from '@testing-library/react-native';
import { setUpTests } from 'react-native-reanimated';

// Runs Reanimated's animations in JavaScript, on the same timers as everything else.
setUpTests();

// Fake timers keep animated components (Button, Skeleton, Toast, Sheet) deterministic.
beforeEach(() => {
  jest.useFakeTimers();
});

// Unmount first so components clear their own timers, then flush whatever is left.
afterEach(async () => {
  await cleanup();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
