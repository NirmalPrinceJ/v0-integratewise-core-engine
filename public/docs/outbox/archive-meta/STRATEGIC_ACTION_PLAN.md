# IntegrateWise Strategic Action Plan

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Based On**: Complete deep excavation of 335K LOC codebase  
**Date**: July 10, 2026  
**Objective**: Create Customer Zero—end-to-end proof that all 34 subsystems work together

---

## The Situation

You have a **complete, production-scale platform** but it's architecturally separated:

- **Frontend** (apps/live): Beautiful UI, deployed on Vercel, returns mock data
- **Backend** (services/): 27 services, fully functional, undeployed
- **Packages** (30+): Capability Fabric, Memory, Twin, Connectors all built
- **Gap**: No visible working example that connects them

---

## What "Customer Zero" Means

A single user action that flows through **all three Life Cycles**:

### Action: User clicks "Sell Deal" capability

### LC1 (Work Surface):

```
1. Frontend: User on /capabilities page
2. Clicks "Sell Deal"
3. Sees AI recommendation with confidence score
4. Clicks "Execute"
5. Sees deal created in CRM
```

### LC2 (Silent Partner):

```
Behind the scenes:
- Twin generates recommendation
- Memory records the interaction
- Learning updates capability quality scores
```

### LC3 (Connected Fabric):

```
- System queries Salesforce for account data
- Signals engine highlights deal risks
- Pipeline handles approval if needed
- Connectors update all linked systems
```

---

## The Execution Plan

### PHASE 1: Wire Frontend → Gateway (3-4 hours)

**What**: Make apps/live/api/capabilities/execute actually connect to services/gateway

**Steps**:

1. **Get Gateway URL** (30 min)
   - Deploy services/gateway (currently not deployed)
   - Or use local gateway for testing
   - OR configure for staging environment

2. **Update API Route** (30 min)

   ```typescript
   // apps/live/app/api/capabilities/execute/route.ts

   // Current: returns mock data
   // Update to: call services/gateway endpoint
   const response = await fetch(`${GATEWAY_URL}/capabilities/execute`, {
     method: "POST",
     headers: {
       Authorization: `Bearer ${session.idToken}`,
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       capabilityId: "sell-deal",
       entityId,
       context,
     }),
   });
   ```

3. **Test Loop** (1-2 hours)
   - Click capability in frontend
   - Watch request flow to gateway
   - See response come back
   - Display result to user

4. **Commit** (15 min)
   ```bash
   git commit -m "feat: wire apps/live → services/gateway for capability execution"
   ```

---

### PHASE 2: Capability Execution (2-3 hours)

**What**: Actually execute the capability through the stack

**Components Involved**:

- services/gateway → routes request
- packages/core/capability-registry → looks up "Sell Deal"
- packages/core/capability-context → assembles data from Spine
- services/intelligence OR services/think → AI processing
- services/connector → calls Salesforce
- services/hermes → records memory

**Steps**:

1. **Trace Path** (30 min)
   - Open services/gateway/src/routes.ts
   - Find capability execution route
   - Trace what it calls next
   - Document the flow

2. **Fix Missing Wiring** (1-2 hours)
   - Gateway knows about Intelligence service? ✓ or ✗
   - Intelligence knows about Connector? ✓ or ✗
   - Connector has Salesforce config? ✓ or ✗
   - Each link either works or needs fixing

3. **Test End-to-End** (30 min)
   - Execute capability from frontend
   - Watch it flow through all services
   - See result appear in frontend

---

### PHASE 3: Memory & Twin (1-2 hours)

**What**: Record to memory system and update Twin

**Components**:

- services/hermes (memory)
- services/twin-orchestrator (Twin)
- packages/hermes-spine-memory

**Steps**:

1. **After Capability Executes**:

   ```typescript
   // In capability execution response
   await memory.record({
     type: "capability_execution",
     capabilityId: "sell-deal",
     result: { dealId: "..." },
     userId,
     timestamp,
   });

   await twin.update({
     userId,
     newContext: { recentDeal: dealId },
   });
   ```

2. **Test**:
   - Execute capability
   - Check memory system shows it
   - Check Twin has updated context

---

### PHASE 4: Visible Proof (30 min - 1 hour)

**What**: Create a "Customer Zero Walkthrough" page

**Do This**:

1. **Add /customer-zero route** to apps/live
2. **Create interactive flow**:

   ```
   Step 1: View available capabilities (/api/capabilities/discover)
   Step 2: Click "Sell Deal"
   Step 3: See AI recommendation (from services/intelligence)
   Step 4: Click "Execute"
   Step 5: See deal created (in Salesforce)
   Step 6: See memory recorded (check hermes)
   Step 7: See Twin updated (check twin-orchestrator)
   ```

3. **Screenshot each step**
4. **Create walkthrough video**
5. **This becomes your proof of concept**

---

## Priority: Focus Only On Sell Deal

**Don't try to**:

- Wire all 24 capabilities
- Connect all 27 services
- Build entire memory pipeline
- Create full Twin

**Do try to**:

- Make ONE capability work end-to-end
- Call ONE external system (Salesforce)
- Record ONE memory entry
- Update ONE Twin

**Why**: Proves the architecture. Everything else follows the same pattern.

---

## What Each Service Needs

### services/gateway

- ✅ Has routing table to other services
- ❌ Needs to know about apps/live endpoints
- Action: Check `services/gateway/src/routes.ts`

### services/intelligence

- ✅ Has AI pipeline
- ❌ Needs LLM credentials
- Action: Check `.env` or config

### services/connector

- ✅ Has 80+ integration templates
- ❌ Might need Salesforce OAuth setup
- Action: Check `services/connector/src/integrations/salesforce.ts`

### services/hermes

- ✅ Has memory recording
- ❌ Needs database connection
- Action: Check Supabase integration

---

## Immediate Next Steps

### Day 1 (Now):

1. Read `services/gateway/src/routes.ts` - understand routing
2. Find Sell Deal capability definition
3. Trace where it routes for execution

### Day 2:

1. Update apps/live/api/capabilities/execute to call gateway
2. Deploy gateway (or set up local)
3. Test request flow

### Day 3:

1. Fix any missing service-to-service wiring
2. Test full execution
3. Check Salesforce updated

### Day 4:

1. Add memory recording
2. Check Twin updated
3. Create /customer-zero page
4. Demo

---

## Success Criteria

- ✅ User can click capability in /capabilities
- ✅ Frontend sends request to gateway
- ✅ Gateway routes to intelligence service
- ✅ Intelligence returns recommendation
- ✅ Frontend displays recommendation
- ✅ User clicks "Execute"
- ✅ Capability executes on Salesforce
- ✅ Memory system records it
- ✅ Twin context updates
- ✅ User sees result in frontend

**When all 9 are true: You have Customer Zero.**

---

## Then What?

Once Customer Zero works:

1. **Wire remaining 23 capabilities** (same pattern, 2-3 hours each)
2. **Add database schema** (1-2 hours)
3. **Deploy services** (2-3 hours)
4. **Enable real connectors** (1-2 hours per connector)
5. **Production hardening** (ongoing)

**Timeline**: 1-2 weeks from today to full production platform.

---

## Why This Matters

Right now:

- Beautiful frontend ✓
- Powerful backend ✓
- But they don't talk ✗

After Customer Zero:

- Beautiful frontend ✓
- Powerful backend ✓
- Talking together ✓
- **Platform works** ✓

---

## Where to Start

**Go to**: `services/gateway/src/`

**Read**: `routes.ts`, `auth.ts`

**Question**: "What endpoint handles capability execution?"

**Answer to that question** leads you to the path.

**That path** is where you'll make your first fix.

**That first fix** gets you 10% of the way.

**The next 9 fixes** get you to 100%.

---

The platform is built. It just needs to be wired. You have everything. Execute.
