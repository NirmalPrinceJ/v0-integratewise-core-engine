# 31 — Packaging Strategy

Status: CANONICAL · Commercial OS
Owner: Founder + Product Marketing
Last verified: 2026-07-21

---

## Purpose

What goes in which box and why — the feature-gating logic behind the price book ([30](30-pricing-strategy.md)), the upgrade paths it creates, and the fences that keep them honest.

**Target audience:** Product (gate implementation), sales (upgrade motions), marketing (pricing page).

---

## 1. Packaging Logic: the Trust Ladder

The tiers are not "small/medium/large." They are stages of the trust journey — each tier's headline capability is the _next step of trust_ a team takes with AI:

```
Starter   "Show me the truth."        → Assembled state, no AI judgment. The show-me moment.
Growth    "Prepare things for me."    → Twin observes/explains/prepares/suggests. Trust builds on evidence.
Command   "Act — with my approval."   → PROPOSE + governed execution + TruthLayer memory. Trust pays off.
Enterprise "Govern it at scale."      → Policy customization, SSO/SCIM, SLA, data residency.
```

This ladder mirrors the intervention grammar (NOTICE→PROPOSE) and the control grammar — the packaging _is_ the product philosophy, which makes the pricing page a teaching asset, not a feature matrix.

**Design rule:** each tier must have exactly one headline answer to "what do I get by upgrading?" — Starter→Growth: _your Twin joins the bench_ · Growth→Command: _approved actions execute + memory compounds_ · Command→Enterprise: _your policies, your scale, your compliance_.

## 2. Fence Design (what gates, what never gates)

**Never gated (any paid tier):** number of connected _departments' data_ into the Spine (truth is whole or it's not truth) · provenance/audit visibility · export (leaving is always possible — doctrine) · security fundamentals (tenant isolation, encryption). We do not sell trust back to customers at higher tiers.

**Gated by tier (the honest fences):**

| Fence                                                    | Why it's the fence                                                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Twin capability depth (none → prepare → propose+execute) | The trust ladder itself; also tracks our AI COGS ($0 / ~$0.80 / ~$1.20 per seat)                       |
| Workbench count (1 → 3 → unlimited)                      | Maps to department expansion — the growth path ([46](../08-customer-success/46-expansion-strategy.md)) |
| Connector count (3 → 10 → 25+)                           | Correlates with stack complexity = value; generous enough to never block the wedge (CS needs 4–6)      |
| Entity volume (5K → 50K → 250K)                          | Company-size proxy, rarely binding in-tier by design                                                   |
| Sync frequency (4h → 1h → 15min)                         | Operational urgency premium; infra-cost aligned                                                        |
| TruthLayer governed memory                               | Command's crown jewel — memory that compounds is the switching cost, priced accordingly                |
| SSO/SCIM, custom policy, SLA, residency                  | Enterprise-cost realities, standard enterprise fence                                                   |

**Fence integrity test (run quarterly):** a fence fails if support tickets show users _hacking around_ it (fence too tight) or if <5% of upgrades cite it (fence irrelevant). Failed fences get redesigned, not enforced harder.

## 3. Add-ons (deliberately minimal)

| Add-on                           | Price                                         | Rule                                                                   |
| -------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| Custom connector development     | $2,500 one-time + maintenance in subscription | Enterprise only; roadmap-eligible connectors done free on our schedule |
| Additional entity volume         | $99/mo per +50K                               | All tiers                                                              |
| Premium support (Growth/Command) | $500/mo                                       | Enterprise includes it                                                 |

Nothing else. Add-on sprawl is how pricing pages die; new monetization enters as _tier value_ first, add-on only if truly orthogonal.

## 4. Upgrade Motions (how packaging sells)

| Trigger observed                                                   | Motion                                                                                        | Owner                                                      |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Starter team views signals daily but acts manually                 | "Your team is doing the Twin's prep by hand — turn it on": Growth trial 14 days               | Product-led prompt + CS                                    |
| Growth account's suggestions frequently executed manually in tools | "You're approving in spirit — get the approval gate + execution": Command POV on one workflow | CS ([46](../08-customer-success/46-expansion-strategy.md)) |
| Second department asks for access                                  | Workbench expansion → tier or seat growth                                                     | Sales + CS                                                 |
| Security review requests SSO/policy                                | Enterprise conversation                                                                       | Sales                                                      |

Packaging KPI targets: Starter→Growth ≥ 30% in 6 mo · Growth→Command ≥ 40% in 12 mo · add-on revenue ≤ 10% of ARR (if higher, packaging is leaking value into add-ons).

**KPIs:** upgrade rates by path; fence-integrity findings; pricing-page → signup conversion by tier ([73](../13-operations/73-marketing-metrics.md)); expansion ARR share of NRR ([72](../13-operations/72-revenue-metrics.md)).

---

**Related:** [30 Pricing](30-pricing-strategy.md) · [32 Licensing](32-licensing-strategy.md) · [46 Expansion Strategy](../08-customer-success/46-expansion-strategy.md) · [53 Website Copy — pricing page](../10-website/53-website-copy.md)
