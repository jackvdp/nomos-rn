// Fake timers keep Animated-based components (Skeleton, Toast, Sheet) deterministic.
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
