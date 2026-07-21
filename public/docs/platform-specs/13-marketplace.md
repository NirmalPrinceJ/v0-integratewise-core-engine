# 13 — Marketplace

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 1157
> **Lines:** 40 | **Chars:** 1,905
> **Status:** Raw extraction — requires review and canonicalization

13 — Marketplace
13.1 Responsibilities
Listings for Connectors, Capabilities, Workflows, Design Packs, Persona Kits.
Installation, upgrade, uninstall, reinstallation, tenant migration.
13.2 Listing model
Copymkt*listing:
id: mkt_listing*…
vendor: org\_…
kind: connector|capability|workflow|design_pack|persona_kit
version: semver
visibility: public | tenant_only | beta
permissions: [scopes…]
pricing: free | trial | metered | seat
trial_days: 14
artifacts: [signed bundle URLs]
audits: last_review_at, reviewer
13.3 Installation lifecycle
Copydiscover ──▶ trial ──▶ purchase ──▶ installed ──▶ upgraded ──▶ (uninstalled | reinstalled)
│ │ │
▼ ▼ ▼
refunded downgraded archived
13.4 Tenant migration
Migrating a listing installation is a re-bind; IDs preserved via installation_id.
Revoked listing → all hanging tenants receive ListingRevoked event.
13.5 Permissions / Billing / Trial / Uninstall / Reinstall
Permissions enforced by Governance (09) on first invocation.
Billing via Stripe (CF Worker integration); usage events emitted for metered SKUs.
Trial marks tenant with trial=true; expiry triggers downgrade flow.
Uninstall revokes tokens, archives projection cache, retains audit (16).
Reinstall uses installation_id to keep Connector credentials rotation-safe.
13.6 Events
Produced: ListingInstalled, ListingUpgraded, ListingTrialStarted, ListingUninstalled, ListingRevoked, ListingBilled.
Consumed: CapabilityRegistered, WorkflowRegistered.
13.7 APIs
POST /marketplace/listings, POST /marketplace/install, POST /marketplace/{mkt_id}/uninstall, POST /marketplace/{mkt_id}/upgrade.
13.8 Failure handling
Install auth failure → reject + admin notification.
Uninstall mid-call → mark pending then finalize.
13.9 Extension points
Vendors onboard through SDK (17), validated by automated review and manual sign-off.
