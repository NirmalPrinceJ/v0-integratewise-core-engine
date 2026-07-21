# 30 — Pricing Strategy

Status: CANONICAL · Commercial OS — **wins every price conflict**
Owner: Founder
Last verified: 2026-07-21
Decision (2026-07-21): per-seat model supersedes the per-workspace grid in `docs/product/FINANCIAL_MODEL.md` §1 for the enterprise motion. Regional per-seat lists preserve the multi-market strategy. Evolution recorded in §6.

---

## Purpose

The canonical price book and the philosophy behind it. Every deck, proposal, website page ([53](../10-website/53-website-copy.md)), and model ([77](../13-operations/77-annual-gtm-plan.md)) quotes these numbers exactly.

**Target audience:** Sales, finance, founders; the source for public pricing pages.

---

## 1. Pricing Philosophy (why priced this way)

1. **The seat is a human+Twin pair.** We never price the Twin separately — a person and their Twin are one unit of work. Pricing the AI as an add-on would contradict the category (collaboration, not feature).
2. **Value-anchored, incumbent-undercutting.** Anchor: one seat reclaims ≥ $1,700/month of time (conservative — [29](29-roi-framework.md)); Command at $119 captures < 7% of created value. Reference points: Gainsight $2,500+/mo platform minimums; copilot add-ons $30/seat with email-level value.
3. **Trust has a graduation path.** Tiers mirror the trust journey — see truth first, let the Twin prepare next, govern execution last. The pricing page teaches the product philosophy.
4. **Expansion is architectural.** Seats grow by department (workbench expansion), tier upgrades follow trust, no artificial usage walls on the core loop. NRR is designed in, not negotiated in.
5. **97%+ gross margin protected** at every tier (COGS $0.55–$2.10/seat — FINANCIAL_MODEL §2).

## 2. The Price Book (canonical)

**Global list (USD, per seat per month, annual billing · monthly billing +20%):**

|                   | **Starter $19**                          | **Growth $59**                            | **Command $119**                                                        | **Enterprise custom**                                          |
| ----------------- | ---------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------- |
| Positioning       | See your truth                           | Work with your Twin                       | Govern the work                                                         | Continuity at scale                                            |
| Workbenches       | 1 department                             | 3 departments                             | Unlimited                                                               | Unlimited + custom                                             |
| Connectors        | 3                                        | 10                                        | 25+                                                                     | Unlimited + custom                                             |
| Spine & Entity360 | ✅ (5K entities)                         | ✅ (50K)                                  | ✅ (250K)                                                               | Custom volume                                                  |
| Twin              | — (workbench + signals only, rule-based) | Observes · explains · prepares · suggests | Full grammar incl. **propose + governed execution** + TruthLayer memory | + policy customization                                         |
| Sync              | 4h                                       | 1h                                        | 15min                                                                   | Custom/near-real-time                                          |
| Governance        | Audit log                                | Approvals + audit                         | Full lifecycle + TruthLayer + export                                    | + SSO/SCIM, custom policies, DPA, SLA 99.9%, dedicated support |
| Entry point       | Self-serve                               | Self-serve + assisted                     | Sales-assisted                                                          | Sales-led (15-seat min, from ~$150/seat effective)             |

**Regional lists (multi-market strategy preserved — [78](../13-operations/78-international-expansion.md)):**

| Market        | Starter | Growth | Command         |
| ------------- | ------- | ------ | --------------- |
| India (INR)   | ₹499    | ₹1,499 | ₹2,999 /seat/mo |
| UAE/GCC (USD) | $12     | $39    | $79 /seat/mo    |

Regional lists activate with those market launches; feature gates identical; fences: billing entity + data region.

**Deal math (canonical examples — reuse everywhere):** Land 15 × Growth = $10.6K ACV · Core 20 × Command = $28.6K ACV · Expanded 50 seats mixed ≈ $60–70K ACV · Enterprise 100+ ≈ $150K+ ACV.

## 3. Discount & Commercial Policy

| Lever                         | Policy                                                                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Annual prepay                 | Built into list (monthly +20%)                                                                                               |
| Multi-year                    | Year-2 price lock free; 2-yr prepay −10% ceiling                                                                             |
| Volume                        | 50+ seats −10% · 100+ −15% · beyond: founder approval                                                                        |
| Design partners (2026 cohort) | −50% year 1, named-logo + case-study rights required, converts to −20% year 2 ([77](../13-operations/77-annual-gtm-plan.md)) |
| Nonprofit/edu                 | −30%                                                                                                                         |
| Floor                         | Never below 50% of list; never free-forever seats. A price that isn't respected isn't a price.                               |

**POV (proof of value):** 30 days, up to 10 seats, full Command, free with signed success criteria + decision date ([37](../07-sales/37-sales-playbook.md)). Not a "free trial" — a scoped evaluation with an exit.

## 4. Objection-Ready Price Defense

- _"Copilot is $30 and included-ish."_ — "Copilot drafts documents. This runs your account operations: assembled truth, governed actions, owned memory. Different job, and your team already demoted the other kind." ([09 Card 1](../02-category-market/09-competitive-battle-cards.md))
- _"Gainsight bundles more."_ — "Gainsight bundles a rules engine you staff. We price the seat, not the admin burden." (Card 4)
- _"Why not usage-based?"_ — "Usage pricing punishes adoption. We want your team to approve _more_ Twin actions, not budget them." (Also honest: predictable spend wins procurement — [43](../07-sales/43-procurement-faq.md).)
- _"$119 is steep."_ — conservative ROI: $1,716/seat/month reclaimed at H=3, A=0.4. "The seat costs 7% of what it returns."

## 5. Pricing Metrics & Review

Quarterly review against: win-rate by tier · discount depth trend · Growth→Command upgrade rate (target ≥ 40% of Growth accounts within 12 mo) · NRR (target 120% — [72](../13-operations/72-revenue-metrics.md)) · price-objection frequency in loss reasons (< 15%).

Repricing triggers: sustained win-rate > 75% (priced low) · price-led losses > 25% (packaging problem — fix fences before price) · COGS drift > $3/seat.

## 6. Evolution Ledger

| Date       | Change                                                                                                            | Rationale                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 2026-07-21 | Per-seat 19/59/119 supersedes per-workspace ₹999–$1,500 grid for enterprise motion; regional per-seat lists added | Seat = human+Twin philosophy; aligns with Strategic Build Plan's $59 hypothesis; enterprise-standard procurement |
| 2026-07-12 | Tier A grid (Starter/Growth/Command per workspace, 3 markets)                                                     | Superseded above; tier names + AI-graduation logic preserved                                                     |

**KPIs:** ACV by segment vs. canonical deal math; tier mix; upgrade velocity; discount discipline (avg realized/list ≥ 85%).

---

**Related:** [31 Packaging](31-packaging-strategy.md) · [32 Licensing](32-licensing-strategy.md) · [29 ROI](29-roi-framework.md) · [72 Revenue Metrics](../13-operations/72-revenue-metrics.md)
