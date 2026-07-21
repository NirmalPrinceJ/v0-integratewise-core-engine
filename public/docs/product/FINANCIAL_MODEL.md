# IntegrateWise — Financial Model

Status: TIER_A
Scope: Product/Business documentation
Canonical Owner: Product
Last Verified: 2026-07-12

---

## 1. REVENUE MODEL

### Per-Seat SaaS with Three AI Tiers

IntegrateWise revenue is driven by per-seat subscriptions across three markets and three AI tiers. Revenue grows through three expansion vectors: connector activations, AI tier upgrades, and entity volume growth.

### Pricing Grid

|                          | Starter           | Growth                 | Command                           |
| ------------------------ | ----------------- | ---------------------- | --------------------------------- |
| **India**                | ₹999/mo (~$12/mo) | ₹2,999/mo (~$36/mo)    | ₹7,999/mo (~$96/mo)               |
| **UAE**                  | $49/mo            | $99/mo                 | $199/mo                           |
| **Enterprise**           | $299/mo           | $999/mo                | Custom ($1,500+/mo)               |
| **Entities**             | 50-100            | 500                    | 2,000+                            |
| **Connectors**           | 3                 | 5-10                   | 10+                               |
| **Sync Frequency**       | 4h                | 1h                     | 15min                             |
| **AI Tier**              | No AI             | AI observes + suggests | AI proposes + learns (TruthLayer) |
| **Duplicate Resolution** | Basic             | Advanced               | Advanced + human review           |

**Annual discount:** 20% (2 months free)

### Revenue Drivers

| Driver                | Mechanism                                             | Expected Impact                     |
| --------------------- | ----------------------------------------------------- | ----------------------------------- |
| **Connector upsell**  | Customers connect more tools as value proves out      | +$20-50/mo per additional connector |
| **AI tier upgrade**   | From No AI → Basic Twin → Full Twin + TruthLayer      | 2-3x revenue per upgrade            |
| **Entity volume**     | As businesses grow, they need more entities processed | +$50-200/mo per tier jump           |
| **Sync frequency**    | Faster sync = higher plan tier                        | Embedded in plan pricing            |
| **Custom connectors** | Enterprise customers pay for bespoke integrations     | $500-2,000 one-time + maintenance   |
| **Annual contracts**  | 20% discount drives commitment                        | Improved cash flow, reduced churn   |

### Revenue Projection (18-Month)

| Month | India SMB | UAE FZE | Enterprise | Total MRR | Total ARR  |
| ----- | --------- | ------- | ---------- | --------- | ---------- |
| 1     | $500      | $500    | $1,000     | $2,000    | $24,000    |
| 2     | $1,500    | $1,000  | $2,000     | $4,500    | $54,000    |
| 3     | $3,000    | $2,000  | $3,000     | $8,000    | $96,000    |
| 4     | $5,000    | $3,500  | $5,000     | $13,500   | $162,000   |
| 5     | $7,000    | $5,000  | $7,000     | $19,000   | $228,000   |
| 6     | $10,000   | $7,000  | $10,000    | $27,000   | $324,000   |
| 9     | $18,000   | $12,000 | $20,000    | $50,000   | $600,000   |
| 12    | $30,000   | $20,000 | $35,000    | $85,000   | $1,020,000 |
| 15    | $45,000   | $30,000 | $55,000    | $130,000  | $1,560,000 |
| 18    | $65,000   | $45,000 | $85,000    | $195,000  | $2,340,000 |

**Assumptions:**

- India SMB: 30 accounts/month growth, 80% Starter → 15% Growth → 5% Command mix
- UAE FZE: 15 accounts/month growth, 60% Starter → 30% Growth → 10% Command mix
- Enterprise: 8 accounts/month growth, 40% Starter → 40% Growth → 20% Command mix
- Net revenue retention: 115% (expansion from connector upsell + AI tier upgrades)
- Monthly churn: 3% (declining to 2% by month 12 as product matures)
- Annual contract adoption: 40% by month 6, 60% by month 12

---

## 2. COST STRUCTURE

### 2.1 Engineering Costs

| Role                    | Count | Monthly Cost (Loaded) | Annual       |
| ----------------------- | ----- | --------------------- | ------------ |
| Founder/CTO             | 1     | $8,000                | $96,000      |
| Senior Backend Engineer | 2     | $12,000 each          | $288,000     |
| Frontend Engineer       | 1     | $10,000               | $120,000     |
| AI/ML Engineer          | 1     | $12,000               | $144,000     |
| DevOps/Security         | 1     | $10,000               | $120,000     |
| **Total Engineering**   | **6** | **$64,000**           | **$768,000** |

_Note: Founder salary below market rate during seed phase. Loaded costs include benefits, taxes, equipment._

### 2.2 Infrastructure Costs (Per-Seat)

Cloudflare's pay-per-use model means infrastructure costs scale linearly with usage:

| Component                         | Cost Per Seat/Month | Notes                                |
| --------------------------------- | ------------------- | ------------------------------------ |
| Cloudflare Workers (compute)      | $0.15-0.30          | Based on request volume and CPU time |
| D1 (edge SQL)                     | $0.10-0.25          | Row reads + writes per entity        |
| KV (hot cache)                    | $0.05-0.10          | TTL 60-300s, reduces D1 reads        |
| R2 (object storage)               | $0.02-0.05          | Documents, attachments               |
| Vectorize (embeddings)            | $0.05-0.10          | Semantic search indexing             |
| Queues (async processing)         | $0.03-0.08          | Pipeline, knowledge sync             |
| **Total infrastructure per seat** | **$0.40-0.88**      |                                      |

_At scale (1,000+ seats), infrastructure costs decrease to $0.25-0.50/seat due to volume discounts and caching efficiency._

### 2.3 AI Inference Breakdown

| Component                         | Cost Per Seat/Month | Notes                             |
| --------------------------------- | ------------------- | --------------------------------- |
| Twin Trigger Engine (10 triggers) | $0.30-0.60          | Evaluated per entity per day      |
| TruthLayer Triage Bot             | $0.15-0.30          | Processes proposed memory entries |
| Entity 360 Assembly               | $0.10-0.20          | 6-layer parallel assembly         |
| Confidence Scoring                | $0.05-0.10          | Applied to all AI outputs         |
| **Total AI inference per seat**   | **$0.60-1.20**      |                                   |

_AI inference costs are tiered: Starter (No AI) = $0, Growth (Basic Twin) = $0.60-0.80, Command (Full Twin) = $1.00-1.20._

**AI cost control mechanisms:**

- TruthLayer caching — verified knowledge reduces repeated inference
- Trigger rate limiting — max 3 insights per entity per day
- Model tiering — lighter models for triage, heavier models for reasoning
- Batch processing — off-peak inference for non-urgent triggers

### 2.4 Gross Margin

| Tier                 | Revenue/Seat/Month | COGS/Seat/Month | Gross Margin |
| -------------------- | ------------------ | --------------- | ------------ |
| Starter (India)      | $12                | $0.55           | 95.4%        |
| Starter (UAE)        | $49                | $0.55           | 98.9%        |
| Starter (Enterprise) | $299               | $0.55           | 99.8%        |
| Growth (India)       | $36                | $1.40           | 96.1%        |
| Growth (UAE)         | $99                | $1.40           | 98.6%        |
| Growth (Enterprise)  | $999               | $1.40           | 99.9%        |
| Command (India)      | $96                | $2.10           | 97.8%        |
| Command (UAE)        | $199               | $2.10           | 98.9%        |
| Command (Enterprise) | $1,500+            | $2.10           | 99.9%        |

**Blended gross margin: 97-99%** (typical for SaaS with pay-per-use infrastructure)

_COGS includes: Cloudflare infrastructure, AI inference, Nango connector costs, monitoring, SSL._

### 2.5 Operating Expenses (Monthly)

| Category                         | Month 1-6   | Month 7-12   | Month 13-18  |
| -------------------------------- | ----------- | ------------ | ------------ |
| Engineering                      | $64,000     | $80,000      | $100,000     |
| Sales & Marketing                | $5,000      | $20,000      | $40,000      |
| G&A (Legal, Accounting, Tools)   | $5,000      | $8,000       | $12,000      |
| Infrastructure (beyond per-seat) | $2,000      | $5,000       | $10,000      |
| Office / Remote                  | $1,000      | $2,000       | $3,000       |
| **Total OpEx**                   | **$77,000** | **$115,000** | **$165,000** |

### 2.6 Customer Acquisition Cost (CAC)

| Channel                      | CAC          | Payback Period | Notes                          |
| ---------------------------- | ------------ | -------------- | ------------------------------ |
| Founder-led demos            | $200-500     | 1-3 months     | M1-6 primary channel           |
| Content marketing            | $300-800     | 2-4 months     | M4+ secondary channel          |
| CA networks (India)          | $100-300     | 1-2 months     | Referral-driven, low CAC       |
| Free zone partnerships (UAE) | $200-500     | 2-3 months     | Partnership-driven             |
| Enterprise (direct)          | $1,000-3,000 | 3-6 months     | Longer sales cycle, higher ACV |
| **Blended CAC**              | **$400-800** | **2-4 months** |                                |

### 2.7 Lifetime Value (LTV)

| Tier        | ARPU/Month | Avg. Lifetime | LTV        | LTV/CAC      |
| ----------- | ---------- | ------------- | ---------- | ------------ |
| Starter     | $50        | 18 months     | $900       | 1.1-2.3x     |
| Growth      | $120       | 24 months     | $2,880     | 3.6-7.2x     |
| Command     | $300       | 30 months     | $9,000     | 11.3-22.5x   |
| **Blended** | **$130**   | **22 months** | **$2,860** | **3.6-7.2x** |

_Assumptions: Starter has higher churn (5%/mo → 18mo avg), Growth moderate (3%/mo → 24mo avg), Command lowest (2%/mo → 30mo avg). LTV/CAC > 3x is the SaaS benchmark for healthy unit economics._

---

## 3. PATH TO PROFITABILITY

### 3.1 Cash Flow Model

| Month | Revenue  | COGS   | Gross Profit | OpEx     | Net Cash Flow | Cumulative    |
| ----- | -------- | ------ | ------------ | -------- | ------------- | ------------- |
| 1     | $2,000   | $100   | $1,900       | $77,000  | -$75,100      | -$75,100      |
| 2     | $4,500   | $200   | $4,300       | $77,000  | -$72,700      | -$147,800     |
| 3     | $8,000   | $350   | $7,650       | $77,000  | -$69,350      | -$217,150     |
| 4     | $13,500  | $550   | $12,950      | $77,000  | -$64,050      | -$281,200     |
| 5     | $19,000  | $750   | $18,250      | $77,000  | -$58,750      | -$339,950     |
| 6     | $27,000  | $1,000 | $26,000      | $77,000  | -$51,000      | -$390,950     |
| 9     | $50,000  | $1,800 | $48,200      | $115,000 | -$66,800      | -$591,350     |
| 12    | $85,000  | $3,000 | $82,000      | $115,000 | -$33,000      | -$723,350     |
| 15    | $130,000 | $4,500 | $125,500     | $165,000 | -$39,500      | -$841,850     |
| 18    | $195,000 | $6,500 | $188,500     | $165,000 | **$23,500**   | **-$818,350** |

### 3.2 When Profitable

**Monthly break-even: Month 18** (at $195K MRR / $2.34M ARR run rate)

**Cumulative break-even: Month 30-34** (depending on growth trajectory and cost management)

**Key milestones:**

- **Month 4:** $13.5K MRR — proof of multi-market revenue model
- **Month 6:** $27K MRR — Series A readiness conversation begins
- **Month 12:** $85K MRR / $1.02M ARR — Series A closed
- **Month 18:** $195K MRR / $2.34M ARR — Monthly cash flow positive
- **Month 30:** Cumulative break-even (if Series A capital deployed efficiently)

### 3.3 Year 3 Targets

| Metric                | Target       | Basis                                                  |
| --------------------- | ------------ | ------------------------------------------------------ |
| ARR                   | $6-8M        | 18-month trajectory extrapolated with Series A scaling |
| MRR                   | $500-670K    | Consistent monthly growth                              |
| Customers             | 3,000-5,000  | Across all three markets                               |
| Gross Margin          | 97-99%       | Pay-per-use infrastructure scales efficiently          |
| Net Revenue Retention | 125%+        | Expansion from connector upsell + AI tier upgrades     |
| LTV/CAC               | 5x+          | Proven unit economics at scale                         |
| Monthly Burn          | Profitable   | Cash flow positive by month 18-20                      |
| Team                  | 25-35 people | Engineering (12-15), Sales (5-8), CS (3-5), G&A (5-7)  |

---

## 4. ECONOMICS ENGINE — WHY MARGINS IMPROVE

### The Compounding Economics

IntegrateWise's margins improve over time due to five structural factors:

**1. Pay-per-use infrastructure (Cloudflare)**

- No fixed infrastructure cost. Costs scale linearly with usage.
- At 1,000+ seats, volume discounts reduce per-seat infrastructure cost by 30-40%
- No servers to provision, no databases to manage, no DevOps overhead

**2. TruthLayer caching reduces AI inference cost**

- Verified knowledge is cached and reused across sessions
- As the knowledge base grows, less inference is needed for routine queries
- At scale, 60-70% of AI requests hit cached knowledge (reducing inference cost by 50%+)

**3. Expansion revenue at near-zero marginal cost**

- Connector upsell: customer connects more tools → same infrastructure, more value
- AI tier upgrade: customer upgrades from No AI to Growth/Command → higher revenue, incremental inference cost only
- Entity volume: customer processes more entities → linear infrastructure cost, exponential value

**4. Network effects in connector ecosystem**

- More customers → more connector usage → better connector reliability → lower support cost
- Community connectors reduce engineering maintenance burden
- Nango partnership handles OAuth lifecycle (reducing engineering cost)

**5. Product-led growth reduces CAC over time**

- Starter tier is self-serve → no sales cost
- Free tier (future) → organic acquisition
- Customer referrals → lowest CAC channel
- Content marketing → compound return over time

### Margin Trajectory

| Phase       | Gross Margin | Net Margin           | Notes                                |
| ----------- | ------------ | -------------------- | ------------------------------------ |
| Month 1-6   | 95-97%       | -3,000% (heavy OpEx) | Building foundation                  |
| Month 7-12  | 97-98%       | -135%                | Revenue scaling, OpEx growing slower |
| Month 13-18 | 98-99%       | -30% to +15%         | Approaching break-even               |
| Month 19-24 | 99%+         | 15-25%               | Profitable, scaling efficiently      |
| Year 3      | 99%+         | 25-35%               | Mature SaaS economics                |

---

## 5. SEED MONEY ALLOCATION

### Recommended Seed: $750K - $1.2M

| Category           | Allocation      | 12-Month Spend           | Purpose                                         |
| ------------------ | --------------- | ------------------------ | ----------------------------------------------- |
| **Engineering**    | 45% ($340-540K) | $768K (6 people)         | Core platform, TruthLayer, connectors, security |
| **Go-to-Market**   | 25% ($190-300K) | $150K (content + events) | Founder-led sales, content, design partners     |
| **Infrastructure** | 15% ($110-180K) | $84K (Cloudflare + AI)   | Pay-per-use costs, monitoring, compliance       |
| **Operations**     | 10% ($75-120K)  | $96K (legal + G&A)       | Legal, accounting, SOC 2, tools                 |
| **Reserve**        | 5% ($38-60K)    | Contingency              | Unexpected costs, opportunities                 |

### What Seed Buys

- **12 months of runway** to reach $85K MRR / $1M ARR
- **Series A readiness** with proven unit economics
- **SOC 2 Type II certification** (critical for enterprise sales)
- **100+ connectors** (from 70 current)
- **3 published case studies** with quantified outcomes
- **First AE + first CS hire** (month 7-9)

### Runway Analysis

| Scenario     | Seed Amount | Monthly Burn | Runway    | MRR at End |
| ------------ | ----------- | ------------ | --------- | ---------- |
| Conservative | $750K       | $77K         | 9 months  | $50K       |
| Base         | $1M         | $77K         | 13 months | $85K       |
| Aggressive   | $1.2M       | $90K         | 13 months | $100K      |

_Base case reaches Series A readiness ($85K MRR) within seed runway. Aggressive case accelerates hiring and market expansion._

---

## 6. RISK FACTORS

| Risk                             | Probability | Impact   | Mitigation                                               | Financial Impact            |
| -------------------------------- | ----------- | -------- | -------------------------------------------------------- | --------------------------- |
| **Slow enterprise sales cycle**  | High        | Medium   | Multi-market approach (India/UAE provide faster revenue) | -$20K MRR at month 12       |
| **Higher than expected churn**   | Medium      | High     | Product-led growth, design partner feedback loops        | -5% NRR impact              |
| **AI inference cost increase**   | Low         | Medium   | TruthLayer caching, model tiering, batch processing      | +$0.20/seat/month           |
| **Cloudflare price increase**    | Low         | Low      | Pay-per-use model limits exposure; migration path exists | +10-15% infrastructure cost |
| **Competitor enters market**     | Medium      | Medium   | Speed advantage (12+ month lead on TruthLayer)           | -$30K MRR at month 18       |
| **Security breach**              | Low         | Critical | SOC 2, RLS, audit trail, penetration testing             | Existential risk            |
| **Regulatory change (AI)**       | Low         | Medium   | HITL architecture is regulation-friendly                 | Potential advantage         |
| **Connector maintenance burden** | Medium      | Low      | Nango partnership, community connectors                  | +$5K/month engineering      |

### Sensitivity Analysis

| Scenario                       | MRR at Month 12 | MRR at Month 18 | Break-Even |
| ------------------------------ | --------------- | --------------- | ---------- |
| **Base case**                  | $85K            | $195K           | Month 18   |
| **Conservative (-30% growth)** | $60K            | $135K           | Month 24   |
| **Aggressive (+30% growth)**   | $110K           | $255K           | Month 15   |
| **High churn (5% monthly)**    | $55K            | $120K           | Month 26   |
| **Low churn (2% monthly)**     | $95K            | $220K           | Month 16   |

---

## 7. COMPARABLES

### SaaS Benchmarks

| Metric                | IntegrateWise Target | Industry Benchmark | Notes                                              |
| --------------------- | -------------------- | ------------------ | -------------------------------------------------- |
| Gross Margin          | 97-99%               | 70-85%             | Pay-per-use infrastructure is rare advantage       |
| Net Revenue Retention | 115-125%             | 100-120%           | Expansion from connector upsell + AI tier upgrades |
| Monthly Churn         | 2-3%                 | 3-5%               | TruthLayer switching costs reduce churn            |
| LTV/CAC               | 3.6-7.2x             | 3-5x               | Multi-market approach reduces blended CAC          |
| CAC Payback           | 2-4 months           | 6-12 months        | Product-led growth + founder-led sales             |
| Magic Number          | 1.5-2.0              | 0.75-1.0           | Low CAC + high expansion revenue                   |

### Comparable Companies at Similar Stage

| Company          | Stage | ARR | Multiple | Key Similarity                        |
| ---------------- | ----- | --- | -------- | ------------------------------------- |
| Gainsight (2013) | Seed  | $2M | 10x      | CS platform, per-seat SaaS            |
| Segment (2014)   | Seed  | $1M | 15x      | Data unification, connector ecosystem |
| Retool (2018)    | Seed  | $1M | 10x      | Internal tools, developer-focused     |
| Notion (2016)    | Seed  | $3M | 10x      | Knowledge workspace, productivity     |
| Linear (2019)    | Seed  | $1M | 10x      | Dev tooling, product-led growth       |

**IntegrateWise positioning:** Higher gross margins than all comparables (97-99% vs 70-85%), broader TAM (operational intelligence vs single category), and unique defensibility (TruthLayer moat).

---

## 8. THE FINANCIAL STORY IN ONE PARAGRAPH

IntegrateWise is a per-seat SaaS business with three pricing tiers (Starter/Growth/Command) across three markets (India/UAE/Enterprise). Revenue is driven by connector activations, AI tier upgrades, and entity volume expansion. Gross margins are 97-99% because the core infrastructure runs on Cloudflare's pay-per-use model (no fixed infrastructure cost) and AI inference costs are controlled through tiered access, TruthLayer caching, and trigger rate limiting. The business has a natural land-and-expand motion: customers start with 3 connectors and no AI (Starter at $12-299/mo), prove value, then upgrade to more connectors, faster sync, and governed AI intelligence (Growth at $36-999/mo, Command at $96-1,500+/mo). The multi-market approach provides revenue diversification: India SMB at ₹999/mo provides volume (63M+ addressable), UAE FZE at $49/mo provides margin (200K+ addressable), and Enterprise at $299-$999/mo provides ACV (50K+ addressable). Unit economics target: blended CAC of $400-800 with 2-4 month payback, LTV/CAC of 3.6-7.2x, and net revenue retention of 115-125%. The TruthLayer moat — approval-gated AI memory with no competitor equivalent — creates switching costs that compound with usage: the more verified knowledge an organization accumulates, the more valuable IntegrateWise becomes, and the harder it is to leave. Year 3 targets: $6-8M ARR, 3,000-5,000 customers, 25-35 person team, monthly cash flow positive with 25-35% net margins.

---

_IntegrateWise — Financial Model · Tier A · Canonical_
