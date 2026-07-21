# INTEGRATEWISE v1.0 — GO-LIVE DEPLOYMENT GUIDE


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Status:** Ready for Production  
**Date:** June 27, 2026  
**Architecture:** Locked (15 layers, 30 Gateway endpoints)  
**Deployment:** Multi-service (Gateway, Core Engine, Database)  
**Frontends:** Web, Mobile, Desktop (all use same Gateway)  

---

## EXECUTIVE SUMMARY

You now have:
- ✅ Complete, locked backend architecture
- ✅ 30-endpoint Gateway contract (frozen, no changes)
- ✅ Core Engine for event processing + AI routing
- ✅ Spine database for continuity
- ✅ Memory system with scopes + decay
- ✅ Connector pool for 100+ data sources
- ✅ Governance & approvals layer
- ✅ Chat interface (L1 Shell)
- ✅ Universal SDK for all frontends

**Next: Deploy and connect all UIs to the Gateway.**

---

## DEPLOYMENT PHASES

### PHASE 1: INFRASTRUCTURE (Day 1-2)

#### 1.1 Deploy Gateway Service

```bash
# Navigate to gateway service
cd services/gateway

# Install dependencies
npm install

# Deploy to CloudFlare Workers
npm run deploy

# Verify deployment
curl https://integratewise-gateway.workers.dev/api/v1/health
# Expected: { status: "ok", database: "connecting..." }
```

**What happens:**
- Hono worker deployed to CloudFlare Workers
- All 30 routes become accessible
- Auto-scales to handle 1M+ requests/day

**Environment variables needed:**
```
NEON_DATABASE_URL=postgresql://...
CORE_ENGINE_URL=https://integratewise-core-engine.workers.dev
AUTH_JWT_SECRET=your-secret-here
RATE_LIMIT_QUOTA=10000
```

#### 1.2 Deploy Core Engine

```bash
cd services/core-engine

npm install
npm run build

# Deploy to CloudFlare Workers
npm run deploy

# Verify deployment
curl https://integratewise-core-engine.workers.dev/health
# Expected: { status: "ok", service: "core-engine", version: "1.0.0" }
```

**What happens:**
- Event ingestion worker deployed
- AI routing engine ready
- Async task generation enabled

**Environment variables:**
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
NEON_DATABASE_URL=postgresql://...
```

#### 1.3 Set Up Neon Database

```bash
# Get Neon connection string
export DATABASE_URL="postgresql://user:password@host/integratewise"

# Connect to database
psql $DATABASE_URL

# Run migrations
npm run migrate

# Verify tables created
SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public';

# Expected tables:
#   - spine_events
#   - ai_tasks
#   - memory
#   - signals
#   - insights
#   - connectors
#   - users
#   - tenants
```

**Database setup:**
```bash
# In services/core-engine
npm run db:seed  # Load sample data

# Verify data
SELECT COUNT(*) FROM spine_events;  # Should show 0
SELECT COUNT(*) FROM connectors;     # Should show ~100 sources
```

#### 1.4 Configure OAuth Connectors

For each provider, create OAuth app:

**Stripe:**
```bash
# Go to https://dashboard.stripe.com/apikeys
# Create Restricted API Key
export STRIPE_API_KEY="sk_test_..."
```

**Slack:**
```bash
# Go to https://api.slack.com/apps
# Create app, get OAuth token
export SLACK_BOT_TOKEN="xoxb-..."
```

**GitHub:**
```bash
# Go to https://github.com/settings/apps
# Create OAuth app
export GITHUB_APP_ID="12345"
export GITHUB_APP_SECRET="ghp_..."
```

**HubSpot:**
```bash
export HUBSPOT_PRIVATE_APP_TOKEN="pat-..."
```

*Repeat for 96+ other sources (setup script available)*

```bash
npm run setup:connectors --auto
```

---

### PHASE 2: FRONTEND WIRING (Day 3-4)

#### 2.1 Update Web App

```bash
cd apps/web

# Update environment
cat > .env.local << EOF
NEXT_PUBLIC_GATEWAY_URL=https://integratewise-gateway.workers.dev
NEXT_PUBLIC_CORE_ENGINE_URL=https://integratewise-core-engine.workers.dev
NEXT_PUBLIC_WEBSOCKET_URL=wss://integratewise-gateway.workers.dev
EOF

# Install dependencies
npm install

# Build
npm run build

# Verify build
npm run type-check

# Deploy to Vercel
npm run deploy
```

**What this does:**
- Chat Shell now talks to Gateway
- All API calls routed through Gateway Client SDK
- Real-time WebSocket updates enabled
- Database queries work through Gateway

#### 2.2 Update Mobile App

```bash
cd apps/mobile

# Update config
cat > config.ts << EOF
export const GATEWAY_URL = 'https://integratewise-gateway.workers.dev'
export const WEBSOCKET_URL = 'wss://integratewise-gateway.workers.dev'
EOF

npm install

# iOS
npm run build:ios
npm run deploy:app-store

# Android
npm run build:android
npm run deploy:play-store
```

#### 2.3 Update Desktop App

```bash
cd apps/desktop

cat > config.ts << EOF
export const GATEWAY_URL = 'https://integratewise-gateway.workers.dev'
EOF

npm run build

# Publish to app stores
npm run publish
```

#### 2.4 Update CLI

```bash
cd apps/cli

npm install

# Publish to npm
npm run publish
```

---

### PHASE 3: LOAD TESTING (Day 5)

#### 3.1 Simulate 1000 Concurrent Users

```bash
# Using k6 load testing
npm install -g k6

# Run test
k6 run load-tests/concurrent-users.js \
  --vus 1000 \
  --duration 30s \
  --ramp-up 10s

# Expected results:
#   - p95 latency < 500ms
#   - error rate < 0.1%
#   - throughput > 1000 req/s
```

#### 3.2 Test Event Ingestion

```bash
# Send 10k events from test Stripe account
npm run test:stripe-webhook --count 10000

# Verify in database
SELECT COUNT(*) FROM spine_events WHERE source = 'stripe';
# Expected: 10000

# Check latency
SELECT 
  COUNT(*) as total_events,
  AVG(EXTRACT(EPOCH FROM (created_at - timestamp))) as avg_latency_ms
FROM spine_events;
```

#### 3.3 Test AI Routing

```bash
# Send 100 events through Core Engine
npm run test:ai-routing --count 100

# Verify tasks generated
SELECT COUNT(*) FROM ai_tasks;
# Expected: ~100 tasks

# Verify models used
SELECT model, COUNT(*) FROM ai_tasks GROUP BY model;
# Expected mix of gpt-4o, claude-3-haiku, gpt-4o-mini
```

#### 3.4 Test Memory System

```bash
# Save 1000 memory items
npm run test:memory:save --count 1000

# Query with decay algorithm
npm run test:memory:query --query "renewal risk"

# Expected: Ranked results, hot items first
```

---

### PHASE 4: GO-LIVE (Day 6)

#### 4.1 Pre-Launch Checklist

```bash
# All services running
curl https://integratewise-gateway.workers.dev/api/v1/health
curl https://integratewise-core-engine.workers.dev/health

# Database connected
psql $DATABASE_URL -c "SELECT 1"

# Connectors configured
curl -H "Authorization: Bearer $TOKEN" \
  https://integratewise-gateway.workers.dev/api/v1/connectors

# WebSocket working
npm run test:websocket

# Load passed
npm run test:load:report
```

#### 4.2 Enable Production Mode

```bash
# Set production flags
export NODE_ENV=production
export LOG_LEVEL=info
export RATE_LIMIT_QUOTA=10000

# Update Neon to production tier
neon project update --plan=pro

# Enable backups
neon backup-schedule create --enabled
```

#### 4.3 Configure Monitoring

```bash
# Set up Datadog / New Relic
export DATADOG_API_KEY="dd_..."

# Start monitoring
npm run monitor:start

# Create dashboards for:
#   - Gateway latency
#   - Event throughput
#   - AI model usage
#   - Memory system
#   - Error rates
```

#### 4.4 Announce Launch

```bash
# Send to users
email: "IntegrateWise v1.0 is now live! ✨"

# Update status page
https://status.integratewise.com/
  "Platform is live and accepting requests"

# Post to social
"Just shipped: Platform Activation v1.0
 - Locked, production-ready backend
 - 30-endpoint Gateway contract
 - 100+ data sources connected
 - Let the frontends speak to the system
 🚀"
```

---

## MONITORING & OBSERVABILITY

### Key Metrics to Track

```
Gateway Service:
  - Request rate (req/s)
  - Response time (p50, p95, p99)
  - Error rate (%)
  - Authentication failures
  - Rate limit hits

Core Engine:
  - Event ingestion rate (events/s)
  - AI model usage (gpt-4o, claude, mini)
  - Task generation success rate
  - Insight extraction quality
  - Model latency

Database (Neon):
  - Connection pool usage
  - Query latency
  - Lock wait time
  - Disk usage
  - Backup status

Memory System:
  - Items indexed
  - Query latency
  - Decay algorithm efficiency
  - Promotion scoring accuracy

Connectors:
  - Sync success rate per source
  - Last sync time per connector
  - Error messages
  - Normalization quality
```

### Alerting Rules

```
- Gateway latency > 1000ms → Alert
- Error rate > 1% → Critical Alert
- Database connection pool > 80% → Alert
- Event ingestion rate < 100 events/s → Alert
- Memory query latency > 500ms → Alert
- Connector sync failure > 3x → Alert
```

---

## SCALING

### Horizontal Scaling

**Gateway Workers:**
- Auto-scales with CloudFlare (unlimited)
- No manual scaling needed
- Edge locations worldwide

**Core Engine:**
- Deploy multiple instances to different regions
- Use API Gateway for routing
- Handle 1M+ events/day per region

**Database:**
- Neon auto-scales read replicas
- Configure point-in-time recovery
- Set up replication to backup region

### Vertical Scaling

**Increase query performance:**
```sql
-- Add indexes
CREATE INDEX idx_spine_source_timestamp 
  ON spine_events(source, timestamp DESC);

CREATE INDEX idx_memory_scope_class 
  ON memory(scope, classification);

-- Analyze performance
ANALYZE;
EXPLAIN SELECT * FROM spine_events WHERE source = 'stripe' LIMIT 10;
```

**Increase memory capacity:**
```bash
# Upgrade Neon plan
neon project update --plan=enterprise

# Add read replicas
neon branch create --from main --name=replica-1
```

---

## ROLLBACK PROCEDURE

If something goes wrong:

```bash
# 1. Stop accepting new connections
npm run gateway:pause

# 2. Identify issue
npm run logs:view --last-1h

# 3. Rollback to previous version
npm run gateway:rollback --version=v1.0-previous

# 4. Verify
curl https://integratewise-gateway.workers.dev/api/v1/health

# 5. Investigate root cause
npm run debug:issue

# 6. Fix and redeploy
npm run gateway:deploy --version=v1.0-fixed
```

---

## SUCCESS CRITERIA

Launch is successful when:

```
Performance:
  ✅ p95 latency < 500ms
  ✅ p99 latency < 1000ms
  ✅ Throughput > 1000 req/s

Reliability:
  ✅ Uptime > 99.9%
  ✅ Error rate < 0.1%
  ✅ No data loss

Usage:
  ✅ 1000+ concurrent users
  ✅ 100k+ daily active users
  ✅ 1M+ events/month flowing
  ✅ 50+ connectors active

Adoption:
  ✅ Web app fully migrated
  ✅ Mobile app connected
  ✅ Desktop app live
  ✅ CLI tools available
```

---

## POST-LAUNCH

### Week 1
- Monitor metrics
- Respond to user feedback
- Patch bugs
- Optimize slow queries

### Week 2
- Add more connectors
- Improve AI models
- Expand capabilities
- Add new projections

### Week 3+
- Scale to 100k+ users
- Add enterprise features
- Build vertical solutions
- Expand integrations

---

## SUPPORT

**During Launch:**
- On-call team: 24/7
- War room: Slack #incidents
- Runbooks: Notion wiki
- Escalation: VP Engineering

**Issues Template:**
```
Issue: [description]
Impact: [# users affected]
Severity: [low/medium/high/critical]
Logs: [link to logs]
Action: [what we did]
```

---

## FINAL CHECKLIST

Before you click "Deploy":

- [ ] All services deployed to production
- [ ] Database migrations complete
- [ ] Connectors configured (50+ sources)
- [ ] Load tests passed
- [ ] Monitoring configured
- [ ] Alert rules set up
- [ ] On-call team ready
- [ ] Runbooks written
- [ ] Team trained
- [ ] Rollback plan documented
- [ ] Users notified
- [ ] Status page updated
- [ ] Marketing ready

---

**You are ready. The platform is locked. Frontends can talk to the system.**

**Deploy with confidence.** 🚀

