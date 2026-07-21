# Continuity Bridge: Simple OAuth Implementation


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## One Connection, Multiple Frontends

**The Motion**: Marketplace app clicked → OAuth redirect → Features available

---

## Architecture

```
Marketplace App (Claude, ChatGPT, etc.)
        ↓
User clicks "Connect IntegrateWise"
        ↓
Redirect to: https://integratewise.com/auth?app=claude&redirect_uri=...
        ↓
Continuity Bridge (OAuth Endpoint)
  • Validate app + redirect_uri
  • User enters email + org name
  • Create tenant + user (if new)
  • Issue JWT token
        ↓
Redirect back to app with JWT
        ↓
App stores JWT locally
        ↓
All subsequent API calls include JWT
        ↓
Features automatically available (token validation = auth check)
```

---

## Implementation: 3 Files

### 1. OAuth Endpoint

**File**: `services/continuity-bridge/src/oauth-handler.ts`

```typescript
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// Supported marketplace apps
const APPS = {
  claude: {
    redirect_uri_pattern: /^claude-extension:\/\/callback$/,
    name: 'Claude Desktop'
  },
  chatgpt: {
    redirect_uri_pattern: /^https:\/\/chatgpt\.com\/callback$/,
    name: 'ChatGPT'
  },
  perplexity: {
    redirect_uri_pattern: /^https:\/\/perplexity\.com\/callback$/,
    name: 'Perplexity'
  },
  replit: {
    redirect_uri_pattern: /^https:\/\/replit\.com\/callback$/,
    name: 'Replit'
  },
  lovable: {
    redirect_uri_pattern: /^https:\/\/lovable\.dev\/callback$/,
    name: 'Lovable'
  }
};

// GET /auth/authorize?app=claude&redirect_uri=...&email=...&org_name=...
router.get('/authorize', async (req: Request, res: Response) => {
  try {
    const { app, redirect_uri, email, org_name } = req.query;

    // 1. Validate app + redirect_uri
    if (!app || typeof app !== 'string' || !APPS[app as keyof typeof APPS]) {
      return res.status(400).json({ error: 'Invalid app' });
    }

    const appConfig = APPS[app as keyof typeof APPS];
    if (!appConfig.redirect_uri_pattern.test(String(redirect_uri))) {
      return res.status(400).json({ error: 'Invalid redirect_uri' });
    }

    // 2. Create tenant + user (or get existing)
    const tenant = await db.tenant.findOrCreate({
      where: { email: String(email) },
      defaults: {
        org_name: String(org_name) || 'My Org',
        email: String(email),
        created_at: new Date()
      }
    });

    const user = await db.user.findOrCreate({
      where: { tenant_id: tenant.id, email: String(email) },
      defaults: {
        tenant_id: tenant.id,
        email: String(email),
        created_at: new Date()
      }
    });

    // 3. Issue JWT token
    const jwt_token = jwt.sign(
      {
        user_id: user.id,
        tenant_id: tenant.id,
        email: user.email,
        app: app,
        iat: Date.now() / 1000
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 4. Redirect back to app with token
    const callback_url = new URL(String(redirect_uri));
    callback_url.searchParams.set('token', jwt_token);
    callback_url.searchParams.set('tenant_id', tenant.id);
    
    res.redirect(callback_url.toString());
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'Authorization failed' });
  }
});

export default router;
```

### 2. JWT Validation Middleware

**File**: `services/gateway/src/middleware/jwt-validator.ts`

```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user_id?: string;
  tenant_id?: string;
  email?: string;
}

export function validateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      connect_url: 'https://integratewise.com/auth?app=...'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      user_id: string;
      tenant_id: string;
      email: string;
    };

    req.user_id = decoded.user_id;
    req.tenant_id = decoded.tenant_id;
    req.email = decoded.email;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### 3. Feature Gate Logic

**File**: `services/gateway/src/middleware/feature-gate.ts`

```typescript
import { AuthenticatedRequest } from './jwt-validator';
import { Response, NextFunction } from 'express';

export function featureGate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // If token is valid (JWT validation passed), user has access to ALL features
  
  if (!req.tenant_id || !req.user_id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Token is valid = full feature surface available
  // No additional checks needed
  
  next();
}
```

---

## Usage: Multi-Frontend Integration

### Claude Desktop

```json
{
  "oauth_redirect": "https://integratewise.com/auth",
  "app": "claude",
  "redirect_uri": "claude-extension://callback"
}
```

When user clicks "Connect IntegrateWise":
```
→ https://integratewise.com/auth?app=claude&redirect_uri=claude-extension://callback&email=user@company.com&org_name=Company%20Name
→ User sees OAuth form
→ Continues to authorize
→ Redirected back: claude-extension://callback?token=eyJhbGc...
→ Claude stores token locally
→ All subsequent MCP calls include: Authorization: Bearer eyJhbGc...
```

### ChatGPT Custom Action

```json
{
  "url": "https://integratewise.com/mcp",
  "auth": {
    "type": "oauth",
    "client_id": "chatgpt-client-id",
    "authorization_url": "https://integratewise.com/auth?app=chatgpt",
    "token_url": "https://integratewise.com/auth/token"
  }
}
```

### All Other Platforms

Same pattern:
- Different `app` parameter
- Different `redirect_uri` (but all redirect back with JWT)
- Same JWT validation
- Same feature gate

---

## Deployment Checklist

- [ ] OAuth endpoint deployed
- [ ] JWT generation verified (24-hour expiration)
- [ ] JWT validation middleware added to Gateway
- [ ] Feature gate middleware added to all routes
- [ ] All 5 marketplace apps configured with correct redirect_uris
- [ ] Test: Manual OAuth flow (authorize → token → API call)
- [ ] Test: Verify all 5 apps redirect correctly
- [ ] Production: Enable JWT signing with real secret
- [ ] Production: Enable HTTPS only for redirect_uris

---

## Success Metric

**Click marketplace app → OAuth → Features available**

If user has valid JWT token, they have access to everything. No feature flags, no additional checks, no complexity.

Binary state:
- ❌ No token → Show "Connect" button
- ✅ Valid token → Show everything (Spine, Agent Lee, Memory, Tasks, Metrics)

That's the entire motion.
