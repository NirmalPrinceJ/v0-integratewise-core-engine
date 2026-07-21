# 52 — Website Strategy

Status: CANONICAL · Commercial OS
Owner: Founder + PMM hat
Last verified: 2026-07-21

---

## Purpose

What the website is for, its information architecture, conversion design, and quality bar. The actual production copy lives in [53 Website Copy](53-website-copy.md); landing-page variants in [54](54-landing-pages.md); search strategy in [55](55-seo-strategy.md).

**Target audience:** Founder, designers/builders of the site, PMM.

---

## 1. The Website's Job (in priority order)

1. **Make the category legible in 10 seconds.** A cold visitor must leave the hero knowing: one workspace, humans + AI Twins working together, truth the org owns. Not "another AI tool."
2. **Convert the two visitor types differently:** practitioners (P1) → self-serve signup/POV interest; executives/evaluators (P2–P4) → demo request + evidence consumption (security, pricing, proof).
3. **Serve the sales motion.** Every page is send-able mid-deal: the pricing page survives procurement, the security page survives a CISO, the platform page survives an architect.
4. **Bank the category's vocabulary for search** ([55](55-seo-strategy.md)).

**Design north star:** the site must *feel* like the product's promise — calm, assembled, evidence-forward ([13 §5 visual direction](../01-foundation/13-brand-story.md)). A cluttered site selling calm workbenches is self-refuting.

## 2. Information Architecture

```
Home
├── Product
│   ├── The Workbench        (how work happens — three beats, control grammar)
│   ├── Your Twin            (the collaboration model)
│   ├── The Adaptive Spine   (owned truth, provenance)
│   └── Governance & Trust   (approvals, audit, security)
├── Solutions
│   ├── Customer Success     (wedge — deepest page)
│   ├── Sales                (expansion)
│   └── RevOps               (expansion)
├── Pricing
├── Customers               (case studies as they exist; design-partner proof until then)
├── Company
│   ├── Manifesto           (the category essay)
│   ├── About / Founder
│   └── Press
├── Resources
│   ├── Blog/Essays
│   ├── Security            (the 42 FAQ, public rendering)
│   └── Docs (product)
└── CTAs: [Get started] (self-serve) · [See the morning] (demo)
```

Rules: max depth 2 clicks · every product page ends in both CTAs · Solutions pages carry persona-matched proof ([34](../06-customers/34-buyer-personas.md)) · no page exists without an owner and a job (orphan pages are deleted, not redesigned).

## 3. Conversion Design

**Two CTAs, everywhere, consistently named:**
- **"Get started"** → Starter/Growth self-serve (email → connect first tool → first morning). Practitioner path.
- **"See the morning"** → the demo request (named deliberately after the product's signature moment, not "book a demo" — the CTA teaches the promise).

**Conversion principles:** the hero demo is a 90-second film of the Day narrative (auto-muted, captioned) — show, don't claim · social proof appears as *numbers with context* (QBR 4h→12min, attributed honestly as design-partner results) not logo walls we don't have · pricing is public and honest ([30](../05-value-pricing/30-pricing-strategy.md)) — hiding pricing at our stage reads enterprise-cosplay · every claim on the site must exist in the claims register ([79 Appendix](../14-appendix/79-appendix.md)).

**Trust furniture (site-wide footer/nav):** Security page · pricing transparency · "AI never owns your truth" doctrine link → manifesto · status page link when live.

## 4. Build & Operations

Stack: static/fast (the site *is* a latency claim — sub-second loads or the "calm workspace" story wobbles) · analytics: page → CTA funnel per visitor type; UTM discipline on all founder-content links ([73](../13-operations/73-marketing-metrics.md)) · copy changes go through the terminology checklist ([18 §8](../03-positioning-messaging/18-terminology-guide.md)) — the website is the most public terminology surface we have · quarterly voice audit includes every live page ([20 §4](../04-product-marketing/20-product-marketing-guide.md)).

**Pre-launch staging ([51](../09-gtm/51-launch-strategy.md)):** pre-launch site = Home + Manifesto + CS solution + Pricing + Security + waitlist CTA; full IA ships at launch gate.

**KPIs:** visitor → CTA rate ≥ 4% blended (practitioner ≥ 6% on solutions pages) · demo-request quality: % from ICP ≥ 60% ([33](../06-customers/33-ideal-customer-profile.md)) · sales-cited page usage in deals (ask in win/loss) · load time < 1s p75 · zero terminology violations in quarterly audit.

---

**Related:** [53 Website Copy](53-website-copy.md) · [54 Landing Pages](54-landing-pages.md) · [55 SEO](55-seo-strategy.md) · [12 Messaging](../03-positioning-messaging/12-messaging-framework.md)
