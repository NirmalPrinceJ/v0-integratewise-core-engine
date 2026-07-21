# 32 — Licensing Strategy

Status: CANONICAL · Commercial OS
Owner: Founder (legal counsel review pending — flag, not blocker)
Last verified: 2026-07-21

---

## Purpose

The commercial-legal frame: what a seat legally is, contract structures, term mechanics, and the licensing positions that protect both revenue and doctrine ("truth you own" must be true in the contract, not just the copy).

**Target audience:** Founder, future sales/finance hires, buyers' procurement and legal ([43 Procurement FAQ](../07-sales/43-procurement-faq.md) is the buyer-facing rendering).

---

## 1. License Model

**Unit:** the **named-user seat** — one human + their Twin. Not concurrent, not floating; a seat is a person's working identity (their Twin's memory scope and approval authority are personal — floating seats would break governance attribution, which is a _product_ reason procurement understands).

| Term              | Position                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Seat reassignment | Free, immediate, when a person leaves/changes role; Twin scope re-provisions; history remains in tenant audit          |
| Seat true-up      | Quarterly, automatic report, net-new billed at contract rate (no retroactive penalties — trust posture)                |
| Seat reduction    | At renewal; mid-term reductions only in Enterprise agreements with negotiated flex band (±10%)                         |
| Minimums          | Starter/Growth: none · Command sales-assisted: 10 · Enterprise: 15 seats / ~$25K ACV floor                             |
| Affiliates        | Included within a single controlled group under one MSA; separate tenants per legal entity when data isolation demands |

## 2. Contract Architecture

**Paper stack:** Order Form → MSA → DPA → (Enterprise) SLA + Security Addendum. Self-serve tiers ride click-through ToS; sales-assisted uses our paper by default (fallback: customer paper for 100+ seat deals only, with non-negotiables preserved).

**Non-negotiables (the doctrine, contractualized):**

1. **Customer owns customer data and derived Spine content.** Our license to process is limited to providing the service. On termination: export in open formats, 60-day retrieval window, then deletion with certification. _"Truth you own" is a contract clause, not a slogan._
2. **No training on customer data** for foundation models; no cross-tenant data use. Aggregated, de-identified telemetry for service improvement only, opt-out available in Enterprise.
3. **Approval attribution is immutable.** Audit records of proposals/approvals/executions are tamper-evident and survive user deletion (compliance need + our governance story made legal).
4. **Provider-agnostic AI clause:** we may swap underlying model providers with notice; customer memory and truth are unaffected (this is a _feature_ in legal clothing — name it in the contract).

**Standard terms:** 12-month default; auto-renew with 30-day notice; payment Net-30 annual upfront (monthly billing +20% self-serve only); price-increase cap at renewal: max(7%, CPI) with 60-day notice; uptime SLA 99.9% Enterprise (credits schedule), best-efforts published status otherwise.

## 3. Positions on Common Redlines

| Buyer ask                  | Our position                                                                                                          | Rationale                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Unlimited liability        | Cap at 12-month fees; carve-outs: confidentiality breach, data-protection breach, IP infringement (industry standard) | Insurable, fundable, fair                                                     |
| IP indemnity               | Yes, standard defense obligations                                                                                     | Table stakes                                                                  |
| On-prem / self-host        | No. Cloud multi-tenant with isolation; Enterprise data-region selection roadmap                                       | Edge architecture is the margin moat (FINANCIAL_MODEL §2); don't sell it away |
| Source-code escrow         | Decline at our stage; revisit at scale                                                                                | Cost/benefit honesty                                                          |
| Custom SLAs above 99.9%    | Decline until infra history proves it                                                                                 | Never contract what we haven't measured                                       |
| MFN / benchmarking clauses | Decline                                                                                                               | Price-book integrity ([30 §3](30-pricing-strategy.md))                        |
| Audit rights               | Annual, notice-based, SOC-report-first (report satisfies most asks)                                                   | Standard                                                                      |

## 4. Design-Partner & POV Paper

**Design Partner Agreement (2026 cohort):** −50% year 1 pricing per [30 §3](30-pricing-strategy.md) in exchange for: named-logo rights, case-study participation with approval rights, monthly feedback sessions, metric instrumentation consent ([28 §4](28-customer-outcomes.md)). Converts automatically to standard paper at −20% year 2 unless either party exits.

**POV Agreement:** 30 days, ≤10 seats, full Command, mutual NDA, success criteria + decision date attached as exhibit, data deleted-or-converted at end. No auto-conversion to paid without an order form (no gotcha renewals — trust posture from first paper).

**KPIs:** contract cycle time (target < 3 weeks sales-assisted); redline frequency per clause (top-3 redlines reviewed quarterly — recurring redlines become standard positions); % deals on our paper; zero doctrine-clause concessions.

---

**Related:** [30 Pricing](30-pricing-strategy.md) · [43 Procurement FAQ](../07-sales/43-procurement-faq.md) · [42 Security FAQ](../07-sales/42-security-faq.md) · [47 Renewal Strategy](../08-customer-success/47-renewal-strategy.md)
