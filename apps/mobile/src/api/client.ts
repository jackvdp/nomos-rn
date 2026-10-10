import { getDeviceId, getOrganisation, getSession, type Organisation } from '../auth/session';

// The dev backend unless a build sets EXPO_PUBLIC_API_URL.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.nomos-dev.weuno.co';

// The domain that the server looks an organisation's name up under. The web
// app takes it from the address it is served from; a mobile build has no
// address, so it is set per build. The server cannot look an organisation up
// without it, so sign-in fails.
const BASE_ORIGIN = process.env.EXPO_PUBLIC_TENANT_BASE_ORIGIN;

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
 * device id, the organisation once one has been chosen, and the access token
 * once there is a session. Throws `ApiError` when the server refuses the
 * request. A network failure or timeout throws whatever `fetch` throws.
 */
export function post(path: string, body?: unknown): Promise<unknown> {
  return request('POST', path, { body });
}

/**
 * GETs from the NOMOS REST API. It returns and throws as `post` does.
 * `organisation` is who to ask about, when that is not the organisation
 * being signed in to.
 */
export function get(path: string, organisation?: Organisation): Promise<unknown> {
  return request('GET', path, { organisation });
}

interface RequestOptions {
  body?: unknown;
  organisation?: Organisation;
}

async function request(
  method: 'GET' | 'POST',
  path: string,
  { body, organisation = getOrganisation() }: RequestOptions,
): Promise<unknown> {
  const session = getSession();
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-window-device-id': getDeviceId(),
      ...(session ? { Authorization: `Bearer ${session.accessToken}` } : null),
      ...tenantHeaders(organisation),
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

/** The headers that say which organisation a request is for. Any without a value are left out. */
function tenantHeaders(organisation: Organisation | undefined) {
  return Object.fromEntries(
    Object.entries({
      'x-origin': organisation?.name,
      'x-base-origin': BASE_ORIGIN,
      'x-portal-type': organisation?.portalType,
    }).filter(([, value]) => value),
  ) as Record<string, string>;
}
