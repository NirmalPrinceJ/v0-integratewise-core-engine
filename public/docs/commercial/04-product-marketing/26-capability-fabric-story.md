# 26 — Capability Fabric Story

Status: CANONICAL · Commercial OS
Owner: Product Marketing
Last verified: 2026-07-21
⚠️ Naming rule: **"Capability Fabric" is internal vocabulary.** Customer-facing language: "governed actions across your connected tools." This document tells the story both ways and marks which is which ([18 §2](../03-positioning-messaging/18-terminology-guide.md)).

---

## Purpose

How to tell the execution layer — where prepared work becomes real work in real systems — without triggering the two misreadings: "iPaaS" (pipes) and "autonomous agents" (anarchy).

**Definition (internal, verbatim):** _The governed execution layer that performs approved actions across connected systems._

---

## 1. The Story (customer-facing telling)

Everything before this layer is preparation: the Spine assembled the truth; the Twin prepared and proposed; you approved. Now something has to actually happen — the email sends, the CRM updates, the task creates, the invoice adjusts. In every other AI product, this is where the story gets vague ("...and then it does it!") or scary ("the agent took 47 actions").

Here it is neither. An approved action executes through your **connected tools' own capabilities** — the same operations your team performs by hand today, now performed under a governance stamp: who proposed, on what evidence, who approved, what executed, what resulted. Every step recorded. Your tools remain the hands; your people remain the authority; IntegrateWise is the governed connection between judgment and execution.

Two honest boundaries, always stated:

1. **Approval precedes execution.** A prepared plan is never described as completed work; an AI message is never treated as an approval (product doctrine, verbatim rule).
2. **Your execution stack stays yours.** Where customers run their own automation (n8n, Zapier, agent runtimes), IntegrateWise prepares, governs, and **hands off** a vendor-neutral execution package (Canonical Handoff Contract) — "IntegrateWise is the Mind. Your stack provides the Hands."

## 2. Why It Exists (the argument)

- Advice-only AI dies at the last mile: if the user still does all the doing, the time savings cap at reading speed.
- Ungoverned execution dies at the first incident: one unapproved action costs more trust than a hundred good ones earned.
- The narrow path between — **execution under approval** — is the only version enterprises can adopt at scale, and it requires the whole stack beneath it (identity, policy, evidence, audit). That's why point tools can't bolt it on.

## 3. Audience Renderings

| Audience               | One line                                                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Practitioner           | "You approve; it actually happens — in your real tools, with a receipt."                                                                            |
| Executive              | "The gap between 'AI suggested' and 'work done' closes — without a single unapproved action."                                                       |
| Technical              | "Capability contracts resolve to connected tools' operations at runtime; execution requires an approval token; every step is audited. Fail-closed." |
| Automation-stack owner | "Your runners get smarter, governed instructions — we hand off a canonical, vendor-neutral package."                                                |

## 4. Proof Beats

1. Approve → watch the actual tool change (the CRM field updates live).
2. The receipt: proposal → evidence → approval → execution → result, one audit view.
3. The refusal: an unapproved action attempting to run — and failing closed. (Show the refusal; it's the most persuasive 10 seconds in the demo.)
4. Handoff package rendered for a customer's automation stack (technical evaluations).

## 5. Language Rules

- Customer-facing: "governed actions," "your connected tools," "approved actions execute." Internal/spec: Capability Fabric, capability contracts, ExecutionPlan.
- Never "we automate your workflows" (reads iPaaS), never "agents take actions" (reads anarchy).
- Always pair power with the gate: every sentence about execution carries approval in it.

**KPIs:** approved-action completion rate; execution incident count (target: zero unapproved actions, permanently); % demos showing the refusal beat ([39](../07-sales/39-demo-guide.md)).

---

**Related:** [27 Governance Story](27-governance-story.md) · [25 Twin Story](25-twin-story.md) · [21 Platform Story](21-platform-story.md) · [42 Security FAQ](../07-sales/42-security-faq.md)
