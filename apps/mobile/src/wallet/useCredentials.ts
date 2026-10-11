import { useCallback, useEffect, useRef, useState } from 'react';

import { listCredentials, type Credential } from './walletApi';

/**
 * The credentials in the signed-in user's wallet. Nothing is fetched until
 * `reload` is called. `credentials` is undefined until a fetch has succeeded,
 * and a later fetch that fails leaves the last list in place with `error` set.
 */
export function useCredentials() {
  const [credentials, setCredentials] = useState<Credential[]>();
  const [error, setError] = useState<unknown>();
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
      setError(undefined);
    } catch (failure) {
      if (request !== newest.current) return;
      setError(failure);
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
