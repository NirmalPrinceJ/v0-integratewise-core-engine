# 45 — Onboarding Playbook

Status: CANONICAL · Commercial OS
Owner: Founder (CS)
Last verified: 2026-07-21

---

## Purpose

Days 0–30, minute-by-minute where it matters. Onboarding has one job: make the product's promise physically real before the optimism window closes. The promise: **first value same-day; the ritual replaced in week one; activation by day 30.**

**Target audience:** CS operator; sales (to promise exactly this and no more).

---

## 1. Design Principles

1. **Hydration before ceremony.** Tools connect in the kickoff meeting itself; data flows while we talk. No "phase 1: alignment workshops."
2. **The first morning is the product.** Every seat's day-1 experience is the workbench opening on _their_ accounts with the three beats. We engineer that moment; nothing else matters until it lands.
3. **Time-to-first-value is designed in, not hoped for** (activation doctrine): the workbench opens after minutes-to-hours of initial hydration; deep history back-fills in the background.
4. **Baselines or it didn't happen.** The metrics that win the renewal are captured in week one ([28 §4](../05-value-pricing/28-customer-outcomes.md)).

## 2. The 30-Day Arc

### Day 0 — Kickoff (60 min, all POV/paid seats + P2)

| Min   | Beat                                                                                                                                                                                                                                                                                                                                   |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–10  | Frame: "By the end of this call your tools are connected and hydrating. By tomorrow morning, your workbench knows your accounts." Success plan on screen — the 3 committed outcomes with numbers ([28](../05-value-pricing/28-customer-outcomes.md)), inherited from the sales handoff ([37 Play 6](../07-sales/37-sales-playbook.md)) |
| 10–35 | **Live connection ceremony:** CRM first (HubSpot/Salesforce OAuth — minutes), then support/billing/comms. Each connector: "connected → hydrating" visible on screen. This _is_ the demo of "no IT project"                                                                                                                             |
| 35–50 | Baseline capture (while hydrating): each seat's H (self-reported morning minutes), QBR prep hours, last-surprise story. Recorded in the success plan                                                                                                                                                                                   |
| 50–60 | The contract: "Tomorrow 9am, open your workbench before anything else. Day 2 I'll call to hear what you saw. Week 1 we do first-morning reviews. Day 30 we measure against these baselines."                                                                                                                                           |

### Day 1 — The First Morning (engineered, not left to chance)

Pre-flight (us, before their 9am): hydration status per connector · entity resolution sanity (their top-10 accounts assembled correctly) · at least one legitimate _what changed_ present · signals thresholds sane for their data shape. If the workbench isn't ready, we call _before_ they open it — a broken first morning costs the whole optimism window.

### Day 2 — First-Morning Debrief (15 min/team)

"Open your workbench. Narrate what you see." Listen for: recognition ("that's my account") · surprise ("it already knows X") · gaps (missing tool, wrong mapping — fix same-day). First Ask-Your-Twin together; first Store-in-Spine together. The four controls taught _in their data_, never in a slide.

### Week 1 — The Ritual Replacement

- Each seat: morning-workbench habit (the email/Slack nudge: "What changed for your accounts today?")
- First Assign: every seat delegates one real prep (meeting brief, account summary) and reviews the evidence
- First Approve: at least one governed action per seat — the trust threshold crossed personally
- Us: daily 15-min office hours; connector/mapping fixes < 24h; **week-1 time sample** (morning minutes, measured again)

### Weeks 2–3 — Depth and the First Catch

- Signal review: are surfaced signals _real_ to them? Tune thresholds with their feedback (the noisy-v1 lesson from the build plan: iterate openly)
- TruthLayer habit: approve/reject memory proposals in the weekly rhythm; the org's verified memory starts compounding
- Target: **first documented catch** by day 21 ([44 play](44-customer-success-playbook.md) if quiet)
- Manager view for P2: team adoption + early time-deltas

### Day 30 — Activation Review (P2 + team lead, 30 min)

The scorecard, honestly: activation % vs. 70% target · morning minutes: baseline → now · approved actions/seat/week · catches with evidence · blockers with owners. Then: success plan confirmed/adjusted; cadence set ([44 §3](44-customer-success-playbook.md)); expansion seeds noted silently ([46](46-expansion-strategy.md)).

## 3. Activation Definition (canonical — [75](../13-operations/75-customer-success-metrics.md))

> A seat is **activated** when, in a single week, it has ≥ 5 approved Twin actions **and** ≥ 4 workbench-first mornings. An account is activated at ≥ 70% of seats activated by day 30.

## 4. Failure Modes & Countermeasures

| Failure                                                  | Countermeasure                                                                                                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Connector stall (missing admin/OAuth rights)             | Pre-kickoff checklist to champion: admin availability confirmed for the call                                                                        |
| "Another tab" syndrome (workbench beside the old ritual) | Manager models it: team standup runs _from_ the workbench, week 1                                                                                   |
| Data-quality shock ("that mapping is wrong")             | Frame at kickoff: "You'll find mapping gaps week one — that's normal; we fix same-day. The provenance panel shows you exactly what came from where" |
| Twin over/under-surfacing (noise or silence)             | Threshold tuning session week 2; honesty about iteration (v1 noisy → v4 good)                                                                       |
| Baseline skipped in kickoff excitement                   | Success plan template has required fields; day-30 review literally cannot run without them — structural forcing function                            |

**KPIs:** same-day hydration rate 100% · day-1 workbench readiness 100% (pre-flight compliance) · week-1 ritual replacement (≥ 4 workbench-first mornings/seat) ≥ 60% of seats · day-30 activation ≥ 70% · first catch ≤ 21 days ≥ 70% of accounts · time-to-first-value (kickoff → first approved action) ≤ 48h median.

---

**Related:** [44 CS Playbook](44-customer-success-playbook.md) · [28 Outcomes](../05-value-pricing/28-customer-outcomes.md) · [37 Playbook — handoff](../07-sales/37-sales-playbook.md) · [75 CS Metrics](../13-operations/75-customer-success-metrics.md)
