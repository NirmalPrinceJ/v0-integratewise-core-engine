# 18 — Terminology Guide

Status: CANONICAL · Commercial OS
Owner: Product Marketing
Last verified: 2026-07-21
Supersedes: naming fragments across `docs/product/SALES_AND_MARKETING.md` §14 and `docs/sales/index.md` (both remain valid where not contradicted here)

---

## Purpose

Every document in the Commercial OS, every page on the website, every sales call, and every investor conversation must use the same words to mean the same things. This guide is the language contract. When any other document conflicts with this one, this one wins — and the conflict gets fixed, not tolerated.

**Target audience:** Everyone at IntegrateWise, plus agencies, partners, and anyone who writes or speaks on the company's behalf.

**Objectives:** (1) One name per concept. (2) A clear internal/external boundary for technical vocabulary. (3) A recorded evolution ledger so nobody resurrects superseded terms.

---

## 1. The Category

**Category name (canonical, July 2026):**

> **Workspace for Human and AI Collaborative Work**

Shorthand in prose: "the collaborative work workspace" or simply "the Workspace."

**What we are NOT (never position as):** AI chatbot · AI assistant · copilot · integration platform · iPaaS · dashboard · knowledge base · operating system · "platform" as a category label.

**Evolution ledger (category):**

| Date       | Category framing                                                | Status                                                                                                                  |
| ---------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 2026-07-21 | Workspace for Human and AI Collaborative Work                   | **CANONICAL**                                                                                                           |
| 2026-07-12 | Operational Continuity Infrastructure (frozen launch narrative) | Superseded as category; **continuity survives as the moat narrative** — see [17 Differentiation](17-differentiation.md) |
| 2026-06    | Knowledge Workspace over the Spine                              | Superseded; "workspace" DNA carried forward                                                                             |
| Earlier    | "Operating System for Enterprise Context"                       | Rejected (DECISION 23) — never use                                                                                      |

Continuity did not lose. Continuity is _why the workspace wins_; the workspace is _what the customer buys_. Category answers "what is it?" Continuity answers "why can't anyone else do this?"

---

## 2. Core Architecture Vocabulary

Fixed one-sentence definitions. Reuse verbatim wherever a definition is needed.

| Term                          | Definition                                                                                                                                                                     | Audience                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| **Workspace**                 | The single environment where an organization's people and their Twins do their work.                                                                                           | External                                                                            |
| **Shared Workbench**          | A role-composed working surface, projected from the Adaptive Spine, where a human and their Twin collaborate on the same live work.                                            | External                                                                            |
| **Twin**                      | A person's governed AI counterpart that works alongside them on the same workbench — it prepares, suggests, and proposes; it never owns truth and never acts without approval. | External                                                                            |
| **Adaptive Spine**            | The canonical, governed operational state of the organization — the system that owns truth.                                                                                    | External (technical buyers); "the Spine" in short form                              |
| **Projection Engine**         | The layer that transforms canonical Spine state into role-composed workbenches, and carries governed changes back.                                                             | External (technical buyers)                                                         |
| **Capability Fabric**         | The governed execution layer that performs approved actions across connected systems.                                                                                          | **INTERNAL ONLY** — customer-facing: "governed actions across your connected tools" |
| **Governance**                | The approval, policy, and audit framework wrapped around every consequential action.                                                                                           | External                                                                            |
| **TruthLayer**                | The approval gate on organizational memory: AI proposes → human reviews → only approved knowledge enters the Spine.                                                            | External                                                                            |
| **Entity360**                 | The complete assembled view of any entity — truth, context, signals, memory, goals, relationships.                                                                             | External                                                                            |
| **IW-Continuity-Bridge**      | The access layer that packages bounded platform capabilities for approved entry points (apps, MCP clients, skills).                                                            | External (technical); status: private alpha                                         |
| **ContinuityBundle**          | The scoped package of context, evidence, authority, and capabilities the platform returns to a workbench.                                                                      | Internal / deep-technical only                                                      |
| **Organizational Continuity** | The property that context, memory, and accountability persist across people, tools, and time.                                                                                  | External                                                                            |
| **Governed Action**           | A unit of work performed through the platform under policy, with approval and audit.                                                                                           | External                                                                            |

**The product stack (canonical order, use everywhere):**

```
Workspace
  → Shared Workbench
    → Human + Twin Collaboration
      → Capability Execution
        → Organizational Continuity
```

---

## 3. The Human Control Grammar

Four user-facing controls. These are product language, approved for all audiences. Never rename them.

| Work loop | Control                   | Meaning                                                                                |
| --------- | ------------------------- | -------------------------------------------------------------------------------------- |
| Observe   | **Store in Spine**        | Preserve a fact, commitment, decision, or outcome through the governed truth pipeline. |
| Orient    | **Ask Your Twin**         | Understand current work from its already-grounded context.                             |
| Decide    | **Assign Your Twin**      | Delegate bounded investigation, analysis, drafting, and preparation.                   |
| Act       | **Approve Twin's Action** | Authorize a reviewable action across permitted connected tools.                        |

**Twin intervention grammar (product/technical audiences):** `NOTICE` · `EXPLAIN` · `RELATE` · `PREPARE` · `SUGGEST` · `PROPOSE`. The Twin is silent when it has nothing grounded to offer.

---

## 4. Canonical Lines

These sentences are frozen. Quote them exactly.

| Line                                                                           | Use                                            |
| ------------------------------------------------------------------------------ | ---------------------------------------------- |
| **"Truth you own. AI you rent. Approval in between."**                         | Brand doctrine — the ownership argument        |
| **"My work already knows its context. AI prepared the hard parts. I decide."** | Experience promise — the product feeling       |
| **"Every AI remembers. Only IntegrateWise remembers the truth."**              | Trust line — vs. AI competitors                |
| **"The Twin prepares. The human approves."**                                   | Governance law — one breath                    |
| **"AI never owns organizational truth. The Adaptive Spine owns truth."**       | Architecture doctrine — CIO/security audiences |
| **"The next piece of work starts where the last one ended."**                  | Continuity promise — anti "starting from zero" |
| **"Stop being the Human API."**                                                | Problem hook — practitioner audiences          |
| **"One workspace. Every person. Their Twin."**                                 | Category compression — headers, decks          |
| **"Dashboards show work. Workbenches do work."**                               | vs. BI/dashboards                              |
| **"Copilots visit your apps. IntegrateWise is where work lives."**             | vs. copilots                                   |

**One-liner (company):** IntegrateWise is the workspace for human and AI collaborative work — every person works alongside a governed Twin on shared workbenches, over operational truth the organization owns.

**One-liner (plain):** AI that remembers what you told it, finishes what it started, and doesn't make things up.

---

## 5. The Problem Vocabulary

**The Four Enemies** (canonical, from Tier A canon — unchanged):

| Enemy             | How the user says it                              | What it is                        |
| ----------------- | ------------------------------------------------- | --------------------------------- |
| **Amnesia**       | "I told it once. It forgot."                      | No persistent, governed memory    |
| **Babysitting**   | "It stops halfway. I have to keep nudging."       | No follow-through to completion   |
| **Hallucination** | "It says things confidently — and they're wrong." | No grounding in verified truth    |
| **Human API**     | "I'm the one copy-pasting between tools."         | The user is the integration layer |

**The Empty Context Tax:** the recurring cost of starting from zero — AUTH AGAIN · CONNECT AGAIN · EXPLAIN AGAIN · SEARCH AGAIN · RECONSTRUCT AGAIN · START AGAIN.

**The Quiet Demotion:** the ~80% who adopted AI, got burned, and silently downgraded it to writing emails. They don't need education; they need their trust restored.

---

## 6. Voice Rules

**Do:**

- Lead with the pain the user feels today, in their words.
- Back every claim with a number, a mechanism, or evidence.
- Say "the Twin prepares / proposes"; say "you approve / decide."
- Use the Four Enemies vocabulary when naming problems.
- Use "connected tools," "your stack," "your systems" for integrations.

**Never:**

- ❌ "Operating System," "OS," or "platform" as the category (DECISION 23 — still in force).
- ❌ "Capability Fabric" in customer-facing copy (internal architecture name).
- ❌ "AI that runs your business," "autonomous agents," "zero human involvement."
- ❌ "Replace your CRM" (we connect; tools stay).
- ❌ "We execute your workflows" for external stacks (we prepare, govern, and hand off).
- ❌ Competitor names in advertising (sales conversations only).
- ❌ "Assistant," "chatbot," "copilot" to describe the Twin.

**Register by audience:**

| Audience                    | Vocabulary depth                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Practitioner (CSM, AM, ops) | Enemies, control grammar, outcomes. No architecture terms.                                                     |
| Executive buyer             | Category, doctrine lines, ROI, continuity. Spine/Twin by name is fine.                                         |
| Technical evaluator         | Full external vocabulary incl. Adaptive Spine, Projection Engine, TruthLayer, Entity360, IW-Continuity-Bridge. |
| Internal / engineering      | Everything, incl. Capability Fabric, ContinuityBundle, ExecutionPlan.                                          |

---

## 7. Naming Drift Watchlist

Concepts at risk of duplication. One name each; report drift in doc reviews.

| Canonical         | Superseded / drift names — do not use                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| Adaptive Spine    | "the database," "the data layer," "Spine DB" (in marketing), "single source of truth platform"                       |
| Shared Workbench  | "department dashboard," "hub" (except legacy product names), "console"                                               |
| Twin              | "assistant," "agent" (unqualified), "AI teammate," "copilot"                                                         |
| TruthLayer        | "memory approval," "knowledge gating," "verified memory system"                                                      |
| Projection Engine | "rendering layer," "view builder," "Normalize Once Render Anywhere" (keep NORA as a _principle_, not a product name) |
| Workspace         | "portal," "app," "suite"                                                                                             |

---

## 8. Checklist for Every New Document

- [ ] Category phrase appears exactly as canonized (§1).
- [ ] Definitions quoted from §2, not paraphrased.
- [ ] No forbidden terms (§6) for the document's audience.
- [ ] Canonical lines quoted exactly (§4).
- [ ] Pricing numbers match [30 Pricing Strategy](../05-value-pricing/30-pricing-strategy.md).
- [ ] Metrics definitions match [72 Revenue Metrics](../13-operations/72-revenue-metrics.md).
- [ ] Cross-links resolve to real files.

**KPIs for this document:** zero terminology conflicts found in quarterly doc audit; 100% of new commercial docs pass the checklist; time for a new hire to speak the language correctly < 1 week.

---

**Related:** [11 Positioning](11-positioning.md) · [12 Messaging Framework](12-messaging-framework.md) · [05 Category Definition](../02-category-market/05-category-definition.md) · [71 Internal Enablement](../13-operations/71-internal-enablement.md) · Doctrine: `../../doctrine/README.md`
