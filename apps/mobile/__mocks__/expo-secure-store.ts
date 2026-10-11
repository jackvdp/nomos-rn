// Stands in for the Keychain and the Keystore under Jest, which has neither:
// the entries are held in memory. Jest uses this file in place of the real
// package in every test, because it is in a `__mocks__` folder at the root.

const entries = new Map<string, string>();

export const WHEN_UNLOCKED_THIS_DEVICE_ONLY = 'WHEN_UNLOCKED_THIS_DEVICE_ONLY';

export const getItem = jest.fn((key: string) => entries.get(key) ?? null);

export const setItemAsync = jest.fn(async (key: string, value: string) => {
  entries.set(key, value);
});

export const deleteItemAsync = jest.fn(async (key: string) => {
  entries.delete(key);
});
