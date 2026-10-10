import { ApiError } from '../api/client';

/** What to tell the user when a sign-in request fails. */
export function failureMessage(error: unknown, fallback: string): string {
  // A 4xx says what to fix (wrong password, expired code), so show the server's wording.
  if (error instanceof ApiError && error.status < 500 && error.message) {
    return error.message;
  }
  return fallback;
}
