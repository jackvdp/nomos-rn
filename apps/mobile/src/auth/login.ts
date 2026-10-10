import { getDeviceId, post, setDeviceId } from '../api/client';

export interface Session {
  accessToken: string;
  refreshToken: string;
}

export type LoginResult =
  | { status: 'signedIn'; session: Session }
  // A one-time code has been emailed. Finish with `verifyCode`.
  | { status: 'needsCode' }
  // The account is signed in somewhere else; `where` names it when the server
  // says. Call `login` again with `replaceOtherSession` to take over.
  | { status: 'activeElsewhere'; where?: string };

type Fields = Record<string, unknown>;

/** Signs in with an email address and password. */
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
    return { status: 'needsCode' };
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

// The auth endpoints put their result under `data.user`, whichever it is: a
// session, a request for a one-time code or a notice of another session. The
// API spec does not describe this; it follows how the NOMOS web app reads the
// replies.
async function authPost(path: string, body: unknown): Promise<Fields> {
  const data = (await post(path, body)) as { user?: Fields } | undefined;
  const reply = data?.user ?? {};
  const user = (reply.user ?? reply) as Fields;
  if (typeof user.deviceId === 'string' && user.deviceId) {
    setDeviceId(user.deviceId);
  }
  return reply;
}

function toSession(reply: Fields): Session {
  const { accessToken, refreshToken } = reply;
  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    throw new Error('The sign-in reply had no tokens.');
  }
  return { accessToken, refreshToken };
}
