import { ApiError } from './client';

/**
 * The server's own wording for why it refused a request, when it gave any. A
 * 4xx says what is wrong (wrong password, expired code, no wallet), so its
 * wording is worth showing. Anything else has none: no connection, a timeout,
 * or a fault on the server.
 */
export function refusalMessage(error: unknown): string | undefined {
  return error instanceof ApiError && error.status < 500 && error.message
    ? error.message
    : undefined;
}

/** What to tell the user when a request fails: the server's wording, or `fallback` without any. */
export function failureMessage(error: unknown, fallback: string): string {
  return refusalMessage(error) ?? fallback;
}
