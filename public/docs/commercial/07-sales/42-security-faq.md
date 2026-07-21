# 42 — Security FAQ

Status: CANONICAL · Commercial OS
Owner: Founder (until security hire) — technical truth sourced from `docs/doctrine/` + `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`
Last verified: 2026-07-21
**Honesty rule:** this document never claims a certification or control we do not hold. Aspirational items carry explicit status. One overclaim in a security review ends the deal and the reference — accuracy outranks impressiveness.

---

## Purpose

The buyer-facing security answer set — delivered _proactively_ at POV kickoff (arriving prepared is the trust move) and used verbatim in security questionnaires.

**Target audience:** Persona 4 (CISO/IT), P3 (RevOps evaluating), procurement.

---

## 1. Architecture (the five answers that matter most)

**"Where does our data live, and who can see it?"**
Your tenant's data is isolated with row-level security enforced at the database layer — tenant isolation is a database property, not an application promise. Data is encrypted in transit (TLS) and at rest. Cross-tenant access is structurally impossible through the application path; every request is identity-bound and tenant-scoped server-side. Client-supplied tenant/role claims are never authoritative.

**"Can the AI read everything in our tenant?"**
No. AI participants receive _scoped projections_ for a declared purpose — never unrestricted tenant state. Every cross-boundary exchange carries an explicit context boundary: subject, source, target, scope, purpose, permissions, policy references, and expiry. No projection may contain credentials, raw secrets, hidden prompts, or another agent's private reasoning.

**"Can the AI write to our data or act in our systems?"**
Not directly — ever. Two mandatory human gates: (1) **memory**: AI proposes knowledge; a human approves; only then does it enter organizational memory (TruthLayer); (2) **action**: execution requires an approved proposal; a prepared plan is never treated as completed work, and an AI message is never treated as an approval. Both gates are architecture, not configuration — there is no admin toggle that removes them.

**"What happens when a check fails?"**
The platform **fails closed.** When identity, tenant membership, policy, or boundary verification cannot complete, the request is rejected. A prompt cannot talk the system out of policy.

**"What's the audit story?"**
Every proposal, approval, execution, sync, and memory promotion is logged with identity attribution and preserved provenance. Evidence, decisions, and authority are recorded separately — you can always answer _who knew what, who decided what, on what basis_. Audit records are tamper-evident and survive user offboarding.

## 2. Data Handling

| Question                    | Answer                                                                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model training on our data? | **No.** Customer data is never used to train foundation models. No cross-tenant data use.                                                                                                      |
| Which AI providers?         | Provider-agnostic by architecture; models are swappable by configuration. Enterprise agreements can pin/exclude providers. Truth and memory live in _your_ Spine — a model swap loses nothing. |
| Connector credentials?      | OAuth-based; tokens stored encrypted; connectors read through governed pipelines — **no connector writes directly to canonical state.** Writebacks are governed operations requiring approval. |
| Data export / offboarding?  | Full Spine export in open formats, anytime. On termination: 60-day retrieval window, then deletion with certification ([32 Licensing](../05-value-pricing/32-licensing-strategy.md)).          |
| Sub-processors              | Cloud infrastructure (edge compute/storage), connector OAuth infrastructure, AI inference providers — current list supplied with the DPA.                                                      |
| Data residency              | Multi-region edge infrastructure today; region-pinning on the Enterprise roadmap (**status: roadmap — do not sell as present**).                                                               |

## 3. Compliance Status (dated honesty — update monthly)

| Item                | Status (2026-07)                                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| SOC 2 Type I        | **In preparation** — controls program underway; target: post-seed funding milestone ([68](../12-corporate/68-fundraising-story.md)) |
| SOC 2 Type II       | Follows Type I observation window                                                                                                   |
| GDPR                | DPA available; data-subject workflows supported; EU residency pending region-pinning                                                |
| Penetration testing | Scheduled with SOC 2 program; summary shareable under NDA when complete                                                             |
| SSO/SAML, SCIM      | Enterprise tier — **status: roadmap-near**; verify current build before committing dates                                            |

**Sales rule:** deals gated on certifications we lack are _nurture, not push_ ([33 Anti-ICP](../06-customers/33-ideal-customer-profile.md)). The honest sentence: "Type I is in preparation with [target window]; here's our architecture packet meanwhile — most teams find the mandatory-approval design answers the risk question the certification approximates."

## 4. The Shadow-AI Argument (offense, not defense)

Your team already uses AI — surveys say ~80% adopted it, and most use it ungoverned, pasting account data into consumer chatbots with auto-written memory. IntegrateWise is the _governed alternative_: same capability class, inside your tenant, with scoped projections, approval gates, and audit. The security conversation isn't "new risk?" — it's "replace unmanaged risk with governed capability."

## 5. Incident Posture

Fail-closed architecture limits blast radius by construction; audit trail supports forensics; contractual breach-notification commitments in the DPA. Public incident-response statement template maintained in [65 Press Kit](../12-corporate/65-press-kit.md).

**KPIs:** security-review pass rate; review cycle time (target < 2 weeks with proactive packet); questionnaire-answer reuse rate (target: 90% from this doc verbatim); zero overclaim incidents — permanent.

---

**Related:** [27 Governance Story](../04-product-marketing/27-governance-story.md) · [21 Platform Story](../04-product-marketing/21-platform-story.md) · [43 Procurement FAQ](43-procurement-faq.md) · [32 Licensing](../05-value-pricing/32-licensing-strategy.md)
