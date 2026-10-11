import { ApiError } from './client';

/** What to tell the user when a request fails. */
export function failureMessage(error: unknown, fallback: string): string {
  // A 4xx says what is wrong (wrong password, expired code, no wallet), so show the server's wording.
  if (error instanceof ApiError && error.status < 500 && error.message) {
    return error.message;
  }
  return fallback;
}
