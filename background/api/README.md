# NOMOS API reference

_Captured 8 October 2026 from the live dev Swagger. Background material, not a spec — the server is owned by the agency (see [../nomos-briefing.md](../nomos-briefing.md) §7). **Confidential**: keep `background/` off any public remote._

## Files here

- **`nomos-openapi.json`** — the full OpenAPI 3.0 spec, pretty-printed, exactly as served by the backend. 550 operations, 250 schemas. This is the source of truth; regenerate it rather than editing by hand.
- **`endpoints.md`** — a generated, human-readable index of every operation grouped by tag. 🔒 marks operations that need a bearer JWT.
- **`README.md`** — this file.

## How to get the spec

HTTP Basic auth protects both the Swagger UI and the raw JSON.

- Swagger UI: https://api.nomos-dev.weuno.co/api/docs
- Raw spec: https://api.nomos-dev.weuno.co/api/docs-json
- Basic-auth user: **`nomos`** (lowercase — capital `N` is rejected with `401 Invalid Swagger credentials`). The password is **not stored in this repo**; it's in the agent's local memory, or ask Jack.

Regenerate the saved copies:

```sh
curl -sS -u 'nomos:<password>' https://api.nomos-dev.weuno.co/api/docs-json \
  | jq '.' > background/api/nomos-openapi.json
```

Note this Basic-auth credential only gates the *docs*. It is unrelated to the API's own runtime auth (bearer + headers below), which is what the app will actually use.

## What this API is

- Title **Nomos v2.0** — "APIs for the Nomos super admin and admin." It is the **admin / super-admin** surface, not a published member/holder client. Before modelling the mobile app on it, confirm with NOMOS whether the app consumes this same API (a subset) or a separate member-facing one. The `Public-*`, `External-*`, `Identity - Public *`, `Verification - Public` and auth/membership groups are the most likely candidates for an end-user client.
- No `servers` block in the spec, so the base URL is implied: `https://api.nomos-dev.weuno.co` on dev. All paths are under `/api`.
- Built on NestJS (operationIds are `Controller_method`). Login/response DTOs hint at a security-forward design: DPoP request signing, per-device session binding, OTP.

## Runtime auth model

Five security schemes are defined. **Every one of the 550 operations requires the four header (`apiKey`) schemes; 479 of them additionally require `bearer`.**

| Scheme | Type | Sent as | Meaning |
|---|---|---|---|
| `bearer` | http / JWT | `Authorization: Bearer <jwt>` | Access token. Required by 479 ops. |
| `x-base-origin` | apiKey header | `x-base-origin` | Base origin for the request. |
| `x-origin` | apiKey header | `x-origin` | Origin for the request. |
| `x-portal-type` | apiKey header | `x-portal-type` | Which portal is calling (admin / super-admin / …). |
| `x-window-device-id` | apiKey header | `x-window-device-id` | Per browser-window/tab device id **bound to the access token**. |

Two more non-security headers appear as common parameters on operations: `x-request-id` (global request id) and `x-module-key` (module routing). Optional.

**Implication for the RN app:** an Axios/Apollo layer will need to inject all four `x-*` headers on every call plus the bearer token on protected ones. `x-window-device-id` is bound to the token, so it must be a stable, client-generated id persisted alongside the session (see `deviceId` / `sessionPublicKey` in the login DTO).

## Auth flow (`Admin-Auth`, `/api/admin/auth/*`)

- `POST /login` — body `LoginRequestDto`: `email`*, `password`*, optional `forceLogin` (replace an active session on another device), `deviceId` (client-generated), `sessionPublicKey` (**ephemeral Web Crypto JWK public key for DPoP request signatures**). Responses: 200 / 400.
- `POST /verify-otp`, `POST /resend-otp` — OTP step after login.
- `POST /refresh-token` — rotate the access token.
- `POST /logout` — revoke the current session.
- `POST /sso/google` — Google OIDC.
- `POST /forgot-password`, `/verify-reset-password-token`, `/reset-password`, `/change-password`, `/create-password`.
- `POST /public-signup` — signup via token.
- `GET /organizations`, `POST /switch-organization` — multi-org: a user can belong to several orgs and switch the active one.

A parallel `super-admin/auth/*` set exists under the `Superadmin-Auth` tag.

> DPoP + `sessionPublicKey` suggests the client is expected to generate an ephemeral keypair per session and sign requests. Confirm whether the mobile app must implement DPoP or whether bearer-only is accepted — React Native has no Web Crypto `SubtleCrypto` by default, so this is a known bare-RN/managed-Expo gap worth checking early (polyfill vs. native crypto module).

## Surface area (operation counts by tag)

Large platform. Major clusters:

- **Admin core** — Users (23), Organizations (13), Roles (8), Permissions (10), Custom-Modules (11 + articles/control), Events (13), Analytics (10), Home (9), Category/Label (12/12), News (10), Rewards (15).
- **Super-admin** — Domains (16), Customers (15), Users (10), Permissions (9), Roles (9), Settings (7), Auth (7), Portals, Stripe webhooks, faq.
- **Learning/content** — Courses (11 + lessons 8, materials 5, contents 7), Quiz (7 + questions 8, options 5, responses 2), Challenges (9 + daily 5 + submissions 4), Certificates (7 + attributes 3 + Web2 + public), Badges (7 + user-badges), Topics (9).
- **Decentralised identity / VC stack (large)** — `Identity - *` groups (Credential Requests 8, OpenID4VP/VCI, DID Documents & resolution, Status Lists, Trust Registry, Issuers, Verifier, Holder Binding, Setup), `NOMOS Credential Authenticator` (11), KYC (5), Verification (6 + public).
- **Blockchain / wallet** — `Minter Integration` (22), `HandCash` (8), `Wallet` (3), `Key-Bundle` (3).
- **Engagement / social** — Feed, Forum, Comments, Likes, Banners, Membership (18), Notifications + preferences, Messaging, Connections (9), Help, Share.
- **Infra** — health-check, RabbitMQHealth, Gateway (4), File Upload, Media-Store (4).

See `endpoints.md` for the complete per-operation list.

## Caveats

- Snapshot of **dev** on the date above; the agency may change it without notice. Treat `nomos-openapi.json` as a point-in-time capture and re-pull before relying on specifics.
- Spec has no top-level `tags` metadata (no group descriptions) and no `servers`.
- Admin-oriented. Do not assume the mobile app's contract matches until NOMOS confirms it.
