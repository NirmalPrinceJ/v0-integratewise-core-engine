# IntegrateWise: Quick Start - Preview & E2E Tests

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Goal: Working Proof Surface

This guide gets the platform preview running and verifies all 12 framework pins are operational.

**No ecosystem apps needed yet** - just proof that the core platform works.

---

## Prerequisites

```bash
# Node.js 18+ and pnpm
node --version  # Should be 18.x or higher
pnpm --version  # Should be 9.x or higher

# If not installed:
npm install -g pnpm
```

---

## Step 1: Start the Dev Environment

```bash
cd /vercel/share/v0-project

# Install dependencies (one time only)
pnpm install

# Start the dev server (runs Next.js + all services)
pnpm dev
```

**What this does:**

- Starts Next.js web app on `http://localhost:3000`
- Auto-starts supporting services (gateway, intelligence, knowledge, etc.)
- Watches for file changes (hot reload)

**Expected output:**

```
> next dev
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
✓ Compiled successfully
```

**Verify it's working:**
Open browser: http://localhost:3000

You should see the web app with:

- Top navigation bar
- Sidebar with menu
- Main content area
- Command palette (Cmd+K or Ctrl+K)

---

## Step 2: Run the Playwright Tests

**In a separate terminal:**

```bash
cd /vercel/share/v0-project

# Run all tests (headless mode)
pnpm test:e2e

# Or run with visible browser
pnpm test:e2e:headed

# Or run in interactive UI mode
pnpm test:e2e:ui

# Or run with step debugger
pnpm test:e2e:debug
```

**What this tests:**

The test suite verifies all 12 framework pins are working:

```
Pin #1:  Identity         → ✓ Can authenticate
Pin #2:  Ingress          → ✓ Requests route correctly
Pin #3:  Continuity       → ✓ Events are recorded
Pin #4:  Memory           → ✓ Context is retrieved
Pin #5:  Capability       → ✓ ADK registry works
Pin #6:  Governance       → ✓ Policies are enforced
Pin #7:  Intelligence     → ✓ Agent reasoning works
Pin #8:  Knowledge        → ✓ Search and docs work
Pin #9:  Networking       → ✓ Events are published
Pin #10: Twin            → ✓ User twins sync
Pin #11: Connector       → ✓ Integrations work
Pin #12: Pipeline        → ✓ Workflows execute
```

Plus UI component tests:

- Sidebar navigation
- Top bar and user menu
- Command palette search
- Theme switching
- Multi-tenant isolation

**Expected output:**

```
Running 12 tests using 1 worker

Pin Test 1 - Identity Framework          ✓
Pin Test 2 - Ingress Framework           ✓
Pin Test 3 - Continuity Framework        ✓
...
Pin Test 12 - Pipeline Framework         ✓

UI Component Tests                        ✓
Multi-tenant Isolation                    ✓
Performance Tests (< 5s load)             ✓
Error Handling                            ✓

12 passed (45.3s)

View full report: npx playwright show-report
```

---

## Step 3: View the Test Report

After tests complete, view the HTML report:

```bash
pnpm test:e2e:report
```

This opens an interactive report showing:

- ✓ Passed tests (green)
- ✗ Failed tests (red)
- Screenshots at each step
- Video recordings (if enabled)
- Performance metrics
- Error details

---

## Manual Testing (Proof Surface)

While the preview is running, manually test key flows:

### Test Identity (Pin #1)

1. Go to http://localhost:3000
2. Look for login/auth section
3. Try authenticating as "customer-zero@example.com"
4. **Proof**: JWT token is issued, user context is resolved

### Test Continuity (Pin #3)

1. After authenticating, open browser DevTools (F12)
2. Go to Console tab
3. Look for events being logged as you interact with the app
4. **Proof**: Events are being recorded to continuity layer

### Test Memory (Pin #4)

1. Navigate to different pages
2. Open the command palette (Cmd+K / Ctrl+K)
3. Search for "context" or previous actions
4. **Proof**: System remembers your previous interactions

### Test Intelligence (Pin #7)

1. Look for AI-powered suggestions or recommendations
2. The system should suggest next actions based on history
3. **Proof**: Intelligence agent is reasoning about your context

### Test Multi-Tenant Isolation (Security)

1. Open DevTools → Application → Cookies
2. Look for `x-tenant-id` in headers or localStorage
3. Each user only sees data for their tenant
4. **Proof**: No data leaks between tenants

---

## Debugging & Troubleshooting

### Preview won't start

```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill the process if needed
kill -9 <PID>

# Try starting again
pnpm dev
```

### Tests won't run

```bash
# Ensure Playwright is installed
pnpm exec playwright install

# Run with verbose output
pnpm test:e2e --verbose

# Check Playwright version
pnpm exec playwright --version
```

### Tests timing out

```bash
# Increase timeout in playwright.config.ts
timeout: 60000  // 60 seconds instead of default 30

# Then run tests again
pnpm test:e2e
```

### Service errors in preview

1. Check terminal output for error messages
2. Look in browser console (F12) for API errors
3. Check if gateway service is running
4. Restart dev server: `pnpm dev`

---

## Key Files & What They Do

### Web App (The Proof Surface)

- `apps/web/src/main.tsx` - Entry point
- `apps/web/src/routes/` - All pages
- `apps/web/src/components/` - UI components
- `apps/web/e2e/` - End-to-end tests

### Gateway (The Router)

- `services/gateway/src/index.ts` - HTTP routing
- `services/gateway/src/customer-zero.ts` - Customer Zero provisioning
- `services/gateway/src/auth.ts` - Authentication

### SDK (The API)

- `packages/sdk/src/index.ts` - All exported methods
- Apps call SDK → SDK calls Gateway → Gateway routes to services

### Tests (The Proof)

- `apps/web/e2e/customer-zero.spec.ts` - Pin verification tests
- `apps/web/e2e/README.md` - Test documentation

---

## The Proof Chain

```
User Opens http://localhost:3000
    ↓
Web App loads (apps/web)
    ↓
Web App calls SDK (packages/sdk)
    ↓
SDK calls Gateway (services/gateway)
    ↓
Gateway routes to services:
    ├─ Identity service (auth)
    ├─ Continuity service (events)
    ├─ Memory service (context)
    ├─ Intelligence service (reasoning)
    └─ ... (all 12 frameworks)
    ↓
Services respond with results
    ↓
SDK formats response
    ↓
Web App displays result
    ↓
E2E Tests verify entire flow worked ✓
```

When all tests pass → **Working proof surface** is confirmed.

---

## Success Criteria

You've got a working proof surface when:

✓ `pnpm dev` starts without errors
✓ http://localhost:3000 loads in browser
✓ Can authenticate as customer-zero
✓ Events appear in console logs
✓ `pnpm test:e2e` passes all 12 pin tests
✓ UI components render and interact correctly
✓ Multi-tenant isolation is enforced

When all above are true:
**Platform is operational and provably working.**

---

## What's NOT Included (Yet)

These come later, after proof surface is confirmed:

- Ecosystem apps (iw-chat, iw-docs, iw-blog, etc.)
- Advanced features (approval chains, workflows, etc.)
- Configuration-driven routing (routing.yaml, policy.yaml)
- Partner ecosystem template

Right now: Just the **working proof** that all pins are wired.

---

## Next Steps

1. Run `pnpm dev` in one terminal
2. Open http://localhost:3000 in browser
3. In another terminal, run `pnpm test:e2e`
4. When all tests pass → Proof surface is working ✓
5. Take screenshot of test report as proof
6. Share test results to confirm platform is operational

Then: Move to ecosystem apps (separate repos) that consume this proved platform.
