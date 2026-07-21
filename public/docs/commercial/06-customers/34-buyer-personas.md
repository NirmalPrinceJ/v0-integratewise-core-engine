# 34 — Buyer Personas

Status: CANONICAL · Commercial OS
Owner: Product Marketing + Sales
Last verified: 2026-07-21

---

## Purpose

The five people in every deal — what each one wants, fears, measures, and needs to hear. Personas are archetypes with buying power, not marketing cartoons; each maps to messaging ([12 §4](../03-positioning-messaging/12-messaging-framework.md)) and discovery tracks ([38](../07-sales/38-discovery-guide.md)).

**Target audience:** Sales, marketing, CS, product.

---

## Persona 1 — The Account Owner (daily user, adoption kingmaker)

**Who:** CSM / Account Manager / Senior CSM. Carries 20–60 named accounts. Reports to Persona 2.
**Their day:** the eight-tab morning; QBR prep evenings; Slack pings mid-call; the spreadsheet only they understand.
**Wants:** to walk into every call already knowing; to stop doing data janitorial work; credit for saves, not blame for surprises.
**Fears:** looking uninformed in front of a customer; another tool that adds work; AI drafting something wrong _to a customer_.
**Measures (is measured by):** NRR/GRR on book, health coverage, QBR quality, response times.
**Message that lands:** "Your morning, pre-assembled: what changed, what needs you, what's prepared — with sources." Never lead with "AI" — lead with the morning.
**Objection to expect:** "Is this going to watch/replace me?" → the Twin is _theirs_, scoped to them, amplifying them; approvals mean nothing happens without them.
**Win them with:** the first Day-1 morning ([45 Onboarding](../08-customer-success/45-onboarding-playbook.md)); one real catch on their own account.

## Persona 2 — The CS Leader (economic buyer, wedge champion)

**Who:** VP Customer Success / CCO / Head of CS. Owns NRR with flat headcount. Our primary buyer.
**Wants:** churn caught before it's a fire; team capacity back; an AI story to give their CEO that isn't embarrassing; QBRs that don't consume the team.
**Fears:** another surprise churn in the board deck; a tool the team abandons by week 3; being the exec who bought "more AI hype."
**Measures:** NRR, GRR, expansion pipeline sourced by CS, time-to-value on accounts, team utilization.
**Message:** "Stop losing accounts to churn you didn't see coming — signals with evidence before the score moves, and your team's 3 hours a day back."
**Proof they need:** the ROI model in their numbers ([29](../05-value-pricing/29-roi-framework.md)); a catch during POV; adoption metrics (89% DAU design-partner anchor).
**Their boss's question they must answer:** "What did we get for it?" → arm them with the realized-value review ([28 §4](../05-value-pricing/28-customer-outcomes.md)).

## Persona 3 — The RevOps Architect (technical-operational evaluator, expansion champion)

**Who:** Head of RevOps / Business Systems / CS Ops. Owns the stack the wedge connects to.
**Wants:** fewer integration tickets; one governed truth without a migration; to retire "version 3 of the dashboard"; provenance on every number leadership quotes.
**Fears:** another system writing garbage into the CRM; sync storms; being blamed for a vendor's data mess.
**Measures:** data quality, reporting latency, integration backlog, tool spend per seat.
**Message:** "Your tools stay. Your data stays. IntegrateWise connects the truth — every field with source attribution, every write governed."
**Proof they need:** provenance panel; write-path governance (no connector writes directly to the Spine; nothing writes back without approval); connector setup in minutes, live.
**Strategic role:** wedge-deal validator → **expansion champion** for Sales/Ops workbenches ([46](../08-customer-success/46-expansion-strategy.md)). Invest beyond the deal.

## Persona 4 — The Security Steward (gatekeeper, veto-holder)

**Who:** CISO / IT Director / Security Engineer (fractional at mid-market — often Persona 3 wearing the hat).
**Wants:** to say yes safely; artifacts that answer their checklist without ten calls; no AI writing to systems ungoverned; clean vendor posture.
**Fears:** shadow-AI data exfiltration; an agent acting on production systems; auditors asking "who approved that?" with no answer.
**Measures:** review cycle time, vendor risk score, incident count (zero).
**Message:** "Mandatory human approval on memory and action, per-field provenance, tenant isolation at the database, immutable audit, fail-closed boundaries — by architecture, not configuration."
**Artifacts they get:** [42 Security FAQ](../07-sales/42-security-faq.md) proactively, _before they ask_ — arriving prepared is the trust move. Honest SOC 2 status with dates.
**Never:** oversell compliance we don't hold. One caught overclaim ends the deal and the reference.

## Persona 5 — The Executive Sponsor (mid-market: COO/CEO; the why-now authority)

**Who:** COO or CEO at 50–500; sometimes CRO. Shows up when the deal crosses departments or $50K.
**Wants:** the AI mandate to produce something real; decision visibility without chasing status; org memory that survives turnover.
**Fears:** funding another AI experiment that becomes email-drafting; operational blind spots surfacing in board meetings.
**Message:** "Your context lives in tools and leaves with people. Make it organizational: one workspace, every person with a governed Twin, truth you own. This is the AI investment that shows up in operations, not just in demos."
**Proof:** the continuity math; the $8M founder story (peer-to-peer, founder tells it); exec-view workbench.
**Deal role:** converts department purchase into company standard — the Enterprise-tier conversation lives here.

---

## Deal Choreography (who, when)

| Stage ([36](../07-sales/36-sales-methodology.md)) | Required personas                             |
| ------------------------------------------------- | --------------------------------------------- |
| Discover                                          | P2 (or P1 self-serve → P2 intro)              |
| Align                                             | P2 + P1 (2–3 users in the room)               |
| Prove (POV)                                       | P1 daily use · P3 validation · P2 sponsorship |
| Commit                                            | P2 economic + P4 security + (>$50K) P5        |
| Expand                                            | P3 champion + P5 sponsor                      |

**Single-threading alarm:** any deal past Align with only one persona engaged is at-risk by definition — flag in pipeline review ([74](../13-operations/74-sales-metrics.md)).

**KPIs:** personas-engaged per won deal (target ≥ 3); persona-specific content usage; P1 adoption at day 30 predicting P2 renewal (track the correlation).

---

**Related:** [33 ICP](33-ideal-customer-profile.md) · [35 Customer Journey](35-customer-journey.md) · [38 Discovery Guide](../07-sales/38-discovery-guide.md) · [12 Messaging §4](../03-positioning-messaging/12-messaging-framework.md)
