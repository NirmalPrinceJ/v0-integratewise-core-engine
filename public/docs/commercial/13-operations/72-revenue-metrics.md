# 72 — Revenue Metrics

Status: CANONICAL · Commercial OS — **wins every metric-definition conflict**
Owner: Founder (RevOps hat)
Last verified: 2026-07-21

---

## Purpose

The company's revenue metric dictionary and dashboard spec: one definition per metric, one owner, one cadence. Marketing ([73](73-marketing-metrics.md)), sales ([74](74-sales-metrics.md)), and CS ([75](75-customer-success-metrics.md)) metrics roll up here; when definitions conflict, this file wins.

**Target audience:** Founder, future finance/RevOps hire, board/investors.

---

## 1. The North Star & The Tree

**North star: Approved Twin Actions per active seat per week (ATA/seat/wk).** Why: it's the one number that proves the category claim — humans and Twins *actually collaborating* on governed work. Revenue follows it: activation predicts retention, retention carries NRR, NRR carries the model.

```
ARR
├── New ARR  ← pipeline × win rate × ACV       [74 Sales]
├── Expansion ARR ← NRR vectors V1/V2/V3       [46 Expansion, 75 CS]
└── Churned ARR ← GRR, health, renewal plays   [47 Renewal, 75 CS]
        all three ← activation ← ATA/seat/wk ← onboarding [45]
                       pipeline ← demand engines [73 Marketing]
```

## 2. Canonical Definitions (the dictionary)

| Metric | Definition (exact) | Target (2027 steady-state) |
| --- | --- | --- |
| **ARR** | Annualized committed subscription revenue (excl. one-time add-ons [31 §3](../05-value-pricing/31-packaging-strategy.md)); design-partner discounts at *realized* value | per [77 plan](77-annual-gtm-plan.md) |
| **New ARR** | First-order-form ARR from net-new logos | — |
| **Expansion ARR** | Net positive change in existing-customer ARR (seats + tiers + benches) | ≥ 40% of gross new ARR by end-2027 |
| **NRR** | Cohort ARR now ÷ cohort ARR 12 mo ago, churn included, logo-constant | ≥ 120% |
| **GRR** | Same, expansions excluded | ≥ 92% |
| **ACV** | Total contract value ÷ years | Land ~$10K · blended ~$22K |
| **CAC** | Fully-loaded S&M cost ÷ new logos (founder time priced at market salary — no free-founder illusions) | < $8K blended |
| **CAC payback** | CAC ÷ (ACV × gross margin ÷ 12) | < 6 months |
| **LTV/CAC** | (ACV × GM × avg lifetime yrs) ÷ CAC | ≥ 4x |
| **Gross margin** | (Revenue − COGS: infra + AI inference + connector infra) ÷ revenue (FINANCIAL_MODEL §2) | ≥ 97% |
| **Activated seat** | ≥ 5 approved Twin actions **and** ≥ 4 workbench-first mornings in one week ([45 §3](../08-customer-success/45-onboarding-playbook.md)) | ≥ 70% of seats by day 30 |
| **ATA/seat/wk** | Approved Twin actions (memory + execution approvals) ÷ active seats, weekly | ≥ 8 at maturity (5 = activation floor) |
| **Pipeline coverage** | Open qualified pipeline $ ÷ next-quarter new-ARR target | ≥ 3x |

**Anti-vanity rules:** signups, page views, and connector counts never appear on the revenue dashboard · design-partner cohort reported separately from standard cohort (discounted ARR would flatter NRR) · every metric reported with its denominator visible.

## 3. The Dashboard & Cadence

**Weekly (founder, 30 min — the Friday ritual [37](../07-sales/37-sales-playbook.md)):** ATA/seat/wk trend · pipeline coverage · stage conversions vs. [36 §2] targets · activation of live onboardings.
**Monthly:** full tree — ARR bridge (new/expansion/churn) · NRR/GRR cohorts · CAC & payback · health-classified renewal forecast ([47 §5](../08-customer-success/47-renewal-strategy.md)).
**Quarterly (board-grade):** cohort curves · unit economics vs. FINANCIAL_MODEL assumptions (variance explained, model updated — the model is a living document) · phase-gate status ([50 §2](../09-gtm/50-gtm-strategy.md)).

**Tooling honesty:** at our stage this is a spreadsheet + CRM reports, maintained ruthlessly. The discipline is the tool. (And per Customer Zero: our own revenue workbench, as soon as the product can carry it — [44 §1](../08-customer-success/44-customer-success-playbook.md).)

**KPIs of the metrics system itself:** definition-drift incidents = 0 · dashboard shipped on cadence 100% · every board number traceable to this dictionary · forecast accuracy ±15% by mid-2027.

---

**Related:** [73 Marketing](73-marketing-metrics.md) · [74 Sales](74-sales-metrics.md) · [75 CS](75-customer-success-metrics.md) · [77 Annual Plan](77-annual-gtm-plan.md) · FINANCIAL_MODEL: `../../product/FINANCIAL_MODEL.md`
