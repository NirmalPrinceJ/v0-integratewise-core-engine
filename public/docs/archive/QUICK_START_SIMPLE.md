# Quick Start: 3-Step Implementation


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Goal**: Click marketplace app → OAuth → Features available

**Time**: 2 days (1 day OAuth endpoint, 1 day frontend integration)

---

## Step 1: Deploy OAuth Endpoint (4 hours)

### Files to Create

```
services/continuity-bridge/src/
├── oauth-handler.ts (OAuth endpoint)
└── jwt-validator.ts (Token validation)
```

### Code

**OAuth Endpoint**:
```typescript
// GET /auth/authorize?app=claude&redirect_uri=...&email=...&org_name=...
// Returns: Redirect to callback with JWT token
```

**JWT Validator**:
```typescript
// Check Authorization header
// Validate JWT
// Extract: user_id, tenant_id, email
// Continue to next middleware
```

### Deploy

```bash
cd services/continuity-bridge
npm run build
npm run deploy
```

**Verification**:
```bash
curl https://integratewise.com/auth/authorize \
  -G \
  --data-urlencode "app=claude" \
  --data-urlencode "redirect_uri=claude-extension://callback" \
  --data-urlencode "email=test@company.com" \
  --data-urlencode "org_name=Test%20Company"

# Expected: Redirect with token in query params
```

---

## Step 2: Add Feature Gate to All Routes (2 hours)

### Update Gateway

**File**: `services/gateway/src/app.ts`

```typescript
import { validateJWT, featureGate } from '@/middleware';

app.use(validateJWT);
app.use(featureGate);

// All routes now require valid JWT
// All requests have: req.tenant_id, req.user_id
// All queries automatically scoped by tenant_id
```

**Verification**:
```bash
# Without token:
curl https://gateway.integratewise.com/api/v1/spine/accounts
# Response: 401 Unauthorized

# With token:
curl https://gateway.integratewise.com/api/v1/spine/accounts \
  -H "Authorization: Bearer eyJhbGc..."
# Response: 200 OK (accounts for this tenant)
```

---

## Step 3: Update Frontends (4 hours)

### All 5 frontends use same pattern

1. Check token on load
2. If no token → Show "Connect" button
3. If valid token → Show workbench
4. Connect button redirects to OAuth
5. OAuth callback stores token → Refresh → Workbench shows

### Example: Claude Desktop

**Claude**: OAuth handler → JWT issued → Claude extension stores JWT → All MCP calls include JWT

### Example: Replit

**Frontend**: React app → `useAuth()` hook → Check token → Show/hide features

### Example: Customer Portal

**Portal**: Same React pattern → OAuth → Features available

---

## Checklist: Go Live

- [ ] OAuth endpoint deployed
- [ ] JWT generation verified
- [ ] JWT validation middleware in Gateway
- [ ] Feature gate middleware in Gateway
- [ ] All 5 marketplace apps configured
- [ ] Frontend: useAuth hook added
- [ ] Frontend: ConnectButton component added
- [ ] Frontend: OAuth callback handler added
- [ ] Manual test: Click connect → OAuth → Token stored → Workbench shows
- [ ] All 5 platforms tested
- [ ] Production JWT secret configured
- [ ] HTTPS enforced on all redirect_uris
- [ ] Monitoring: OAuth success rate > 99%
- [ ] Monitoring: Token validation latency < 50ms

---

## Files to Modify

```
Backend:
  ✅ services/continuity-bridge/src/oauth-handler.ts (NEW)
  ✅ services/gateway/src/middleware/jwt-validator.ts (NEW)
  ✅ services/gateway/src/middleware/feature-gate.ts (NEW)
  ✅ services/gateway/src/app.ts (MODIFY - add middleware)

Frontend (example):
  ✅ frontends/workbench/src/hooks/useAuth.ts (NEW)
  ✅ frontends/workbench/src/components/ConnectButton.tsx (NEW)
  ✅ frontends/workbench/src/app/auth/callback/page.tsx (NEW)
  ✅ frontends/workbench/src/app/page.tsx (MODIFY - conditional render)

Config:
  ✅ .env: JWT_SECRET (production value)
  ✅ .env: All 5 apps with redirect_uris configured
```

---

## Success Metrics

- OAuth success rate: > 99%
- Time from click to features available: < 3 seconds
- Feature visibility consistency across all 5 platforms: 100%
- No re-authentication needed for 24 hours: ✓
- Logout removes token and shows "Connect" button: ✓

---

## Post-Launch Monitoring

1. **OAuth success rate** - Target: > 99%
2. **JWT validation latency** - Target: < 50ms
3. **Feature gate latency** - Target: < 10ms
4. **Token storage success** - Target: 100%
5. **Cross-platform consistency** - Target: All 5 platforms show same features

---

## Rollback Plan

If issues:
1. Disable feature gate middleware (show public features)
2. Revert OAuth endpoint (users click "Connect" but redirected to previous flow)
3. Clear all JWT tokens from KV

Should take < 10 minutes.

---

## Estimated Timeline

- Day 1 (8 hours):
  - Morning: OAuth endpoint + JWT (2 hours)
  - Afternoon: Feature gate + Gateway integration (2 hours)
  - Late: Frontend changes (2 hours)
  - End: Manual testing (2 hours)

- Day 2 (4 hours):
  - Morning: Deploy to production (1 hour)
  - Monitor first connections (2 hours)
  - Iterate based on feedback (1 hour)

**Launch**: End of Day 2

---

## That's It

No complex flows.
No multiple OAuth providers.
No feature flags.
No A/B tests.

One endpoint. One token. Multiple frontends. All see the same features.

Click → OAuth → Features.

Simple. Clean. Done.
