# 49 — Marketplace Strategy

Status: CANONICAL · Commercial OS
Owner: Founder
Last verified: 2026-07-21
Constraint honored: IW-Continuity-Bridge is **private alpha** — external MCP/marketplace distribution is release-gated by the distribution doctrine (`docs/doctrine/04-distribution-access-doctrine.md`). Nothing here overrides those gates.

---

## Purpose

The two marketplace surfaces that matter — where we list to be *found*, and where we distribute to be *used* — with honest sequencing against the release gates.

**Target audience:** Founder; future growth hire.

---

## 1. Two Different Marketplace Games

**Game A — App marketplaces (discovery & trust):** listings where our ICP already shops: HubSpot App Marketplace (wedge connector — highest priority), Salesforce AppExchange, Slack App Directory, Zendesk Marketplace. The job: be present where the buyer's stack lives, harvest co-installed credibility ("works with what you own"), capture high-intent search ("AI account management," "customer 360").

**Game B — AI/MCP ecosystem distribution (usage):** packaging bounded IW capabilities for MCP clients and skills registries via IW-Continuity-Bridge. The job: let approved external surfaces *use* governed continuity — the long-term moat-widening play. **Gated:** private alpha until tenant-membership authorization for external clients passes the doctrine's release gate (verified tenant binding, negative tests, product review). We do not ship distribution that could impersonate tenants; the gate list is the launch checklist.

## 2. Sequencing

| Phase | Action | Gate |
| --- | --- | --- |
| **Now** | HubSpot App Marketplace listing prepared (copy, screenshots, security review docs); AppExchange requirements scoped (their security review is months — start paperwork early) | Wedge connector production-hard |
| **At public launch ([51](51-launch-strategy.md))** | HubSpot listing live; Slack directory live (notification/digest surface) | Launch |
| **Post-launch quarter** | AppExchange listed; Zendesk listed | Security reviews passed |
| **Bridge GA (doctrine-gated)** | MCP registry presence; skills packaging for approved clients | All five release-gate items in `04-distribution-access-doctrine.md` verified |

## 3. Listing Standards (Game A)

Every listing is a positioning artifact, not a form-fill:

- **Title pattern:** "IntegrateWise — [their-noun] intelligence for your whole stack" (e.g., HubSpot: "account intelligence"), never "integration" (category discipline [18 §6](../03-positioning-messaging/18-terminology-guide.md)).
- **First screenshot:** the workbench three-beats morning — never a settings page.
- **Description:** the three failures → the workbench answer in ≤ 80 words; canonical lines only; "works with the tools you keep."
- **Reviews flywheel:** every design partner + activated customer asked once for a marketplace review at day-90 review (their realized numbers make the review write itself).
- **Security/compliance sections:** verbatim from [42 Security FAQ](../07-sales/42-security-faq.md) — one source of truth.

## 4. Marketplace Economics & Expectations (honest)

Marketplaces are **credibility and intent-capture** channels at our stage, not volume channels: expected contribution ≈ 5–10% of pipeline by end-2027, with above-average conversion (stack-fit is pre-qualified). Rev-share on marketplace-sourced deals (where applicable) is a cost of presence, not a channel P&L. The real return: co-install proof in sales conversations ("we're in your HubSpot marketplace") and SEO-adjacent surface area ([55](../10-website/55-seo-strategy.md)).

**KPIs:** listings live per phase-plan · marketplace-sourced signups and their activation rate vs. baseline · review count/rating (target ≥ 4.5) · AppExchange security review passed by target quarter · Bridge GA only after 5/5 doctrine gates (tracked as a compliance metric, not a growth metric).

---

**Related:** [48 Partner Strategy](48-partner-strategy.md) · [51 Launch](51-launch-strategy.md) · [55 SEO](../10-website/55-seo-strategy.md) · Doctrine: `../../doctrine/04-distribution-access-doctrine.md`
