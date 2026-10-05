# NOMOS mobile app: background briefing

*Written 5 October 2026 for the agent working in this repo. It covers what NOMOS is, how the product is meant to work, what already exists on the server side, and what is still undecided. It is background, not a specification: no written brief for the mobile app exists yet (see section 11).*

**Confidential.** This file draws on NOMOS product documents and a technical pack marked confidential by the supplier. Keep `background/` out of any public or shared remote.

**How to read it.** Facts carry their source and date where they could have moved. Anything marked *Inference* is a reading of the material, not something NOMOS has said. Where two sources disagree, both are given.

---

## 1. What you are building

A React Native app for NOMOS, built by Jack Vanderpump in this repo. NOMOS already runs as a web platform with a backend operated by an outside agency (section 7). The September 2026 product direction says NOMOS "should feel consistent across mobile and web" with identity, permissions, context labels and security controls working the same way everywhere. That sentence is the only stated requirement for mobile.

Not on file anywhere: the v1 feature set, a deadline, design files, API documentation, whether a mobile client has already been started by anyone else, or the terms on which this build is being done. Do not assume any of them. Section 11 lists what to ask.

Jack works with NOMOS directly as an independent consultant, through Buzzmint. Separately he is Head of Policy Research at the International Centre for Parliamentary Studies (ICPS), which is NOMOS's convening partner in the electoral sector. Keep the two apart: no ICPS member data, contact lists or internal material in this repo, and nothing from this repo in ICPS-facing material.

## 2. What NOMOS is

A verified professional network and digital workplace for public servants, starting with people who run elections.

- Public positioning (trustnomos.com, 5 October 2026): "The verified, secure operating platform for public service." Four areas: verified identity, secure communications, trusted knowledge with training and certification, and intelligent tools.
- Internal positioning (Sean Evins, September 2026): "The trusted digital workplace for public service. Verified people. Secure workplaces. Trusted knowledge. Intelligent tools."
- The entry product is the **verified credential for the electoral workforce**: a tamper-evident digital record of a worker's identity, role and training, issued by their electoral body and held by the worker. The network and workplace features follow once an institution has adopted the credential.
- The problem it answers: elections need a large temporary workforce that is recruited, trained and vetted from scratch each cycle, with no portable record of who has done the work before and no instant way to check in the field that someone claiming to be an election official is one.
- Voter identity is out of scope, always. NOMOS credentials are about staff, never voters.
- Stated target: 100,000 members (Charles Symons, 27 July 2026).

## 3. Who uses it

- **Temporary election workers**: poll workers, clerks, presiding officers. The volume users. A single national body can engage tens or hundreds of thousands per election (Kenya's is put at around 300,000).
- **Permanent staff of electoral management bodies (EMBs)**: administrators, trainers, senior officials. Around 190 national EMBs exist worldwide.
- **Institutional administrators**: verify their people, issue and revoke credentials, run the organisation's private workplace.
- **Approved participants with no current institution**: academics, observers, former officials, content partners.
- Later: other public-service workforces (census, courts, health departments).

Institutions in the pipeline at September 2026 were in the United States, Kenya, South Africa, Sierra Leone and Bhutan. *Inference:* expect a wide spread of devices and connectivity, with a large share of users on modest Android phones and unreliable networks. The product direction itself asks for low-bandwidth and selected offline use.

## 4. The product model

Source: "NOMOS Product Positioning Sept 2026" (Sean Evins). It replaced an earlier two-instance model (local institution first, global hub second).

**One account, three layers.** Identity belongs to the person. Institutional membership is a verified relationship attached to that account.

| Layer | What it is | Who controls it | Contains |
|---|---|---|---|
| Person | One lasting account and a Professional Passport | The individual; institutions own the claims they issue | Identity, profile, credentials, training, badges, memberships, privacy controls |
| Organisation | A private workplace per institution | The institution | Feed, announcements, directory, messaging, internal communities, documents, assigned courses, workflows, admin and audit |
| Network | The shared community of verified people | NOMOS, under independent governance | People discovery, connections, news, communities, events, courses, shared workspaces |

**NOMOS Home** is the front door to all three, not a fourth layer: a Workplace-style feed built around people and communities, with learning, events, news and required actions around it. Home and Feed are one screen.

**Context is the central idea.** A person may belong to no organisation, one, or several. A context switcher moves them between each organisation, the Network and any shared workspace. At every moment the user must be able to answer: Where am I? Who can see this? Which role am I using? Every post, message and search result shows where it belongs, and the user picks an audience before publishing.

**Core objects** (the intended data model):

- Person: the persistent account
- Credential: a signed claim with issuer, subject, scope, status, issue date and expiry
- Organisation: a verified institution with its own private workplace
- Membership: person to organisation, with role and access state
- Context: the active security boundary (person, organisation, Network, community or shared workspace)
- Community or shared workspace: a governed membership boundary with owners, purpose and lifecycle
- Content item or conversation: has an owner, context, audience, classification and provenance
- Permission policy, and audit event

**Communities** come in four types: organisation (inside one workplace), Network (eligible members across NOMOS), private (hidden or invite-only), and shared workspace (a formal cross-institution space with its own members, documents, retention rules and end date). Joining any of them never gives access to another institution's private workplace.

**Product functions:** Home, Profile, Professional Passport, Communities, Network, Messages, News, Events, Courses, Search, Intelligent tools (AI, a later phase).

**Terminology.** Use the current names; the old ones may still appear in the existing product and APIs.

| Use | Not |
|---|---|
| Communities | Forum |
| Professional Passport | My Wallet ("wallet" may remain the technical service name) |
| Messages | Communications |
| Network-wide | Public (reserve "public" for the open internet) |

**Two kinds of badge that must never look alike:** "verified by an authorised issuer" (a credential) and "earned through NOMOS activity" (participation).

**Content provenance must be visible.** The product distinguishes official institutional content, approved partner content, NOMOS editorial content, practitioner contributions, and AI-created or AI-assisted material.

## 5. Requirements that bear on a mobile client

From the positioning document's platform requirements and acceptance criteria.

- Same account, navigation and design across mobile and web; only context, audience and permissions change.
- **Multilingual from the start**: interface, content, search and notifications. No launch languages are named anywhere.
- **Low-bandwidth and selected offline access**: core learning materials, saved resources and selected operational content. Anything stored offline must be encrypted, permission-controlled, and updated or removed when the device reconnects.
- Strong sign-in: multi-factor authentication or passkeys, with single sign-on available to institutions.
- Permissions are enforced by the services, not by hiding things in the interface. The client still has to render context and audience honestly.
- Revocation is fast: when a membership, role or credential ends, access tied to it ends across sessions, search, messaging and tools. The client cannot rely on cached entitlements.
- Leaving an organisation ends workplace access but never deletes the account or the person's legitimate record.

**Non-negotiable acceptance criteria** (verbatim in substance):

1. One person can use the same account across several legitimate roles and organisations.
2. Where policy allows, someone can join the Network without belonging to an organisation.
3. The user can always see their active context and the audience for an action.
4. Network search shows only Network profiles and content deliberately shared there, never private workplace data.
5. A connection, community or shared workspace never provides access to another organisation's workplace.
6. When a membership or credential is revoked, access tied to it ends quickly and consistently.
7. Intelligent tools follow the user's permissions and cannot cross contexts without the user knowing.
8. Verified credentials and participation badges look different and mean different things.

**Three test cases the design must survive:** someone in one institution, someone in several, and an approved Network member who belongs to none.

*Inference, not agreed scope:* two flows look naturally mobile-first. One is carrying and presenting a credential in the field, with someone else verifying it on the spot. The other is secure coordination and incident reporting on election day. Both are in the public pitch; neither has been named as a mobile priority.

## 6. Design direction

- Keep the current **navy-and-cyan** identity, cards and clean spacing.
- Rebalance around people, activity and conversation: warm, active, familiar, but serious enough for public institutions. Less empty space, fewer large promotional tiles, no administrative-dashboard feel.
- References: Facebook Workplace for social usefulness, LinkedIn for professional identity and discovery, Slack for focused collaboration. They are references for feel, not for the security model.
- Web layout described: top bar (context switcher, universal search, Create, Messages, Notifications, user menu); left navigation (Home, Communities, Network, News, Events, Courses, Professional Passport); feed with composer at the top; supporting modules (Your Communities, Continue Learning, Upcoming Events, Trusted News, suggested people); a right rail for required actions, announcements and approaching credential expiries. Feed filters: All, My Organisation, NOMOS Network, My Communities, Following.
- Profile lives in the avatar menu. Notifications are a utility, not a destination. Admin shows only to authorised users.
- The mobile translation of that layout is not specified. Sean's document includes a screenshot of the current homepage as the "design starting point"; it has to be opened in a browser, and no design files are on file.

## 7. The existing platform

Source: a technical pack from Weuno, the agency that builds and operates the platform, dated 22 July to 24 August 2026. It predates the September product direction, so read it as "what exists", not "what is intended".

**Shape.** AWS, London region (eu-west-2). Containerised services in three domains: Core, Minters and Wallet. PostgreSQL throughout, plus Redis, RabbitMQ and HashiCorp Vault.

| Domain | Public API host | Path prefixes | What it does |
|---|---|---|---|
| Core | `api.trustnomos.com` | `/prod`, `/messaging` | Main backend API; end-to-end encrypted messaging service |
| Minters | `api.minters.trustnomos.com` | `/cert-admin`, `/token-admin`, `/superadmin` | Credential (certificate) and token issuance, admin-facing |
| Wallet | `api.wallet.trustnomos.com` | `/wallet`, `/uhrp` | Wallet API; content-addressed file hosting |

Existing web front ends: `app.trustnomos.com` (the main application, with wildcard subdomains), `admin.trustnomos.com` (superadmin), `wallet.trustnomos.com`, `certify.trustnomos.com` (certificate minter admin), `origin.trustnomos.com` (token minter admin), `adminminters.trustnomos.com`, and a public credential verifier.

These hosts and prefixes come from an infrastructure description. They are not an API contract. Get real API documentation and a non-production environment before writing any client code against them.

**Authentication and tenancy.** JWT access tokens (tenant authentication verified with RS256), refresh tokens and session controls with revocation. Roles and granular permissions. The platform is multi-tenant: tenant context is carried into every authorisation decision. Tenant users, administrators and super administrators use separate authentication paths. MFA exists as an administrative capability.

**Credentials.** Decentralised identifiers (DIDs) for issuers and holders; signed W3C Verifiable Credentials; credential status and revocation checks; OpenID4VCI for issuance and OpenID4VP for presentation and verification. Issuer configuration is per tenant. The trust layer is the BSV blockchain, kept out of sight of users; personal data stays off-chain.

**Wallet custody.** The security statement describes a **custodial** wallet: wallet secrets are held server-side in Vault and private keys are never returned to clients. Briefing material elsewhere describes a worker-held wallet (the BRC-100 standard, product name Origin) with Certify as the issuance engine. Treat custody as custodial until told otherwise, and do not design on-device wallet key handling without confirmation.

**Messaging.** Designed as true end-to-end encryption with keys on the device and the server handling ciphertext only:

- X25519 key agreement, Ed25519 signatures, XChaCha20-Poly1305 authenticated encryption, HKDF-SHA-256
- X3DH-style asynchronous session setup and Double Ratchet (a Signal-style protocol)
- Each device is its own cryptographic endpoint: per-device sessions, device registration, signed public key bundles, key-change warnings
- Delivery over secure WebSocket, an offline encrypted queue, encrypted history, delivery and read receipts, encrypted attachments
- Group messaging with key rotation on membership change, with MLS as the later direction
- User controls: opt-in contact, blocking unknown senders, a device list, disappearing messages
- Weuno's roadmap lists a "secure client SDK or integration library" and a demo application as deliverables. Whether they exist, and whether they run under React Native, is unknown.

The statement says production claims apply to "the completed and tested integration profile" and that independent cryptographic review is still to come. Status at October 2026 is unknown.

**Lifecycle and privacy.** Accounts inactive for 90 days are marked inactive; after a further 90 days the account and eligible data are scheduled for deletion. A data subject access request capability was being added. The proposed GDPR position (a draft memo, 24 July 2026, awaiting NOMOS approval) makes client organisations the controllers for onboarding and credentials, with NOMOS as processor. Processing includes government identity and employment information and currently excludes biometrics, health, political or religious, criminal-record and children's data.

**Not found.** Nothing I read mentions a mobile client or a push-notification service. I read the security and messaging documents in full and roughly the first third of the infrastructure document.

**The gap to watch.** The existing platform is organised around tenants. The September direction is organised around a person with several memberships and a context switcher. Locking that data model was an action for the week of 14 September 2026 (Sean Evins, with Weuno); whether it happened, and what the API now exposes, is unknown. Sign-in, session handling and context switching in the app all depend on the answer.

## 8. What the client has to get right

Derived from sections 5 and 7. These are constraints, not library choices.

- Messaging private keys are generated and held on the device and never leave it. That needs hardware-backed secure storage and vetted native cryptography for the primitives listed above. No home-made crypto.
- Each install is a distinct device identity. Plan for device registration, device lists, key-change warnings and re-keying.
- Local data at rest (offline content, message history, cached profiles) is encrypted and purged on revocation, sign-out or account removal.
- Context and audience are always on screen. A user must not be able to post or message without knowing which organisation or community will see it. Cross-boundary messages carry a warning.
- Treat every entitlement as revocable at any moment; fail closed when the server says no.
- Internationalisation is built in from the first screen, not retrofitted.
- Design for poor networks: small payloads, resumable work, graceful offline states.
- Credential presentation and verification will follow OpenID4VP. Confirm the intended mobile flow before building one.
- The existing security statement expects independent penetration testing of client flows. Keep the client auditable.

## 9. Rules for copy and content

- British English. NOMOS in capitals. No em dashes.
- Neutral and operational. NOMOS takes no editorial line, makes no assessment of electoral outcomes and does not touch voter ID. It cannot be a vehicle for partisan campaigning.
- Say "credential", "verified", "Professional Passport". Avoid "digital identity", which carries surveillance connotations with this audience. Do not mention blockchain in user-facing copy.
- **Do not repeat certification claims.** The public website says NOMOS is independently certified for ISO 27001 and SOC 2 Type II. Weuno's security statement of 22 July 2026 says it is not a formal certification against either. Keep both out of app copy and store listings until NOMOS confirms.
- Write as if everything will be read by a public body's records officer. NOMOS sells to public institutions, and what officials do on the platform may be disclosable under freedom of information law. That question is open and unresolved.
- Content on the platform is to be classified by topic. A proposed controlled vocabulary of seventeen tags, not yet agreed with NOMOS: `workforce`, `training`, `polling-centre`, `registration`, `logistics`, `results`, `special-voting`, `boundaries`, `technology`, `cyber`, `disinformation`, `finance`, `legal`, `security`, `accessibility`, `stakeholders`, `post-election`. Do not hard-code it.

## 10. People and organisations

| Who | Role |
|---|---|
| Sean Evins | NOMOS. Owns product direction and the positioning document |
| Charles Symons | NOMOS and Buzzmint (his company, source of the underlying wallet and credential technology). Commercial lead |
| Alyna Butt | Founder and CEO of Weuno, the agency that builds and operates the platform. Owns the technical and security documentation and the data model deliverable |
| NOMOS CTO | Name not on file |
| Jack Vanderpump | Building this app. Independent consultant to NOMOS; also at ICPS |
| ICPS | International Centre for Parliamentary Studies. Convening partner; runs the Electoral Members' Network and the annual International Electoral Awards and Symposium |

Charles's notes of 27 July 2026 call the underlying platform "Engage" and describe it as multi-tenanted. Unconfirmed whether that is the codebase or product name.

## 11. Open questions

Nothing below is answered in any source. Resolve the first group before writing feature code.

**Scope and ownership**
1. What is v1 on mobile, and by when? Is anything expected for the 5 November soft launch or for Manila?
2. Has Weuno, or anyone, already started a mobile client? How does this repo relate to their codebase and release process?
3. Who publishes the app, under which name (NOMOS or Nomos365), with which store accounts and bundle identifiers?

**Backend**
4. Is there API documentation, a staging environment and test accounts?
5. Is the data model now person-first? How does a client list a user's memberships and switch context?
6. How does a mobile user sign in: password with MFA, passkeys, institutional single sign-on? Is there a mobile token flow?
7. Does the messaging client SDK exist, in what language, and has it been reviewed?
8. Is there any push-notification service, and what may a notification payload contain given messages are end-to-end encrypted?
9. Is the wallet custodial for mobile users, and what is the intended credential presentation flow?

**Product and design**
10. Are there design files and brand assets for mobile?
11. Which languages at launch?
12. What exactly must work offline?

## 12. Dates

- **5 November 2026:** NOMOS soft launch, under the name **Nomos365**. Whether Nomos365 is a rebrand, a product tier or a separate site was unresolved at 14 September 2026.
- **29 November to 3 December 2026:** 22nd International Electoral Awards and Symposium, Manila. NOMOS has exhibition space, a main-programme presentation and a syndicate room. *Inference:* the first room full of target users, so a natural point for a demonstrable app.

## 13. Sources

None of these are in this repo.

- **NOMOS Product Positioning Sept 2026**, Google Doc by Sean Evins, shared to `jack@vanderpump.tech`: https://docs.google.com/document/d/1iXXr6E2SCWvaVd9RFZ-A_nKLwvnUUBt58M4LvgyTb7E/edit. Read 5 October 2026. Sections 2 to 13 are the ones to read in full.
- **Weuno technical pack**, four attachments to Alyna Butt's email "Nomos Security & Technical Documentation" of 25 August 2026 in the `jack@vanderpump.tech` mailbox: AWS Infrastructure, Security and Operations Overview (24 August 2026); Security Architecture and Implemented Controls (22 July 2026); Secure Messaging Service Roadmap; GDPR Governance Internal Approval Memo (draft, 24 July 2026).
- **Jack's project notes**, in `~/Repos/electoral-awards-website/projects/nomos-consultancy/`: `CLAUDE.md`, `reference/nomos-shared-docs.md` (index of NOMOS documents and what was drawn from them), `briefings/Digital-Worker-Credentials-Crib-Sheet.md` (the credential product, market and glossary), `content/experts-corner.md` (the topic taxonomy), `content/editorial-policy.md`.
- **trustnomos.com**, read 5 October 2026.
