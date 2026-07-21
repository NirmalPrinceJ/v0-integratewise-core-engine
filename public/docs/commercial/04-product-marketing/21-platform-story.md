# 21 — Platform Story

Status: CANONICAL · Commercial OS
Owner: Product Marketing
Last verified: 2026-07-21
Audience note: "platform" is internal vocabulary — customer-facing assets say "the infrastructure beneath the workspace." Never use "platform" as our category ([18 §6](../03-positioning-messaging/18-terminology-guide.md)).

---

## Purpose

How to tell the story of everything beneath the workbench — for technical evaluators, analysts, and investors who need to know the product isn't a thin UI over a chatbot.

**Target audience (of the story):** CIOs, architects, security teams, technical champions, analysts, technical investors.

---

## 1. The Story

The workspace is deliberately calm; the infrastructure beneath it is deliberately serious. Six responsibilities, cleanly separated (platform doctrine):

```
                    ┌──────────────────────────────┐
                    │   Shared Workbenches (product)│  what the user sees
                    └──────────────┬───────────────┘
                          ContinuityBundle ↑ (scoped context, evidence, authority)
┌───────────────────────────────────────────────────────────────┐
│  PLATFORM — continuity infrastructure                          │
│  · Adaptive Spine: canonical state, identity, relationships    │
│  · Evidence & memory: provenance, freshness, TruthLayer        │
│  · Policy & governance: authority, approvals, audit            │
│  · Signals & proposals: observation, grounded triggers         │
│  · Projection Engine: state → role-composed workbenches        │
│  · Governed execution: approved actions across connected tools │
└──────────────┬────────────────────────────────────────────────┘
               │ IW-Continuity-Bridge (bounded access for approved entry points)
        70+ connected tools (CRM, support, billing, comms, …)
```

**The design argument (tell it as a choice, not a feature list):** most AI products put a model between the user and their tools and hope. We put _governed state_ between them — and let models visit. Deterministic systems (pipelines, normalization, sync, validation) do what deterministic systems do best; adaptive systems (the Twin's reasoning) do what they do best; and neither is allowed to impersonate the other. A model output is never truth; UI state is never truth; **canonical work state is truth**, and everything that touches it is identity-bound, tenant-scoped, policy-checked, and audited.

## 2. The Six Laws (quote to technical audiences — from platform doctrine)

1. Canonical work state is authoritative; UI state and model output are not.
2. Every cross-boundary request is identity-bound, tenant-scoped, policy-checked, time-bounded, and auditable.
3. Context is projected for a stated purpose — no participant receives unrestricted tenant state.
4. Evidence, decisions, proposals, and actions preserve provenance and authority separately.
5. Execution is governed: preparation, recommendation, and approval are distinct stages.
6. The platform fails closed when it cannot establish authority, boundary, or policy.

## 3. Why This Matters Commercially

| Platform property                                      | Buyer translation                                                                                                                                    |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fail-closed boundaries                                 | "A prompt can't talk its way past policy" — the CISO's sentence                                                                                      |
| Provider-agnostic models                               | "Swap AI vendors by configuration; nothing resets" — no AI lock-in                                                                                   |
| Provenance on every field                              | "Board decks with sources, not vibes"                                                                                                                |
| Deterministic pipelines + adaptive reasoning separated | "The sync doesn't hallucinate; the reasoning doesn't corrupt the data"                                                                               |
| Bridge with bounded projections                        | "Your other tools can use the truth — under the same governance" (private alpha; don't oversell — [42 Security FAQ](../07-sales/42-security-faq.md)) |

## 4. Telling Rules

- Technical audiences get this story **after** the workbench story, never instead of it — the platform exists to make the calm surface trustworthy.
- Never expose internal topology as product ("15 domains, 31 services" is repo talk, not sales talk).
- The one diagram above is the only platform diagram in external use — one picture, told consistently, beats five accurate ones.
- Proof beats: live provenance panel · approval + audit trail · model-swap by config · a failed-closed request shown honestly.

**KPIs:** technical-evaluation pass rate; security-review cycle time ([42](../07-sales/42-security-faq.md)); % of technical stakeholders who can restate "AI never owns truth" unprompted after the session.

---

**Related:** [22 Spine Story](22-adaptive-spine-story.md) · [27 Governance Story](27-governance-story.md) · [26 Capability Story](26-capability-fabric-story.md) · [42 Security FAQ](../07-sales/42-security-faq.md)
