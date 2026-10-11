import { getSession, hasSessionExpired, setSession, type Session } from '../auth/session';
import { ApiError, get } from './client';

const REFRESH_URL = expect.stringMatching(/\/api\/admin\/auth\/refresh-token$/);

const session: Session = { accessToken: 'access-1', refreshToken: 'refresh-1', deviceId: 'device' };

type Reply = { status: number; body: unknown };
/** What the server makes of a request: the path, the access token it carried and its JSON body. */
type Server = (
  path: string,
  accessToken: string | undefined,
  body: unknown,
) => Reply | Promise<Reply>;

const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

/** Has `fetch` answer as `server` would. */
function serve(server: Server) {
  fetchMock.mockImplementation(async (url, init) => {
    const headers = init.headers as Record<string, string>;
    const { status, body } = await server(
      new URL(url).pathname,
      headers.Authorization?.replace('Bearer ', ''),
      typeof init.body === 'string' ? JSON.parse(init.body) : undefined,
    );
    return { ok: status < 400, status, json: async () => body } as Response;
  });
}

const ok = (data: unknown): Reply => ({ status: 200, body: { success: true, data } });
const refused = (status: number, message: string, code?: string): Reply => ({
  status,
  body: { success: false, error: { message, statusCode: status, code } },
});
const tokenExpired = refused(401, 'Token has expired.', 'TOKEN_EXPIRED');
const renewedTokens = ok({ tokens: { accessToken: 'access-2', refreshToken: 'refresh-2' } });

/** The requests that went to the refresh endpoint. */
function refreshes() {
  return fetchMock.mock.calls.filter(([url]) => url.endsWith('/refresh-token'));
}

/** A server whose access token `access-1` has run out, and which takes `refresh-1` once. */
function serverWithExpiredToken(): Server {
  return (path, accessToken, body) => {
    if (path.endsWith('/refresh-token')) {
      return (body as { refreshToken: string }).refreshToken === 'refresh-1'
        ? renewedTokens
        : refused(401, 'Invalid or expired refresh token.');
    }
    return accessToken === 'access-2' ? ok({ path }) : tokenExpired;
  };
}

describe('the API client', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    setSession(session);
  });

  afterEach(() => {
    setSession(null);
  });

  test('sends the access token and returns the data', async () => {
    serve((path, accessToken) => ok({ path, accessToken }));
    await expect(get('/api/things')).resolves.toEqual({
      path: '/api/things',
      accessToken: 'access-1',
    });
  });

  test('renews the session and sends the request again when the access token has run out', async () => {
    serve(serverWithExpiredToken());

    await expect(get('/api/things')).resolves.toEqual({ path: '/api/things' });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      REFRESH_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ refreshToken: 'refresh-1' }),
      }),
    );
    // The device id is the session's, and stays so.
    expect(getSession()).toEqual({
      accessToken: 'access-2',
      refreshToken: 'refresh-2',
      deviceId: 'device',
    });
  });

  test('uses the renewed session from then on', async () => {
    serve(serverWithExpiredToken());
    await get('/api/things');
    fetchMock.mockClear();

    await expect(get('/api/others')).resolves.toEqual({ path: '/api/others' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('renews once for requests that find the token has run out at the same time', async () => {
    serve(serverWithExpiredToken());

    await expect(
      Promise.all([get('/api/one'), get('/api/two'), get('/api/three')]),
    ).resolves.toEqual([{ path: '/api/one' }, { path: '/api/two' }, { path: '/api/three' }]);
    expect(refreshes()).toHaveLength(1);
  });

  test('does not renew again for a refusal that comes back after the session was renewed', async () => {
    // The slow request is refused only once the quick one has had the session renewed.
    let releaseSlow = () => {};
    const slowHeld = new Promise<void>((resolve) => {
      releaseSlow = resolve;
    });
    const server = serverWithExpiredToken();
    serve(async (path, accessToken, body) => {
      if (path === '/api/slow' && accessToken === 'access-1') await slowHeld;
      return server(path, accessToken, body);
    });

    const slow = get('/api/slow');
    await get('/api/quick');
    releaseSlow();

    await expect(slow).resolves.toEqual({ path: '/api/slow' });
    expect(refreshes()).toHaveLength(1);
  });

  test('signs the user out when the server will not take the refresh token', async () => {
    serve((path) =>
      path.endsWith('/refresh-token')
        ? refused(401, 'Invalid or expired refresh token.')
        : tokenExpired,
    );

    await expect(get('/api/things')).rejects.toThrow(ApiError);
    expect(getSession()).toBeNull();
    expect(hasSessionExpired()).toBe(true);
    // The request is not sent again.
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('keeps the session when the refresh does not reach the server', async () => {
    serve((path) => {
      if (path.endsWith('/refresh-token')) throw new TypeError('Network request failed');
      return tokenExpired;
    });

    await expect(get('/api/things')).rejects.toThrow('Network request failed');
    expect(getSession()).toBe(session);
    expect(hasSessionExpired()).toBe(false);
  });

  test('keeps the session when the server fails during the refresh', async () => {
    serve((path) =>
      path.endsWith('/refresh-token') ? refused(503, 'Service unavailable') : tokenExpired,
    );

    await expect(get('/api/things')).rejects.toThrow(ApiError);
    expect(getSession()).toBe(session);
  });

  test('tries the refresh again after one that failed', async () => {
    let online = false;
    const server = serverWithExpiredToken();
    serve((path, accessToken, body) => {
      if (!online && path.endsWith('/refresh-token')) throw new TypeError('Network request failed');
      return server(path, accessToken, body);
    });
    await expect(get('/api/things')).rejects.toThrow('Network request failed');

    online = true;
    await expect(get('/api/things')).resolves.toEqual({ path: '/api/things' });
  });

  test('does not renew the session for any other refusal', async () => {
    serve(() => refused(401, 'Token tenant context is missing or invalid for the current tenant.'));

    await expect(get('/api/things')).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(getSession()).toBe(session);
  });

  test('does not renew anything when there is no session', async () => {
    setSession(null);
    serve(() => tokenExpired);

    await expect(get('/api/things')).rejects.toMatchObject({ code: 'TOKEN_EXPIRED' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('stays signed out when the user signs out while the session is being renewed', async () => {
    const server = serverWithExpiredToken();
    serve((path, accessToken, body) => {
      if (path.endsWith('/refresh-token')) setSession(null);
      return server(path, accessToken, body);
    });

    await expect(get('/api/things')).rejects.toThrow();
    expect(getSession()).toBeNull();
    // The user signed out; the server did not end the session.
    expect(hasSessionExpired()).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('does not renew a session that the user has since signed out of', async () => {
    serve(() => {
      setSession(null);
      return tokenExpired;
    });

    await expect(get('/api/things')).rejects.toMatchObject({ code: 'TOKEN_EXPIRED' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
