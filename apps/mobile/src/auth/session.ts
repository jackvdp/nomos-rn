import { uuid } from 'expo-modules-core';

/** A signed-in session: the tokens and the device id the server bound them to. */
export interface Session {
  accessToken: string;
  refreshToken: string;
  deviceId: string;
}

/** An organisation with its own NOMOS portal. Every account belongs to one. */
export interface Organisation {
  /** Its short name, in lower case: the first part of its NOMOS web address. */
  name: string;
  /** Which kind of portal it has, when the server says. */
  portalType?: string;
}

// The one copy of the app's sign-in state. It lives outside React so that the
// API client can read it for request headers; components read it through
// `useAuth`. It is held in memory only for now, so reloading the app signs
// you out.
let session: Session | null = null;
// The organisation that requests are for. It is set when a sign-in starts and
// kept after sign-out, so that the sign-in form can start with it.
let organisation: Organisation | undefined;
// The device id used until sign-in completes. It stands in for the web app's
// per-tab id.
let pendingDeviceId: string | undefined;
const listeners = new Set<() => void>();

export function getSession() {
  return session;
}

/** Starts a session, or ends the current one with `null`. */
export function setSession(next: Session | null) {
  session = next;
  if (!next) {
    // The next sign-in gets a fresh device id, as on the web app.
    pendingDeviceId = undefined;
  }
  listeners.forEach((listener) => listener());
}

/** Calls `listener` whenever the session starts or ends. Returns a function that stops it. */
export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getOrganisation() {
  return organisation;
}

export function setOrganisation(next: Organisation) {
  organisation = next;
}

/** The id to send as `x-window-device-id`: the session's, or one made for the sign-in in progress. */
export function getDeviceId() {
  return session?.deviceId ?? (pendingDeviceId ??= uuid.v4());
}

/** Part-way through sign-in the server can name the id it expects from then on. */
export function setDeviceId(id: string) {
  pendingDeviceId = id;
}
