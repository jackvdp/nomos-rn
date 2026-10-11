import { get } from '../api/client';

// The calls behind the wallet. They only talk to the server and turn its
// replies into the shapes the app uses.

/** Where a credential stands. `unknown` is a status the app has no name for. */
export type CredentialStatus = 'active' | 'expired' | 'revoked' | 'deleted' | 'unknown';

/** A credential held in the user's wallet. */
export interface Credential {
  id: string;
  /** What the credential is, in the issuer's words, e.g. "Workforce Credential". */
  type: string;
  status: CredentialStatus;
  /** When it reached the wallet, as an ISO date. */
  receivedAt?: string;
  /** When it stops being valid, as an ISO date. Missing if it does not expire. */
  validUntil?: string;
}

type Fields = Record<string, unknown>;

/**
 * Lists the credentials in the signed-in user's wallet. It asks for the first
 * page only, which the server fills with up to 20.
 */
export async function listCredentials(): Promise<Credential[]> {
  const data = fields(await get('/api/wallet/verifiable-credentials'));
  // The API spec does not describe this reply. This follows how the NOMOS web
  // app reads it: a page of items, sometimes wrapped in a second `data`.
  const page = Array.isArray(data.items) ? data : fields(data.data);
  const items: unknown[] = Array.isArray(page.items) ? page.items : [];
  return items.flatMap((item) => toCredential(fields(item)) ?? []);
}

function toCredential(item: Fields): Credential | undefined {
  const { id, credentialTypes, status, receivedAt, validUntil } = item;
  if (typeof id !== 'string' || !id) return undefined;
  return {
    id,
    type: toType(credentialTypes),
    status: toStatus(status),
    receivedAt: text(receivedAt),
    validUntil: text(validUntil),
  };
}

// Every credential lists the general type "VerifiableCredential" next to its
// own, which is the one worth showing.
function toType(types: unknown) {
  const names = Array.isArray(types) ? types.flatMap((type) => text(type) ?? []) : [];
  return names.find((name) => name.toLowerCase() !== 'verifiablecredential') ?? names[0] ?? '';
}

// The wallet calls a credential it holds and that is in force "stored".
const statuses = new Map<string, CredentialStatus>([
  ['stored', 'active'],
  ['expired', 'expired'],
  ['revoked', 'revoked'],
  ['deleted', 'deleted'],
]);

function toStatus(status: unknown): CredentialStatus {
  return statuses.get(text(status)?.toLowerCase() ?? '') ?? 'unknown';
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function fields(value: unknown): Fields {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Fields) : {};
}
