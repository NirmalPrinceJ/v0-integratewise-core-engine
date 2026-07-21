# Implementation Ready: Complete GTM Motion


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Status**: PRODUCTION READY | Build Time: 2 Days | Launch: This Week

---

## The Motion (2 Minutes to Understand)

```
User clicks marketplace app button
    ↓
Redirected to OAuth
    ↓
Enters email + org name
    ↓
Backend creates tenant + issues JWT
    ↓
Redirected back with token
    ↓
All features available

Total time: 2 minutes
```

---

## 3 Documents to Read (In Order)

### 1. QUICK_START_SIMPLE.md (13 min read)
**What to do**: 3-step implementation plan
- Step 1: Deploy OAuth endpoint (4 hours)
- Step 2: Add feature gate (2 hours)
- Step 3: Update frontends (4 hours)
- Launch: End of Day 2

**Action**: Read this first if you want to START BUILDING TODAY

### 2. CONTINUITY_BRIDGE_SIMPLE.md (15 min read)
**What to do**: Complete OAuth implementation with full code
- OAuth endpoint code (copy-paste ready)
- JWT validator code (copy-paste ready)
- Multi-app support (5 platforms)
- Deployment checklist

**Action**: Read this when building the backend

### 3. FEATURE_ACTIVATION_SIMPLE.md (15 min read)
**What to do**: Frontend integration + feature visibility
- useAuth hook (copy-paste ready)
- ConnectButton component (copy-paste ready)
- OAuth callback handler (copy-paste ready)
- Binary state logic (connected or not)

**Action**: Read this when building the frontend

---

## Your Architecture (From Platform Diagram)

```
Customer Ecosystem
    ↓ (customer uses)
Continuity Bridge ← ONE OAuth endpoint (handles all apps)
    ↓
Identity + Organization (Tenant + User)
    ↓
JWT Token (24-hour expiration)
    ↓
All 5 Frontends:
  • Claude Desktop
  • ChatGPT
  • Perplexity
  • Replit
  • Lovable
    ↓
Gateway Layer (JWT validation + feature gate)
    ↓
Adaptive Human Workbench (8 projections)
    ↓
Features Available (Spine, Agent Lee, Memory, Tasks)
```

---

## Files You Need to Create/Modify

### Backend (Day 1, 8 hours)

**Create**:
```
services/continuity-bridge/src/
├── oauth-handler.ts (NEW)
└── jwt-validator.ts (NEW)
```

**Modify**:
```
services/gateway/src/
├── middleware/feature-gate.ts (NEW)
├── app.ts (ADD middleware)
```

**Setup**:
```
.env
├── JWT_SECRET (production value)
└── ALLOWED_APPS (claude, chatgpt, perplexity, replit, lovable)
```

### Frontend (Day 1, 4 hours)

**Create**:
```
frontends/workbench/src/
├── hooks/useAuth.ts (NEW)
├── components/ConnectButton.tsx (NEW)
└── app/auth/callback/page.tsx (NEW)
```

**Modify**:
```
frontends/workbench/src/
├── app/page.tsx (conditional render)
```

---

## Checklist: Day 1

Morning (OAuth Endpoint):
- [ ] Read QUICK_START_SIMPLE.md
- [ ] Read CONTINUITY_BRIDGE_SIMPLE.md
- [ ] Create oauth-handler.ts
- [ ] Create jwt-validator.ts
- [ ] Deploy to staging
- [ ] Test OAuth flow manually

Afternoon (Feature Gate):
- [ ] Create feature-gate.ts
- [ ] Add JWT validation to Gateway
- [ ] Add feature gate to all routes
- [ ] Test with Postman (without token → 401, with token → 200)

Evening (Frontend):
- [ ] Read FEATURE_ACTIVATION_SIMPLE.md
- [ ] Create useAuth hook
- [ ] Create ConnectButton component
- [ ] Create OAuth callback handler
- [ ] Update page.tsx to use conditional rendering
- [ ] Manual end-to-end test: click → OAuth → token → features

---

## Checklist: Day 2

Morning (Production):
- [ ] Deploy OAuth endpoint to production
- [ ] Deploy Gateway changes to production
- [ ] Deploy frontend to production
- [ ] Verify all 5 marketplace apps redirect correctly

Afternoon (Monitor + Iterate):
- [ ] Watch OAuth success rate (target: > 99%)
- [ ] Watch first 10 users onboard
- [ ] Check feature visibility
- [ ] Gather feedback
- [ ] Fix any issues

Evening (Wrap):
- [ ] Document any changes
- [ ] Update playbooks
- [ ] Plan Phase 2

---

## Success Metrics (Track These)

**Launch Day**:
- OAuth success rate: > 99%
- Time to features: < 3 seconds
- Token storage success: 100%
- Feature consistency across 5 platforms: 100%

**Launch Week**:
- Daily active users: +20% per day
- Feature usage: > 80% of users try at least one feature
- Support tickets about "why can't I see features": 0
- OAuth error rate: < 1%

---

## Deployment Commands

### Build
```bash
cd services/continuity-bridge && npm run build
cd services/gateway && npm run build
cd frontends/workbench && npm run build
```

### Deploy to Staging
```bash
wrangler deploy --env staging
```

### Deploy to Production
```bash
wrangler deploy --env production
```

### Monitor
```bash
wrangler tail --env production
```

---

## Verification Commands

### Test OAuth Endpoint
```bash
curl https://integratewise.com/auth/authorize \
  -G \
  --data-urlencode "app=claude" \
  --data-urlencode "redirect_uri=claude-extension://callback" \
  --data-urlencode "email=test@company.com" \
  --data-urlencode "org_name=Test%20Company"
```

Expected: 302 redirect with `?token=...&tenant_id=...`

### Test JWT Validation
```bash
# Without token:
curl https://gateway.integratewise.com/api/v1/health
# Response: 401 Unauthorized

# With token:
curl https://gateway.integratewise.com/api/v1/health \
  -H "Authorization: Bearer eyJhbGc..."
# Response: 200 OK
```

### Test All 5 Apps
```bash
# Claude Desktop
curl "https://integratewise.com/auth/authorize?app=claude&..."

# ChatGPT
curl "https://integratewise.com/auth/authorize?app=chatgpt&..."

# Perplexity
curl "https://integratewise.com/auth/authorize?app=perplexity&..."

# Replit
curl "https://integratewise.com/auth/authorize?app=replit&..."

# Lovable
curl "https://integratewise.com/auth/authorize?app=lovable&..."
```

All should redirect with token.

---

## Rollback Plan (If Issues)

1. Disable feature gate middleware
   ```typescript
   // Comment out in Gateway app.ts
   // app.use(featureGate);
   ```

2. Revert JWT validation
   ```typescript
   // Comment out in Gateway app.ts
   // app.use(validateJWT);
   ```

3. Clear all tokens from KV
   ```bash
   wrangler kv:key delete integratewise_tokens "*"
   ```

Time to rollback: < 10 minutes

---

## What Happens After Launch

**Week 1**: Scale to 1000 users
**Week 2**: Add AI agent integration (Agent Lee)
**Week 3**: Cross-domain metrics
**Week 4**: Usage-based billing

---

## Support

If issues:
1. Check logs: `wrangler tail`
2. Check database: OAuth tokens being created?
3. Check frontend: Token stored in localStorage?
4. Check Gateway: JWT validation passing?

---

## That's It

No complex flows.
No multiple OAuth providers.
No feature flags.

One endpoint. One token. Five platforms. All features available.

**Click → OAuth → Features**

Everything is documented. Everything is coded. Everything is ready.

Start with QUICK_START_SIMPLE.md and build today.

Launch this week.

Win.
