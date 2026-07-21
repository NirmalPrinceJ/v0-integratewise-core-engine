# 79 — Appendix

Status: CANONICAL · Commercial OS
Owner: Founder + PMM hat
Last verified: 2026-07-21

---

## Purpose

The reference tables the whole system leans on: the claims register (every public quantitative claim, verified and dated), the canonical numbers table, the document governance rules, and the source map to upstream truth.

**Target audience:** Everyone maintaining or auditing the Commercial OS.

---

## 1. The Claims Register (nothing ships publicly unless it's here)

| Claim | Source | Verified | Review by |
| --- | --- | --- | --- |
| 70+ connectors | Live connector registry / Tier A canon | 2026-07 | 2026-10 |
| Entity360 assembled < 200ms | Canonical spec / product measurement | 2026-07 | 2026-10 |
| 150+ entity types, 12 department schemas | Canonical spec | 2026-07 | 2026-10 |
| QBR prep 4 hours → 12 minutes | Design-partner result — **attribute as design partner** | 2026-07 | 2026-10 |
| 89% DAU within 2 weeks | Design-partner result — attribute as design partner | 2026-07 | 2026-10 |
| 2–4 hrs/day context gathering; $62K/yr per CSM | Canon market numbers ([06 §1](../02-category-market/06-market-analysis.md)) | 2026-07 | 2027-01 |
| 130+ SaaS apps per business | Productiv study, 2025 | 2026-07 | 2027-01 |
| 82% see AI data collection as threat · 76% enterprises require oversight · ~80% quiet demotion | Canon survey figures ([06 §1]) | 2026-07 | 2027-01 |
| $47B operational intelligence market · $16.5B CS software | Canon TAM ([06 §2]) | 2026-07 | 2027-01 |
| "The only AI memory that requires your approval" | Competitive scan ([08 §2](../02-category-market/08-competitive-landscape.md)) | 2026-07 | **2026-10 (quarterly — competitive claim)** |
| 97%+ gross margin structure; COGS $0.55–2.10/seat | FINANCIAL_MODEL §2 | 2026-07 | 2027-01 |
| $8M account save | Founder origin story — **narrative only, never a customer statistic** ([14 §4](../01-foundation/14-founder-story.md)) | — | permanent rule |
| SOC 2 status | [42 §3](../07-sales/42-security-faq.md) — **quote the dated table, never summarize upward** | monthly | monthly |

**Register rules:** new public number → added here first with source ([06 §5] for market numbers) · expired review date = claim pulled from new assets until re-verified · competitive claims reviewed quarterly without exception.

## 2. Canonical Numbers Table (cross-document consistency anchors)

| Number | Value | Defined in |
| --- | --- | --- |
| Pricing | $19 / $59 / $119 seat/mo annual · Enterprise custom · monthly +20% | [30 §2](../05-value-pricing/30-pricing-strategy.md) |
| Regional pricing | ₹499/1,499/2,999 · $12/39/79 | [30 §2] |
| Deal math | Land ~$10.6K · core ~$28.6K · blended ~$22K · Enterprise $150K+ | [30 §2] |
| ROI defaults | H=3.0 · C=$65 · A=0.4/0.6/0.8 · 22 days | [29 §1](../05-value-pricing/29-roi-framework.md) |
| Activation | ≥5 approved actions + ≥4 workbench-first mornings/wk; account ≥70% seats by day 30 | [45 §3](../08-customer-success/45-onboarding-playbook.md) |
| North star | ATA/seat/wk: 5 floor · 8 mature | [72 §1](../13-operations/72-revenue-metrics.md) |
| Retention | GRR ≥ 92% · NRR ≥ 120% | [72 §2] |
| Funnel | S1→Won ≥ 20% · POV win ≥ 60% · cycle ≤ 90d · coverage ≥ 3x | [74](../13-operations/74-sales-metrics.md) |
| 2027 exit | 35–40 customers · ~$800K–1M ARR | [77 §1](../13-operations/77-annual-gtm-plan.md) |
| Seed | $750K–1.2M · 45/25/15/10/5 allocation | [67 §10](../12-corporate/67-investor-narrative.md) |

## 3. Document Governance

Every document carries Status/Owner/Last-verified · precedence: [18 Terminology](../03-positioning-messaging/18-terminology-guide.md) wins language, [30](../05-value-pricing/30-pricing-strategy.md) wins prices, [72](../13-operations/72-revenue-metrics.md) wins metric definitions, [06](../02-category-market/06-market-analysis.md) wins market numbers, newest dated decision wins narrative — evolutions recorded in ledgers, never silently rewritten · quarterly audit: terminology checklist sample + claims register + cross-link integrity ([76 §4] ritual hosts it) · changes to CANONICAL docs get a dated evolution-ledger entry when they reverse a decision.

## 4. Upstream Source Map (what this OS derives from — never contradicts)

| Source | Owns |
| --- | --- |
| `docs/doctrine/00–04` | Product/platform/experience/distribution truth — the layer model, control grammar, boundary contract |
| `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md` | Platform technical truth |
| `docs/STRATEGIC_BUILD_PLAN.md` | Execution sequencing truth (180-day plan) |
| `docs/product/FINANCIAL_MODEL.md` | Financial model (per-seat re-basing noted in [30 §6], [77 §1]) |
| `docs/product/INVESTOR_WRITEUP.md` + `FUNDRAISE.md` | Investor fact archive (narrative evolved in [67]/[68]) |
| `docs/sales/*` | Call-level drill guides (extended by [36]–[41], still valid) |

## 5. Glossary Pointer

The single glossary is [18 Terminology Guide](../03-positioning-messaging/18-terminology-guide.md) — deliberately not duplicated here. One dictionary, one place.

**KPIs:** register completeness (zero unregistered public claims found in audits) · review-date compliance 100% · cross-link integrity (zero broken links at quarterly check) · governance-rule violations caught and corrected, trending to zero.

---

**Related:** [18 Terminology](../03-positioning-messaging/18-terminology-guide.md) · [README](../README.md) · [20 PMM Guide](../04-product-marketing/20-product-marketing-guide.md) · [76 OKRs](../13-operations/76-quarterly-okrs.md)
