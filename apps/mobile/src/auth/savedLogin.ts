import * as SecureStore from 'expo-secure-store';

/** The details a user last signed in with. */
export interface SavedLogin {
  organisation: string;
  email: string;
  password: string;
}

// One entry holds all three, so that they are saved and forgotten together.
const KEY = 'nomos.login';

// The entry goes in the iOS Keychain or, on Android, in storage encrypted
// with a key from the Keystore. On iOS it can be read only while the phone is
// unlocked and is not carried over to a new phone from a backup. On Android
// the config plugin in app.json keeps it out of backups.
const options: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

// Remembering the details is a convenience, so a failure to read, save or
// forget them is never passed on: sign-in carries on without them.

/** The saved details, or null if there are none or they cannot be read. */
export function getSavedLogin(): SavedLogin | null {
  try {
    return toSavedLogin(JSON.parse(SecureStore.getItem(KEY, options) ?? 'null'));
  } catch {
    return null;
  }
}

/** Saves `login` in place of any details saved before. */
export async function saveLogin(login: SavedLogin): Promise<void> {
  await SecureStore.setItemAsync(KEY, JSON.stringify(login), options).catch(() => {});
}

/** Removes the saved details, if there are any. */
export async function forgetLogin(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY, options).catch(() => {});
}

function toSavedLogin(value: unknown): SavedLogin | null {
  const { organisation, email, password } = (value ?? {}) as Record<string, unknown>;
  return typeof organisation === 'string' &&
    typeof email === 'string' &&
    typeof password === 'string'
    ? { organisation, email, password }
    : null;
}
