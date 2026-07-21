# Feature Activation: After OAuth, Everything is Available


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Binary State Logic

```
NOT CONNECTED:
  ├─ Show: "Connect IntegrateWise" button
  └─ Click: Redirect to OAuth → Continue flow

CONNECTED (Valid JWT):
  ├─ Show: All 8 workbench projections
  ├─ Show: Spine data (accounts, opportunities, invoices, etc.)
  ├─ Show: Agent Lee recommendations
  ├─ Show: Shared memory
  ├─ Show: Decision logs
  └─ Show: Task creation interface
```

---

## Implementation

### 1. Frontend: Check Token on Load

**File**: `frontends/workbench/src/hooks/useAuth.ts`

```typescript
export function useAuth() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for JWT token
    const token = localStorage.getItem('integratewise_token');
    
    if (!token) {
      setIsConnected(false);
      setLoading(false);
      return;
    }

    // Validate token with server
    fetch('https://gateway.integratewise.com/api/v1/health', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          setIsConnected(true);
        } else {
          localStorage.removeItem('integratewise_token');
          setIsConnected(false);
        }
      })
      .catch(() => {
        setIsConnected(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { isConnected, loading };
}
```

### 2. Frontend: Render Based on State

**File**: `frontends/workbench/src/app/page.tsx`

```typescript
import { useAuth } from '@/hooks/useAuth';
import { ConnectButton } from '@/components/ConnectButton';
import { Workbench } from '@/components/Workbench';

export default function Home() {
  const { isConnected, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isConnected) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">IntegrateWise</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect your business systems
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  // Connected: Show full workbench
  return <Workbench />;
}
```

### 3. Connect Button: Redirect to OAuth

**File**: `frontends/workbench/src/components/ConnectButton.tsx`

```typescript
export function ConnectButton() {
  const handleConnect = () => {
    const redirect_uri = window.location.origin + '/auth/callback';
    const app = detectPlatform(); // 'claude', 'chatgpt', etc.
    const email = prompt('Your work email:');
    const org_name = prompt('Organization name:');

    if (!email || !org_name) return;

    // Redirect to OAuth
    window.location.href = 
      `https://integratewise.com/auth/authorize?` +
      `app=${app}&` +
      `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
      `email=${encodeURIComponent(email)}&` +
      `org_name=${encodeURIComponent(org_name)}`;
  };

  return (
    <button
      onClick={handleConnect}
      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold"
    >
      Connect IntegrateWise
    </button>
  );
}
```

### 4. OAuth Callback Handler

**File**: `frontends/workbench/src/app/auth/callback/page.tsx`

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Get token from URL query params
    const { token, tenant_id } = router.query;

    if (!token) {
      // No token, something went wrong
      router.push('/');
      return;
    }

    // Store token locally
    localStorage.setItem('integratewise_token', token as string);
    localStorage.setItem('tenant_id', tenant_id as string);

    // Redirect to dashboard (triggers useAuth re-check, shows full workbench)
    router.push('/');
  }, [router]);

  return <div>Connecting...</div>;
}
```

---

## API Routes: Protected with JWT

### All Gateway Routes Require Valid Token

**Pattern**:

```typescript
import { validateJWT, featureGate } from '@/middleware';
import { Router } from 'express';

const router = Router();

// All routes require JWT + feature gate
router.use(validateJWT);
router.use(featureGate);

// Now all routes have access to req.tenant_id, req.user_id
router.get('/api/v1/spine/:entity', (req, res) => {
  // req.tenant_id = 'tenant_id'
  // Scope all queries by tenant_id automatically
  
  const { entity } = req.params;
  
  db.query(`
    SELECT * FROM ${entity}
    WHERE tenant_id = ?
  `, [req.tenant_id])
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});
```

---

## Feature Visibility

### Before OAuth

```
Home
├─ "Connect IntegrateWise" button
└─ Learn more...

That's it.
```

### After OAuth (Valid JWT)

```
Home (Workbench)
├─ Sales Projection
│  ├─ Pipeline
│  ├─ Deals
│  └─ Forecasts
├─ Finance Projection
│  ├─ AR/AP
│  ├─ Cash Runway
│  └─ Revenue Recognition
├─ Customer Success Projection
│  ├─ Health Scores
│  ├─ Churn Risk
│  └─ Expansion Opportunities
├─ Agent Lee
│  ├─ Ask a question
│  └─ Get recommendations
├─ Shared Memory
│  ├─ Search past decisions
│  └─ View similar scenarios
├─ Decision Log
│  ├─ View all decisions
│  └─ Export audit trail
└─ Tasks
   ├─ Create task
   └─ Sync to Jira/Asana
```

---

## Multi-Frontend Consistency

All frontends see the same features because:

1. ✅ OAuth handled by Continuity Bridge (one place)
2. ✅ JWT validation happens in Gateway (one place)
3. ✅ All frontends use same APIs (one place)
4. ✅ Tenant scoping automatic (one place)

**Result**: 
- Claude sees everything
- ChatGPT sees everything
- Perplexity sees everything
- Replit sees everything
- Lovable sees everything

Same Spine. Same features. Different projection lens.

---

## Deployment

- [ ] OAuth callback handler deployed
- [ ] Token storage (localStorage) verified
- [ ] JWT validation on all API routes
- [ ] Feature gate on all routes
- [ ] Test: Click connect → OAuth → Token stored → Workbench shows
- [ ] Test: All 5 frontends see same features
- [ ] Test: Logout → Token cleared → Show "Connect" button again

---

## Success

User perspective:
- ❌ Click marketplace app → See "Connect" button
- ✅ Click connect → OAuth → Redirected back with token
- ✅ Token stored → All features available
- ✅ Switch platforms → Same features, different lens

Engineer perspective:
- One OAuth endpoint
- One JWT validation
- One feature gate
- Tenant scoping automatic
- Binary state: connected or not connected

That's it.
