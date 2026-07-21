# 28 — Identity Platform

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3330
> **Lines:** 47 | **Chars:** 2,558
> **Status:** Raw extraction — requires review and canonicalization

28 — Identity Platform
28.1 Responsibilities
Identity, Organizations, Invitations, Teams, SCIM, SAML, Enterprise SSO, MFA, Service Accounts, API Keys.
28.2 Identity layers
Person Identity: email/password, OAuth, SAML, magic-link.
Descope is the canonical identity and connection authorization authority (inbound person/organization identity and outbound connection authorization where supported). IntegrateWise owns tenant/workspace ownership, connector semantics, connection bindings, capability definitions, governance, routing, and continuity; Descope owns external authorization state and credential/token lifecycle.
Organization Identity: SCIM-issued users, federated mapping.
Service Identity: Service Accounts (svc*), API Keys (key*), scoped to workspaces and capabilities.
28.3 Inputs
Marketplace OAuth (per existing spec).
Admin invites, SCIM provisioning, SAML IdP assertions.
28.4 Outputs
usr*, org*, team*, inv*, key\_ records.
Session JWTs bound to device fingerprint (14).
Audit events for every identity operation.
28.5 Events produced
IdentityCreated, IdentityUpdated, InvitationSent, InvitationAccepted, InvitationExpired, TeamCreated, TeamMemberAdded, TeamMemberRemoved, SCIMProvisioned, SCIMDeprovisioned, ServiceAccountCreated, APIKeyIssued, APIKeyRevoked, MFAChallengeIssued, MFAVerified, MFAFailed.
28.6 Events consumed
MarketplaceInstalled (per existing spec), WorkspaceSwitched, SecurityAlert.
28.7 APIs
POST /identity/invitations, POST /identity/invitations/{inv_id}/accept, POST /identity/scim/sync, POST /identity/saml/acs, POST /identity/mfa/challenge, POST /identity/mfa/verify, POST /identity/service-accounts, POST /identity/api-keys.
28.8 State transitions
User: pending → active → suspended → deleted. Invitation: sent → accepted | expired | revoked. Service Account: active → rotating → retired. API Key: active → rotated → revoked.

28.9 RBAC + ABAC cross-reference
RBAC tables (per existing spec) bind usr* → role → cap.
ABAC layer (14.6) reads identity attributes: is_service, mfa_verified_within, device_posture, geo_region.
28.10 SCIM
Endpoint: /scim/v2/{org*}.
Mappings: SCIM user ↔ usr*; SCIM group ↔ team*.
Provisioning direction configurable: pull (SCIM → platform) or push (platform → SCIM).
28.11 SAML / Enterprise SSO
ACS endpoint: /identity/saml/acs.
Standard attributes mapped: email, name, department, employee_id.
JIT (Just-In-Time) provisioning gated by governancePosture.sso_provision.
28.12 MFA
TOTP, WebAuthn, push (via mobile app).
Risk-based re-challenge for high-governance capabilities.
28.13 Service Accounts
Bound to a Team (not an individual) for audit clarity.
API Keys scoped to cap_ids[] and wsp_ids[].
28.14 Failure handling
SCIM conflict → preserve newer-side, raise admin alert.
SAML assertion replay → reject + alert.
MFA failure > N → soft lock + admin notify.
28.15 Extension points
New identity provider via IDENTITY_PROVIDER(name).
Custom ABAC rules via POLICY_PACK(name) (14).
