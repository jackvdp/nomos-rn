import { useSyncExternalStore } from 'react';

import * as authApi from './authApi';
import { getSession, setDeviceId, setOrganisation, setSession, subscribe } from './session';

/**
 * The app's sign-in state and the only actions that change it. Every
 * component that calls this sees the same session and re-renders when it
 * starts or ends.
 */
export function useAuth() {
  const session = useSyncExternalStore(subscribe, getSession);
  return { session, signIn, verifyCode, signOut };
}

/**
 * Signs in to the organisation called `organisation` with an email address
 * and password. The session starts when the result is `signedIn`; the other
 * results say what the user has to do next.
 */
async function signIn(
  organisation: string,
  email: string,
  password: string,
  replaceOtherSession = false,
) {
  // Requests are for this organisation from here on: this one, the one-time
  // code if there is one, and the session that follows.
  setOrganisation(organisation);
  const result = await authApi.login(email, password, replaceOtherSession);
  if (result.status === 'signedIn') {
    setSession(result.session);
  } else if (result.status === 'needsCode' && result.deviceId) {
    setDeviceId(result.deviceId);
  }
  return result;
}

/** Finishes a sign-in that asked for the one-time code emailed to `email`. */
async function verifyCode(email: string, code: string) {
  setSession(await authApi.verifyCode(email, code));
}

function signOut() {
  // Started before the session is cleared because the request reads the token
  // from it. The user is not kept waiting for the server, and is signed out
  // here even if the request fails.
  authApi.logout().catch(() => {});
  setSession(null);
}
