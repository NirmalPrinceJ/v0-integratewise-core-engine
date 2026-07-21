# Next Steps: FRONTEND → Integration


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## 📌 You Are Here

You've successfully:
1. ✅ Built Platform Bootstrap (PlatformProvider + context)
2. ✅ Built Gateway SDK (5 essential methods)
3. ✅ Imported FRONTEND reference (70+ production components)
4. ✅ Documented 3-phase integration plan
5. ✅ Created implementation templates

**Current Status:** Ready to execute Phase 1 (Platform integration)

---

## 🎯 Immediate Next Steps (Choose One)

### Option A: Execute Phase 1 Immediately
**Goal:** Make Account Success domain aware of Platform

**Tasks (1 day):**
1. Copy `apps/web-frontend-reference/app/components/domains/account-success/shell.tsx`
2. Create enhanced version in `packages/domain-shells/account-success-shell.tsx`
3. Add hooks:
   - `const { user, permissions } = usePlatform()`
   - `const { getSignals } = useGateway()`
4. Wire Intelligence Overlay to `getSignals()` calls
5. Test in browser with mock Platform Provider

**Success Criteria:**
- [ ] Domain shell renders in browser
- [ ] Sidebar shows current user role
- [ ] Tab permissions filter based on role
- [ ] Intelligence overlay shows mock signals

---

### Option B: Create Domain Shells Package First
**Goal:** Build foundation for all 12 apps

**Tasks (2 days):**
1. Analyze all domain shells in FRONTEND
2. Extract common patterns:
   - Header with user info
   - Tab navigation with permission filtering
   - View switching logic
   - Signal detection hooks
3. Create base `EnhancedDomainShell` component
4. Create example implementations (CS, RevOps, SalesOps)
5. Document TypeScript interfaces

**Success Criteria:**
- [ ] Base shell component created
- [ ] 3 example implementations work
- [ ] All tests pass
- [ ] Documentation is complete

---

### Option C: Create Shell App for Each Domain
**Goal:** Pre-build 12 app scaffolds

**Tasks (3-4 days):**
1. For each domain (CS, RevOps, SalesOps, etc.):
   - Create `/apps/workbench-{domain}/`
   - Set up Vite + React + Tailwind
   - Import domain shell template
   - Wire to Platform Provider
2. Create shared Vercel deployment config
3. Test local builds for each app

**Success Criteria:**
- [ ] 4 workbench apps scaffold locally
- [ ] Each connects to Platform Provider
- [ ] Each has basic domain views
- [ ] Ready for Vercel deployment

---

## 📚 Documents to Review Before Starting

1. **FRONTEND_INTEGRATION_SUMMARY.md** — Overview of what you got
2. **FRONTEND_ENHANCEMENT_GUIDE.md** — Detailed implementation guide
3. **FRONTEND_STATUS_REPORT.md** — Current status and roadmap

---

## 🗂️ File Locations Reference

**FRONTEND Components:**
- Account Success shell: `apps/web-frontend-reference/app/components/domains/account-success/shell.tsx`
- RevOps shell: `apps/web-frontend-reference/app/components/domains/revops/shell.tsx`
- Intelligence overlay: `apps/web-frontend-reference/app/components/domains/account-success/intelligence-overlay.tsx`
- RBAC manager: `apps/web-frontend-reference/app/components/admin/rbac-manager.tsx`

**Your Code:**
- Platform Provider: `packages/bootstrap/platform-provider.tsx`
- Gateway SDK: `packages/gateway-sdk/client.ts`
- Gateway API routes: `apps/web/app/api/gateway/*/route.ts`

---

## 🔗 Integration Points

```typescript
// 1. In domain shell, add Platform awareness
import { usePlatform } from '@integratewise/bootstrap';
const { user, permissions, orgId } = usePlatform();

// 2. Fetch real signals instead of mocks
import { useGateway } from '@integratewise/gateway-sdk';
const { getSignals } = useGateway();
const signals = await getSignals(orgId, user.id);

// 3. Filter views by permission
const accessibleViews = views.filter(
  (view) => !view.requiresPermission || permissions.includes(view.requiresPermission)
);

// 4. Render intelligence with real data
<IntelligenceOverlay signals={signals} />
```

---

## ⏱️ Estimated Timeline

- **Phase 1 (Now → End of this week):** 3-5 days
  - Extract Account Success shell
  - Integrate with Platform
  - Test end-to-end
  
- **Phase 2 (Next week):** 3-5 days
  - Build `packages/domain-shells/`
  - Create 3 example implementations
  - Document interfaces
  
- **Phase 3 (Week after):** 5-7 days
  - Scaffold all 12 apps
  - Deploy to Vercel
  - Validate multi-app orchestration

**Total:** 2-3 weeks to production-ready 12-app portfolio

---

## ✅ Recommended Starting Point

**Start with Option A** (Execute Phase 1 immediately):
- Quickest validation that architecture works
- Tests Platform Provider in real scenario
- Produces working Account Success workbench
- Foundation for Phase 2 extraction

**Then proceed to Option B** (Extract patterns):
- Ensures consistency across all 12 apps
- Reduces code duplication
- Makes future maintenance easier

**Finally Option C** (Scale to all 12):
- Apply patterns to every domain
- Deploy multi-app portfolio
- Celebrate 🎉

---

## 🚀 Ready to Start?

Pick one option above and let's go. Which would you prefer:

1. **Phase 1 Now** — Build Account Success workbench with Platform (fast path)
2. **Phase 2 First** — Extract domain shells package (foundation first)
3. **Phase 3 Setup** — Scaffold all 12 apps (scale immediately)

Or just tell me to start, and I'll begin with Phase 1.
