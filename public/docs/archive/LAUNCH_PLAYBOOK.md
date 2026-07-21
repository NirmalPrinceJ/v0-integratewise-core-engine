# Launch Playbook: Two-Layer Connection Model


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## The Complete Go-To-Market Motion

**Headline**: "One marketplace connection, one auth. Your AI tools automatically access all your business systems."

**Timeline**: 2 weeks to launch (complete build + deployment)

---

## What You're Building

### Layer 1: Identity (User ↔ IntegrateWise)
- User clicks marketplace app (Claude, ChatGPT, Perplexity, Replit, Lovable)
- OAuth flow → IntegrateWise creates tenant + user
- JWT token issued (24-hour expiration)
- MPC client now authenticated

### Layer 2: Connectivity (IntegrateWise ↔ Business Systems)
- Admin connects HubSpot, Salesforce, Stripe, etc. to IntegrateWise
- IntegrateWise stores OAuth tokens for each system
- Spine now hydrated with data from all systems
- All AI clients automatically access all systems

### Result
- 1 AI client × 10 systems = 10 integrations
- 5 AI clients × 10 systems = still 10 integrations (shared Spine)
- 5 AI clients × 28 systems = still 28 integrations (shared Spine)

---

## Week 1: Foundation

### Day 1-2: OAuth Endpoint (CONTINUITY_BRIDGE_SIMPLE.md)

**What to build**:
- GET /auth/authorize endpoint (accepts email, org_name, app, redirect_uri)
- JWT generation (tenant_id, user_id, exp=24h)
- Redirect back to marketplace app with token

**Code**: Copy from CONTINUITY_BRIDGE_SIMPLE.md
- oauth-handler.ts
- jwt-validator.ts
- feature-gate.ts

**Verification**:
```bash
# Test OAuth flow
curl https://integratewise.com/auth/authorize \
  -G \
  --data-urlencode "app=claude" \
  --data-urlencode "redirect_uri=claude-extension://callback" \
  --data-urlencode "email=test@company.com" \
  --data-urlencode "org_name=Test%20Company"

# Expected: HTTP 302 redirect with token in query params
```

**Deployment**: Deploy to production (Cloudflare Workers)

---

### Day 3: Feature Gate (FEATURE_ACTIVATION_SIMPLE.md)

**What to build**:
- Frontend useAuth hook (checks localStorage for JWT)
- ConnectButton component (redirects to OAuth)
- OAuth callback handler (stores token, redirects to app)
- Middleware: Automatic tenant scoping on all queries

**Code**: Copy from FEATURE_ACTIVATION_SIMPLE.md
- useAuth.ts (React hook)
- ConnectButton.tsx
- callback/page.tsx
- tenant-scoping middleware

**Verification**:
```bash
# Test without token
curl https://gateway.integratewise.com/api/v1/spine/accounts
# Expected: 401 Unauthorized

# Test with token
curl https://gateway.integratewise.com/api/v1/spine/accounts \
  -H "Authorization: Bearer eyJhbGc..."
# Expected: 200 OK (with tenant filter applied)
```

**Deployment**: Deploy to all 5 frontends
- Claude Desktop extension
- ChatGPT action
- Perplexity integration
- Replit integration
- Lovable integration

---

### Day 4-5: Frontend Integration

**Update all 5 frontends**:
- Add useAuth hook to pages
- Show ConnectButton if not authenticated
- Show features if authenticated
- Handle OAuth callback

**Test**:
1. Open Claude Desktop
2. Click "Connect IntegrateWise"
3. Enter email + org
4. Authorize
5. Redirected back
6. Token stored
7. Features visible

---

### Day 6-7: System Connectivity

**What admin does**:
- Goes to IntegrateWise dashboard
- Clicks "Connect HubSpot"
- Authorizes with HubSpot OAuth
- Backend stores HubSpot token in KV
- Creates Connectivity record: tenant_id → hubspot_token
- Repeats for Salesforce, Stripe, etc.

**What engineers build**:
- Dashboard UI (CloudFlare Pages + React)
- Connector handlers (accept OAuth code, store token)
- Connectivity table (tenant_id, system, token)
- Hydration logic (query all connected systems)

---

## Week 2: Testing + Launch

### Day 8-9: Integration Testing

**Test scenarios**:
1. Claude → IntegrateWise → Salesforce (full chain)
   - Claude user queries opportunities
   - Gateway validates JWT
   - Spine fetches from Salesforce
   - Returns data to Claude

2. ChatGPT → IntegrateWise → HubSpot (full chain)
   - ChatGPT user queries contacts
   - Gateway validates JWT
   - Spine fetches from HubSpot
   - Returns data to ChatGPT

3. Multiple AI clients (same tenant)
   - Claude and ChatGPT both query Salesforce
   - Both see same data
   - Verify tenant scoping

4. Multiple systems
   - Query Salesforce + HubSpot + Stripe in one request
   - Verify merging logic
   - Verify normalization

5. Failure scenarios
   - Salesforce down → Still get HubSpot + Stripe data
   - Token expired → Automatic refresh
   - Invalid tenant → 403 Forbidden

---

### Day 10-11: Performance Testing

**Load test**:
- 100 concurrent users
- 10 requests per second
- Measure latency: Query → Response

**Targets**:
- OAuth: < 1 second
- Query: < 500ms
- Token validation: < 10ms

**Monitor**:
- Error rate: < 0.1%
- Success rate: > 99.9%
- P95 latency: < 1 second

---

### Day 12-13: Production Deployment

**Deployment checklist**:
- [ ] OAuth endpoint deployed (Cloudflare)
- [ ] JWT validator middleware in Gateway
- [ ] Feature gate middleware in Gateway
- [ ] All 5 marketplace apps updated
- [ ] Connectivity handlers deployed
- [ ] Spine hydration updated
- [ ] Monitoring dashboards live
- [ ] Support playbooks ready

**Verification**:
- [ ] Claude marketplace app works
- [ ] ChatGPT app works
- [ ] Perplexity app works
- [ ] Replit app works
- [ ] Lovable app works
- [ ] OAuth success rate > 99%
- [ ] Feature visibility correct
- [ ] Tenant scoping verified

---

### Day 14: Launch

**Pre-launch (morning)**:
- [ ] Final smoke tests
- [ ] Monitor error rates
- [ ] Team on standby

**Launch (noon)**:
- [ ] Publish Claude marketplace app
- [ ] Announce on Product Hunt
- [ ] Email beta list
- [ ] Social media posts

**Post-launch (afternoon)**:
- [ ] Monitor OAuth success rate
- [ ] Monitor first connections
- [ ] Track feature usage
- [ ] Check support tickets

---

## Success Metrics

### Launch Day
- OAuth success rate: > 99%
- Time to features: < 2 minutes
- First 50 users connected

### Launch Week
- 100+ connections
- 50+ active users
- All 5 platforms working
- 0 support tickets about "can't see features"

### Week 2
- 500+ connections
- 250+ active users
- Multi-system queries working
- Revenue tracked

### Month 1
- 5,000+ connections
- 2,000+ active users
- All 28 connectors available
- $50k+ revenue

---

## Marketing Timeline

### Week 1 (Build)
- [ ] Product Hunt landing page
- [ ] Social media assets
- [ ] Email templates
- [ ] Launch announcement

### Week 2 (Pre-launch)
- [ ] Product Hunt scheduling
- [ ] Email list segmentation
- [ ] Social media queue
- [ ] Press outreach

### Week 2-3 (Launch)
- [ ] Product Hunt launch (Tuesday 10 AM)
- [ ] Email to beta list
- [ ] Social media blitz
- [ ] Influencer outreach
- [ ] Press coverage

### Week 3-4 (Growth)
- [ ] Case studies
- [ ] User interviews
- [ ] Feature announcements (Phase 2)
- [ ] Enterprise outreach

---

## Sales Timeline

### Week 1-2
- [ ] Sales team training (product + GTM motion)
- [ ] Sales deck ready
- [ ] Demo script ready
- [ ] Objection handling playbook

### Week 3-4
- [ ] Pilot customers (5-10)
- [ ] Feedback collection
- [ ] Case study development
- [ ] Enterprise sales outreach

---

## Developer Responsibilities

### Backend
- OAuth endpoint (Day 1-2)
- JWT validation (Day 3)
- Feature gate (Day 3)
- Connector handlers (Day 6-7)
- Hydration logic (Day 6-7)

### Frontend
- useAuth hook (Day 4)
- ConnectButton (Day 4)
- OAuth callback (Day 4-5)
- Feature visibility (Day 5)
- Dashboard (Day 6-7)

### DevOps
- Deploy OAuth to Cloudflare (Day 2)
- Deploy middleware to Gateway (Day 3)
- Deploy frontend updates (Day 5)
- Monitoring setup (Day 7)
- Load testing (Day 10-11)

### QA
- Integration tests (Day 8-9)
- Performance tests (Day 10-11)
- Smoke tests (Day 14)

---

## Rollback Plan

If critical issues found:

1. **Stop new signups** (disable Claude marketplace app)
2. **Notify users** (pending features delayed)
3. **Revert code** (rollback to previous version)
4. **Debug** (identify root cause)
5. **Fix** (implement solution)
6. **Re-test** (full test suite)
7. **Redeploy** (to production)
8. **Resume signups** (re-enable marketplace app)

**Target**: 30 minutes from detection to recovery

---

## Communication Plan

### To Team
- Daily standup (Slack #integratewise-launch)
- Weekly sync (Tuesday 9 AM)
- Escalation: Slack @here if critical issue

### To Beta Users
- Email: "Launching this week, early access"
- Feature preview: "Here's what you'll get"
- Post-launch: "We're live!"

### To Public
- Product Hunt: "One marketplace connection, infinite business systems"
- Twitter: Show demo video
- LinkedIn: Long-form post
- Blog: Technical deep-dive

---

## Success Looks Like

- [ ] OAuth success rate > 99% (no bugs)
- [ ] Feature visibility correct (users see features)
- [ ] All 5 platforms working (Claude, ChatGPT, Perplexity, Replit, Lovable)
- [ ] First 100 users connected smoothly
- [ ] Zero "why can't I see features" support tickets
- [ ] Positive feedback from beta users
- [ ] Product Hunt top 10
- [ ] $10k+ ARR in first month

---

## Phase 2 (After Launch)

- Week 3: Add memory + cross-domain metrics
- Week 4: Activate Agent Lee
- Week 5: Monetization (usage-based billing)
- Week 6: Enterprise tier
- Week 7-8: Scale to 10,000+ users

---

## Quick Reference

**File structure**:
- OAuth code: CONTINUITY_BRIDGE_SIMPLE.md
- Feature gate: FEATURE_ACTIVATION_SIMPLE.md
- Visual diagrams: TWO_LAYER_VISUAL_DIAGRAMS.md
- Complete model: TWO_LAYER_CONNECTION_MODEL.md

**Key URLs**:
- OAuth endpoint: https://integratewise.com/auth/authorize
- Gateway: https://gateway.integratewise.com
- Dashboard: https://integratewise.com/dashboard
- Claude app: Claude Marketplace (search "IntegrateWise")

**Key contacts**:
- Engineering lead: [name]
- Product lead: [name]
- Marketing lead: [name]
- Executive sponsor: [name]

---

## You're Ready

Everything is documented. All code is provided. Timeline is clear.

**Start Day 1. Launch Week 2. Win Month 1.**

Go build.
