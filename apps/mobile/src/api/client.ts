import { uuid } from 'expo-modules-core';

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

// Stands in for the web app's per-tab id: one per app launch, sent with every
// request. The server binds a session's tokens to it.
let deviceId: string | undefined;

export function getDeviceId() {
  return (deviceId ??= uuid.v4());
}

/** The server can reply with the id it has bound a session to. Use that one from then on. */
export function setDeviceId(id: string) {
  deviceId = id;
}

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
 * `{ success, data | error, timestamp }` envelope. Throws `ApiError` when the
 * server refuses the request. A network failure or timeout throws whatever
 * `fetch` throws.
 */
export async function post(
  path: string,
  body: unknown,
  headers?: Record<string, string>,
): Promise<unknown> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-window-device-id': getDeviceId(),
      ...tenantHeaders,
      ...headers,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const envelope: Envelope | null = await response.json().catch(() => null);
  if (!response.ok || envelope?.success === false) {
    throw new ApiError(envelope?.error?.message ?? '', response.status);
  }
  return envelope?.data;
}
