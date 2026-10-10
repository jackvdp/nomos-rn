import { ApiError, get, post } from '../api/client';
import { getDeviceId, type Organisation, type Session } from './session';

// The calls behind sign-in and sign-out. They only talk to the server: starting
// and ending the app's session is `useAuth`'s job.

export type LoginResult =
  | { status: 'signedIn'; session: Session }
  // A one-time code has been emailed. Finish with `verifyCode`. `deviceId` is
  // set when the server names the id it expects from then on.
  | { status: 'needsCode'; deviceId?: string }
  // The account is signed in somewhere else; `where` names it when the server
  // says. Call `login` again with `replaceOtherSession` to take over.
  | { status: 'activeElsewhere'; where?: string };

type Fields = Record<string, unknown>;

/**
 * Looks up the organisation called `name`. Resolves to `undefined` when the
 * server knows none by that name.
 *
 * Signing in needs the kind of portal the organisation has, and its theme
 * settings are where the server gives that. The web app reads it from there
 * too.
 */
export async function findOrganisation(name: string): Promise<Organisation | undefined> {
  let data: { themeSettings?: Fields } | undefined;
  try {
    data = (await get('/api/super-admin/customers/theme-settings', { name })) as typeof data;
  } catch (error) {
    // 401 is the server's answer for a name it does not know.
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
      return undefined;
    }
    throw error;
  }
  const portalType = data?.themeSettings?.portalType;
  return {
    name,
    portalType: typeof portalType === 'string' && portalType ? portalType : undefined,
  };
}

/** Signs in to the current organisation with an email address and password. */
export async function login(
  email: string,
  password: string,
  replaceOtherSession = false,
): Promise<LoginResult> {
  const reply = await authPost('/api/admin/auth/login', {
    email,
    password,
    deviceId: getDeviceId(),
    forceLogin: replaceOtherSession,
  });
  if (reply.activeSession) {
    const { browser, device } = (reply.session ?? {}) as Fields;
    const where = [browser, device].filter((part) => typeof part === 'string' && part).join(' on ');
    return { status: 'activeElsewhere', where: where || undefined };
  }
  if (reply.requiresMfa) {
    return { status: 'needsCode', deviceId: serverDeviceId(reply) };
  }
  return { status: 'signedIn', session: toSession(reply) };
}

/** Finishes a sign-in that asked for the one-time code emailed to `email`. */
export async function verifyCode(email: string, code: string): Promise<Session> {
  return toSession(await authPost('/api/admin/auth/verify-otp', { email, otp: code }));
}

/** Emails a fresh one-time code. */
export async function resendCode(email: string): Promise<void> {
  await post('/api/admin/auth/resend-otp', { email });
}

/** Revokes the current session on the server. */
export async function logout(): Promise<void> {
  await post('/api/admin/auth/logout');
}

// The auth endpoints put their result under `data.user`, whichever it is: a
// session, a request for a one-time code or a notice of another session. The
// API spec does not describe this; it follows how the NOMOS web app reads the
// replies.
async function authPost(path: string, body: unknown): Promise<Fields> {
  const data = (await post(path, body)) as { user?: Fields } | undefined;
  return data?.user ?? {};
}

/** The device id the server has bound this sign-in to, when the reply says. */
function serverDeviceId(reply: Fields) {
  const { deviceId } = (reply.user ?? reply) as Fields;
  return typeof deviceId === 'string' && deviceId ? deviceId : undefined;
}

function toSession(reply: Fields): Session {
  const { accessToken, refreshToken } = reply;
  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    throw new Error('The sign-in reply had no tokens.');
  }
  return { accessToken, refreshToken, deviceId: serverDeviceId(reply) ?? getDeviceId() };
}
