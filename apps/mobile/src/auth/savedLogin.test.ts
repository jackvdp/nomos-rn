import * as SecureStore from 'expo-secure-store';

import { forgetLogin, getSavedLogin, saveLogin } from './savedLogin';

const details = { organisation: 'northshire', email: 'amara@northshire.gov', password: 'hunter2' };

describe('savedLogin', () => {
  beforeEach(async () => {
    await forgetLogin();
    jest.clearAllMocks();
  });

  test('has nothing until details are saved', () => {
    expect(getSavedLogin()).toBeNull();
  });

  test('gives back the details that were saved', async () => {
    await saveLogin(details);
    expect(getSavedLogin()).toEqual(details);
  });

  test('keeps the details on this device, readable only while it is unlocked', async () => {
    await saveLogin(details);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }),
    );
  });

  test('replaces the details saved before', async () => {
    await saveLogin(details);
    await saveLogin({ ...details, password: 'correct horse' });
    expect(getSavedLogin()).toEqual({ ...details, password: 'correct horse' });
  });

  test('forgets the details', async () => {
    await saveLogin(details);
    await forgetLogin();
    expect(getSavedLogin()).toBeNull();
  });

  test('has nothing when what is stored is not a set of details', async () => {
    jest.mocked(SecureStore.getItem).mockReturnValueOnce('not json');
    expect(getSavedLogin()).toBeNull();

    jest.mocked(SecureStore.getItem).mockReturnValueOnce(JSON.stringify({ email: 'a@b.org' }));
    expect(getSavedLogin()).toBeNull();
  });

  test('carries on when the store fails', async () => {
    jest.mocked(SecureStore.getItem).mockImplementationOnce(() => {
      throw new Error('The keychain is locked.');
    });
    expect(getSavedLogin()).toBeNull();

    jest.mocked(SecureStore.setItemAsync).mockRejectedValueOnce(new Error('No room.'));
    await expect(saveLogin(details)).resolves.toBeUndefined();

    jest.mocked(SecureStore.deleteItemAsync).mockRejectedValueOnce(new Error('No entry.'));
    await expect(forgetLogin()).resolves.toBeUndefined();
  });
});
