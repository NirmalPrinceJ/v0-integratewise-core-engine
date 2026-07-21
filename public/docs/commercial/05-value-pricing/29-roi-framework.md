# 29 — ROI Framework

Status: CANONICAL · Commercial OS
Owner: Sales + Finance
Last verified: 2026-07-21

---

## Purpose

The one ROI model used in every proposal, renewal, and board slide — with conservative/base/aggressive variants and honest rules. Consistency matters more than flattery: a defensible 8x beats a fragile 30x.

**Target audience:** Sales (proposals), CS (renewals/QBRs), buyers' finance teams (who will check the math).

---

## 1. The Core Model (Value Stream 1 — time)

```
ROI(monthly) = [ H × D × C × A × N ] ÷ [ N × P ]

H = hours/day currently on context gathering + prep   (from discovery; default 3.0 for CSMs)
D = working days/month                                 (22)
C = fully loaded hourly cost                           (default $65; use customer's number)
A = adoption × capture factor                          (conservative 0.4 · base 0.6 · aggressive 0.8)
N = seats
P = price per seat/month                               (tier price — [30 Pricing](30-pricing-strategy.md))
```

**Worked example — 20 CSM seats, Command ($119):**

| Scenario     | A   | Monthly value                           | Monthly cost | ROI       |
| ------------ | --- | --------------------------------------- | ------------ | --------- |
| Conservative | 0.4 | 3.0 × 22 × $65 × 0.4 × 20 = **$34,320** | $2,380       | **14.4x** |
| Base         | 0.6 | **$51,480**                             | $2,380       | **21.6x** |
| Aggressive   | 0.8 | **$68,640**                             | $2,380       | **28.8x** |

Payback: under one week in all scenarios. Canonical spoken form (matches [close playbook](../../sales/close-playbook.md)): _"Three hours a day, twenty people, $65 an hour — that's $85,800 a month in reconstruction work. Even if we only capture 40%, IntegrateWise pays for itself in the first week."_

**Rules:** H and C always come from the customer's own discovery answers — never defaults in a live proposal. A never exceeds 0.8 in writing. Present conservative _first_; let the buyer argue upward (they will — it's their own number).

## 2. The Extension Models (quantify when discovery surfaced them)

**Decision value (Stream 2):**

```
Churn catches: at-risk ARR identified early × historical save-rate uplift (default +15%)
Expansion catches: surfaced opportunities × close rate × avg expansion ACV
```

Example: one 60-day-early catch on a $120K account with +15% save uplift = $18K expected value — several months of subscription in one catch. Rule: only claim after the first real catch exists in _their_ tenant (POV makes this concrete — [37](../07-sales/37-sales-playbook.md)).

**Continuity value (Stream 3):**

```
Ramp: (weeks-to-productive_before − after) × weekly loaded cost × hires/year
Handover: hours/handover saved × handovers/year × C
Attrition insurance: qualitative until tenure data exists — narrate, don't number
```

**AI-spend consolidation (when they have burned copilot budget):** current AI seats delivering email-drafting only × seat cost — position as reallocation, not addition. ("You're already paying for AI your team demoted.")

## 3. TCO Honesty Box (include in every proposal — builds more trust than it costs)

| Cost           | Our answer                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Subscription   | Per-seat, tier-priced, no platform fee ([30](30-pricing-strategy.md))                                                           |
| Implementation | No services fee; connectors are OAuth self-serve; first value same-day ([45](../08-customer-success/45-onboarding-playbook.md)) |
| Admin burden   | No rules engine to maintain (contrast Gainsight card [09 §4](../02-category-market/09-competitive-battle-cards.md))             |
| Training       | Control grammar is 4 verbs; enablement in one session                                                                           |
| Exit           | Spine export anytime, open format — leaving is priced at zero by design                                                         |

## 4. ROI Presentation Rules

1. One slide, their numbers, three scenarios, payback line. Never a 40-cell spreadsheet first.
2. Time value anchors; decision/continuity value _narrates_ (numbers only when their data supports it).
3. Every figure traceable to a discovery answer — "your team told us H=2.5" beats any benchmark.
4. Leave the model with them, editable. Confidence in the math is the message.
5. Renewals reuse the same model with **realized** numbers from outcome reviews ([28 §4](28-customer-outcomes.md)) — the ROI slide at renewal is the ROI slide from the proposal, filled in.

**KPIs:** % proposals with customer-specific ROI (100%); ROI-slide → commit conversion; realized-vs-promised ratio at first renewal (target ≥ 0.8 — tracked honestly, [75](../13-operations/75-customer-success-metrics.md)).

---

**Related:** [16 Value Proposition](../03-positioning-messaging/16-value-proposition.md) · [28 Customer Outcomes](28-customer-outcomes.md) · [30 Pricing Strategy](30-pricing-strategy.md) · [37 Sales Playbook](../07-sales/37-sales-playbook.md)
