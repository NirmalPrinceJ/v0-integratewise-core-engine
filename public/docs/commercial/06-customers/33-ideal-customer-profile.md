# 33 — Ideal Customer Profile

Status: CANONICAL · Commercial OS
Owner: Founder + Sales
Last verified: 2026-07-21

---

## Purpose

Who we pursue, who we defer, and who we decline — with scoreable criteria. Focus is the scarcest resource of a solo-founder GTM; the ICP is its budget.

**Target audience:** Sales (qualification), marketing (targeting), founder (pipeline discipline).

---

## 1. ICP v1 (lead motion — enterprise CS wedge)

**Firmographics:**

| Criterion                | Ideal                                   | Acceptable                         | Disqualify                                                        |
| ------------------------ | --------------------------------------- | ---------------------------------- | ----------------------------------------------------------------- |
| Type                     | B2B SaaS                                | B2B services w/ recurring accounts | B2C, project-based agencies                                       |
| Employees                | 50–1,000                                | 20–50 · 1,000–2,500                | < 20                                                              |
| CS team                  | 5–50 CSMs, named-account model          | 3–5 CSMs                           | No CS function                                                    |
| ACV of _their_ customers | $10K+ (account depth justifies tooling) | —                                  | Pure self-serve/PLG-only                                          |
| Geography                | North America · UK/EU (English-first)   | Global English-operating           | Data-residency-blocked regions (until Enterprise residency ships) |

**Stack signals (the connectable-pain test):**

- CRM: **HubSpot ideal (wedge connector), Salesforce strong** — one of the two near-required for v1
- Plus ≥ 3 of: Zendesk/Intercom · Stripe/billing · Slack · usage analytics (Amplitude/Pendo/Mixpanel) · Gmail/Calendar
- 8+ tools touched by CS in account work (their own count — ask in discovery)

**Situational signals (the why-now test — need ≥ 2):**

1. Churn surprise in the last 2 quarters (they'll tell the story unprompted).
2. Failed/underwhelming AI rollout — burned copilot/assistant budget, standing exec AI mandate (the Quiet Demotion, institutionalized).
3. CS leader accountable for NRR with flat headcount ("do more without hires").
4. Recent CS platform evaluation stalled on price or admin burden (Gainsight fatigue).
5. Account handover pain from CSM turnover.

**Philosophical fit (qualitative, decisive):** they want **governed** AI — oversight is a requirement, not an annoyance. Teams seeking full autonomy are wrong-fit by doctrine; let competitors have them ([06 §3](../02-category-market/06-market-analysis.md)).

## 2. ICP Scorecard (use on every account — 2 minutes)

Score 0/1/2 each: firmographic fit · CRM match · stack breadth · why-now signals (0=none, 1=one, 2=two+) · governance appetite · champion access (can we reach VP CS/COO?).

**≥ 9 = pursue now · 6–8 = nurture · ≤ 5 = decline politely.** Log score in CRM at qualification ([74 Sales Metrics](../13-operations/74-sales-metrics.md)); review score-vs-outcome quarterly to tune the ICP itself.

## 3. Expansion ICPs (documented, deferred)

| ICP                                                    | Trigger to activate                                                    | Reference                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| Same-company Sales/RevOps                              | Automatic on CS land — expansion, not acquisition                      | [46](../08-customer-success/46-expansion-strategy.md) |
| MuleSoft/Salesforce ecosystem partners & their clients | Partner channel live                                                   | [48](../09-gtm/48-partner-strategy.md)                |
| India SMB (CA-led) · UAE FZE                           | Enterprise motion repeatable ($50K+ MRR) + regional pricing activation | [78](../13-operations/78-international-expansion.md)  |

## 4. Anti-ICP (decline with grace — protect the roadmap and the brand)

- **Autonomy seekers** — "we want it to just do everything without approvals": doctrine mismatch; will churn angry.
- **Tool replacers** — "can this replace our CRM?": category misread; educate once, then pass.
- **Compliance-gated regulated enterprises** (bank/health/gov) pre-SOC 2 Type II: timing, not fit — nurture list with honest timeline ([42](../07-sales/42-security-faq.md)).
- **< 20-person startups**: insufficient sprawl; the pain we solve hasn't compounded yet. Point them to Starter self-serve, spend no sales time.
- **RFP tourists** — inbound RFPs where we're column-fodder against iPaaS/BI categories: the category is wrong on arrival; decline unless we can reframe with the economic buyer directly.

**Discipline rule:** every accepted wrong-fit deal costs three right-fit deals' worth of attention. The scorecard exists to make saying no cheap.

**KPIs:** % pipeline ≥ 9 score (target 80%); win rate by score band (validates the scorecard); wrong-fit churn rate (target ~0 — wrong fits shouldn't get in); ICP-revision log per quarter.

---

**Related:** [34 Buyer Personas](34-buyer-personas.md) · [06 Market Analysis](../02-category-market/06-market-analysis.md) · [38 Discovery Guide](../07-sales/38-discovery-guide.md) · [50 GTM Strategy](../09-gtm/50-gtm-strategy.md)
