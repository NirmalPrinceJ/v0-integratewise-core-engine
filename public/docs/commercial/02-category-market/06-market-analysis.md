# 06 — Market Analysis

Status: CANONICAL · Commercial OS
Owner: Founder
Last verified: 2026-07-21
Number sources: `docs/product/INVESTOR_WRITEUP.md` §1, §5 (Tier A) + stated external sources. All market numbers used anywhere in the Commercial OS must come from this document.

---

## Purpose

The single source of market numbers: size, segmentation, demand evidence, and the assumptions behind our serviceable-market math. Prevents number drift across decks, docs, and posts.

**Target audience:** Founders, investors, marketing (for claims), sales (for business cases).

---

## 1. Demand Evidence (the problem, in numbers)

| Fact                                             | Value                            | Source discipline             |
| ------------------------------------------------ | -------------------------------- | ----------------------------- |
| SaaS applications per business (average)         | 130+                             | Productiv study, 2025 (canon) |
| Time on cross-tool context gathering             | 2–4 hrs/day per knowledge worker | canon; use 3 hrs for CSM math |
| Annual waste per CSM ($80/hr loaded)             | ~$62,000                         | canon                         |
| Team of 10 CSMs, annual waste                    | ~$620,000                        | canon                         |
| CSMs checking 8+ tools per account               | ~70%                             | canon                         |
| Consumers viewing AI data collection as a threat | 82%                              | canon                         |
| Enterprises requiring human oversight of AI      | 76%                              | canon                         |
| Adopters who quietly demoted AI to low-risk work | ~80%                             | canon (the Quiet Demotion)    |

**Interpretation:** demand is double-sided. The _fragmentation_ side (hours, tools) is a productivity budget; the _trust_ side (oversight requirements, demotion) is a governance budget. We are the rare product both budgets can buy.

---

## 2. Market Sizing

### TAM (top-down, canonical)

| Market                                           | Size      | Notes                                                                |
| ------------------------------------------------ | --------- | -------------------------------------------------------------------- |
| Global operational intelligence                  | **$47B+** | Canonical TAM figure                                                 |
| Global CS software (2026)                        | $16.5B    | Wedge-market context                                                 |
| Adjacent (collaboration + AI productivity spend) | expanding | Directional only — never quote a number without adding it here first |

### SAM (our serviceable segments)

| Segment                                         | Universe                   | Our target profile                                                                           |
| ----------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| **B2B SaaS with CS/RevOps teams (lead motion)** | 50,000+ companies globally | 50–1,000 employees, 5+ CSMs, 8+ tools in the account stack                                   |
| India SMB (MSMEs)                               | 63M+                       | Volume market — [78 International Expansion](../13-operations/78-international-expansion.md) |
| UAE Free Zone enterprises                       | 200K+                      | Compliance-heavy founder-operated — [78](../13-operations/78-international-expansion.md)     |

### SOM (bottom-up, enterprise CS wedge — per-seat model)

Assumptions (kept consistent with [30 Pricing](../05-value-pricing/30-pricing-strategy.md) and [77 Annual GTM Plan](../13-operations/77-annual-gtm-plan.md)):

```
Target accounts year 1:        50,000 × qualified profile ratio 20% = 10,000 realistic universe
Reachable via founder-led+content year 1: ~500 engaged accounts
Win path: 8 design partners → 4 paying (2026) → 40 customers (end 2027)
Typical land: 15 seats Growth ($59) ≈ $10.6K ACV
Typical expand: 25 seats Command ($119) ≈ $35.7K ACV
SOM (24 mo): 40 customers × blended ~$22K = ~$0.9M ARR — consistent with FINANCIAL_MODEL trajectory
```

---

## 3. Segmentation (who buys, in order)

| Priority | Segment                                | Why now                                                                                                                        | Entry workbench         |
| -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| 1        | B2B SaaS, 50–1,000 emp, CS-led         | Highest measurable pain (3 hrs/day), richest connectable stack (HubSpot/Salesforce+Zendesk+Stripe), fastest proof              | Customer Success        |
| 2        | Same companies, RevOps/Sales expansion | Land-and-expand from CS proof; same Spine, new workbenches                                                                     | Sales / RevOps          |
| 3        | MuleSoft/Salesforce ecosystem          | Founder network + ArchitectIQ wedge; partner channel ([48](../09-gtm/48-partner-strategy.md))                                  | CS + integration health |
| 4        | India SMB · UAE FZE                    | Volume + margin markets, deferred until enterprise motion is repeatable ([78](../13-operations/78-international-expansion.md)) | Business Ops            |

**Deliberately not targeted (now):** regulated-vertical enterprises (healthcare/banking) until SOC 2 Type II ([42 Security FAQ](../07-sales/42-security-faq.md)); companies <20 employees (insufficient tool sprawl); autonomy-seeking AI-forward teams (wrong philosophy fit — let competitors have them).

---

## 4. Market Dynamics & Timing

**Tailwinds:** AI budget reallocation from failed copilot pilots ("we spent $50K on AI and my team writes emails with it"); MCP standardization lowering connector cost; oversight regulation converting governance into procurement requirement; edge infrastructure making per-seat economics work at 97%+ gross margin (FINANCIAL_MODEL §2.4).

**Headwinds & responses:** platform giants bundling "free" copilots (response: category rubric — they fail owned-truth and mandatory-approval); AI fatigue among burned buyers (response: it's our entry story — the Quiet Demotion _is_ our ICP filter); long enterprise cycles (response: land small at 15 seats in the pained department, expand on proof).

**Timing claim (canonical):** the window is 2025–2028 — after trust collapsed in bolted-on AI, before an incumbent credibly restructures around governed shared state. Speed matters more than secrecy; the architecture choices (owned truth, mandatory approval) are ones incumbents _cannot_ copy without self-harm, which is what makes the window real.

---

## 5. Number Discipline

- Any new market number enters this file first with a source, then may be quoted elsewhere.
- Quarterly review: refresh counts (connectors, design partners), re-verify external stats, retire stale ones.
- Investor materials ([67](../12-corporate/67-investor-narrative.md)) may compress but never contradict this file.

**KPIs:** zero number conflicts across live assets (quarterly audit); engaged-account coverage vs. 500 target; segment-1 win rate vs. other segments (validates ordering).

---

**Related:** [05 Category Definition](05-category-definition.md) · [33 ICP](../06-customers/33-ideal-customer-profile.md) · [77 Annual GTM Plan](../13-operations/77-annual-gtm-plan.md) · [67 Investor Narrative](../12-corporate/67-investor-narrative.md)
