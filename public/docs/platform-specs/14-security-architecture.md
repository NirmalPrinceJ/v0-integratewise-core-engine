# 14 — Security Architecture

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 1197
> **Lines:** 32 | **Chars:** 1,434
> **Status:** Raw extraction — requires review and canonicalization

14 — Security Architecture
14.1 Responsibilities
Zero Trust model at the Gateway and Worker level.
Tenant isolation, secrets, keys, encryption, RBAC inheritance, ABAC, sessions.
14.2 Tenets
Every request is authenticated.
Every request is authorized for the specific tenant + workspace + entity.
Secrets never leave the Vault.
Encryption at rest (D1+R2) and in transit (HTTPS).
14.3 Tenant isolation
Logical: row-level multi-tenancy via tnt_id predicate in every query.
Physical: per-tenant D1 partition (tnt_id sharding key) + per-tenant DO.
Network: egress to connectors only via the authorized outbound connection layer (Descope as canonical authorization authority, Nango retained as dormant compatibility) + allowlist.
14.4 Secret management
Cloudflare Secrets + KMS-backed envelope.
Key rotation cadence: 90 days for connector tokens; 30 days for signing keys.
14.5 RBAC inheritance
Roles (rbac_roles) inherit capabilities and permissions.
rbac_users.scope is the persona barrier.
14.6 ABAC layer
Attribute-based decisions supplement RBAC: time-of-day, region, device posture, signal severity.
14.7 Session management
Short-lived signed JWTs (≤30 min), refresh-token chain bound to device fingerprint.
Re-auth required on tenant switch.
14.8 Events
SecurityAlert, SecretRotated, KeyRotated, SessionAnomalous.
14.9 APIs
GET /security/policies, POST /security/secrets/{name}/rotate, POST /security/sessions/{sid}/revoke.
14.10 Failure handling
Repeated anomalies → account lock + alert (16).
14.11 Extension points
ABAC pluggable via POLICY_PACK(name).
