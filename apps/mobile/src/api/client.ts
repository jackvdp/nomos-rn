import {
  expireSession,
  getDeviceId,
  getOrganisation,
  getSession,
  setSession,
  type Session,
} from '../auth/session';

// The dev backend unless a build sets EXPO_PUBLIC_API_URL.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.nomos-dev.weuno.co';

// The domain that the server looks an organisation's name up under. The web
// app takes it from the address it is served from; a mobile build has no
// address, so it is set per build. The server cannot look an organisation up
// without it, so sign-in fails.
const BASE_ORIGIN = process.env.EXPO_PUBLIC_TENANT_BASE_ORIGIN;

// The kind of portal an organisation has. The server finds an organisation by
// its name, the domain and this together, and every organisation the app is
// for has this kind. Sent for one of another kind, it makes the server answer
// that the organisation does not exist.
const PORTAL_TYPE = 'web3';

// fetch never gives up on its own, and many users are on poor networks.
const TIMEOUT_MS = 15_000;

const REFRESH_PATH = '/api/admin/auth/refresh-token';
// The server's name for the refusal of an access token that has run out.
const TOKEN_EXPIRED = 'TOKEN_EXPIRED';

/**
 * The server refused the request. `message` is the server's own wording, or
 * empty if it sent none. `code` is the server's name for the reason, which
 * only some refusals have.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface Envelope {
  success?: boolean;
  data?: unknown;
  error?: { message?: string; code?: string };
  code?: string;
}

/** GETs `path` from the NOMOS REST API. See `request`. */
export function get(path: string): Promise<unknown> {
  return request('GET', path);
}

/** POSTs `body` as JSON to the NOMOS REST API. See `request`. */
export function post(path: string, body?: unknown): Promise<unknown> {
  return request('POST', path, body);
}

type Method = 'GET' | 'POST';

/**
 * Calls the NOMOS REST API and returns the `data` from its
 * `{ success, data | error, timestamp }` envelope. Every request carries the
 * device id, the organisation once one has been chosen, and the access token
 * once there is a session. When the server says that the access token has
 * run out, the session is renewed and the request is sent once more. Throws
 * `ApiError` when the server refuses the request. A network failure or
 * timeout throws whatever `fetch` throws.
 */
async function request(method: Method, path: string, body?: unknown): Promise<unknown> {
  const session = getSession();
  try {
    return await send(method, path, body, session?.accessToken);
  } catch (error) {
    if (!session || !isTokenExpired(error)) throw error;
    const renewed = await renew(session, error);
    return send(method, path, body, renewed.accessToken);
  }
}

/** Sends one request, with `accessToken` if there is one, and unwraps the reply. */
async function send(
  method: Method,
  path: string,
  body: unknown,
  accessToken?: string,
): Promise<unknown> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-window-device-id': getDeviceId(),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : null),
      ...tenantHeaders(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const envelope: Envelope | null = await response.json().catch(() => null);
  if (!response.ok || envelope?.success === false) {
    throw new ApiError(
      envelope?.error?.message ?? '',
      response.status,
      envelope?.error?.code ?? envelope?.code,
    );
  }
  return envelope?.data;
}

function isTokenExpired(error: unknown) {
  return error instanceof ApiError && error.status === 401 && error.code === TOKEN_EXPIRED;
}

// The refresh under way, if there is one. Requests that find the access token
// expired at the same time all wait for it. The server gives out a new
// refresh token with each refresh, and may not take the old one a second time.
let renewal: Promise<Session> | undefined;

/**
 * The session to send a request again with, after the server refused it
 * because `expired`'s access token had run out. Throws `refusal`, the
 * server's reply to that request, if the user has signed out since.
 */
async function renew(expired: Session, refusal: unknown): Promise<Session> {
  const current = getSession();
  if (!current) throw refusal;
  // Another request has had the session renewed since this one was sent.
  if (current !== expired) return current;
  renewal ??= refresh(current).finally(() => {
    renewal = undefined;
  });
  return renewal;
}

/**
 * Swaps `session`'s refresh token for a new pair of tokens and keeps them as
 * the session. If the server will not take the refresh token the session is
 * over, and the user is signed out. Any other failure, such as no connection,
 * leaves the session as it is, to be renewed by a later request.
 */
async function refresh(session: Session): Promise<Session> {
  let data: unknown;
  try {
    // The API spec does not describe the reply. This follows the NOMOS web
    // app, which also sends the expired access token along.
    data = await send(
      'POST',
      REFRESH_PATH,
      { refreshToken: session.refreshToken },
      session.accessToken,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && getSession() === session) {
      expireSession();
    }
    throw error;
  }
  const { accessToken, refreshToken } =
    (data as { tokens?: Record<string, unknown> } | undefined)?.tokens ?? {};
  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    throw new Error('The refresh reply had no tokens.');
  }
  // Signed out while the reply was on its way: the new tokens are not kept.
  if (getSession() !== session) {
    throw new Error('The session ended while it was being renewed.');
  }
  const renewed = { ...session, accessToken, refreshToken };
  setSession(renewed);
  return renewed;
}

/** The headers that say which organisation a request is for. Any without a value are left out. */
function tenantHeaders() {
  return Object.fromEntries(
    Object.entries({
      'x-origin': getOrganisation(),
      'x-base-origin': BASE_ORIGIN,
      'x-portal-type': PORTAL_TYPE,
    }).filter(([, value]) => value),
  ) as Record<string, string>;
}
