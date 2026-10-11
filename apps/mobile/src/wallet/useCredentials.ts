import { useCallback, useEffect, useRef, useState } from 'react';

import { refusalMessage } from '../api/failureMessage';
import { listCredentials, type Credential } from './walletApi';

/** Why the credentials could not be fetched. */
export type CredentialsError =
  // The server refused, in words worth showing: no wallet connected, session ended.
  | { kind: 'refused'; message: string }
  // Nothing worth showing: no connection, a timeout, or a fault on the server.
  | { kind: 'unavailable' };

/**
 * The credentials in the signed-in user's wallet. Nothing is fetched until
 * `reload` is called. `credentials` is undefined until a fetch has succeeded.
 * `error` says why the last fetch failed, and is null if it did not; a fetch
 * that fails leaves the last list in place.
 */
export function useCredentials() {
  const [credentials, setCredentials] = useState<Credential[]>();
  const [error, setError] = useState<CredentialsError | null>(null);
  const [loading, setLoading] = useState(true);
  // Counts the fetches started, so that only the newest one reports back.
  const newest = useRef(0);

  const reload = useCallback(async () => {
    const request = ++newest.current;
    setLoading(true);
    try {
      const list = await listCredentials();
      if (request !== newest.current) return;
      setCredentials(list);
      setError(null);
    } catch (failure) {
      if (request !== newest.current) return;
      setError(toCredentialsError(failure));
    }
    setLoading(false);
  }, []);

  // A fetch still under way when the screen goes has nowhere to report to.
  useEffect(
    () => () => {
      newest.current++;
    },
    [],
  );

  return { credentials, error, loading, reload };
}

// Whatever was thrown is sorted here, so that the screen never handles it raw.
function toCredentialsError(failure: unknown): CredentialsError {
  const message = refusalMessage(failure);
  return message ? { kind: 'refused', message } : { kind: 'unavailable' };
}
