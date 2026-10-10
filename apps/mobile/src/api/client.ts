import { getDeviceId, getSession } from '../auth/session';

// The dev backend unless a build sets EXPO_PUBLIC_API_URL.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.nomos-dev.weuno.co';

// Which organisation a request is for. The web app takes these from the
// address it is served from; a mobile build has no address, so they are set
// per build. Any left unset are not sent, and sign-in then relies on the
// server matching the email domain to an organisation.
const tenantHeaders = Object.fromEntries(
  Object.entries({
    'x-origin': process.env.EXPO_PUBLIC_TENANT_ORIGIN,
    'x-base-origin': process.env.EXPO_PUBLIC_TENANT_BASE_ORIGIN,
    'x-portal-type': process.env.EXPO_PUBLIC_TENANT_PORTAL_TYPE,
  }).filter(([, value]) => value),
) as Record<string, string>;

// fetch never gives up on its own, and many users are on poor networks.
const TIMEOUT_MS = 15_000;

/** The server refused the request. `message` is the server's own wording, or empty if it sent none. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface Envelope {
  success?: boolean;
  data?: unknown;
  error?: { message?: string };
}

/**
 * POSTs JSON to the NOMOS REST API and returns the `data` from its
 * `{ success, data | error, timestamp }` envelope. Every request carries the
 * device id, and the access token once there is a session. Throws `ApiError`
 * when the server refuses the request. A network failure or timeout throws
 * whatever `fetch` throws.
 */
export async function post(path: string, body?: unknown): Promise<unknown> {
  const session = getSession();
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-window-device-id': getDeviceId(),
      ...(session ? { Authorization: `Bearer ${session.accessToken}` } : null),
      ...tenantHeaders,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const envelope: Envelope | null = await response.json().catch(() => null);
  if (!response.ok || envelope?.success === false) {
    throw new ApiError(envelope?.error?.message ?? '', response.status);
  }
  return envelope?.data;
}
