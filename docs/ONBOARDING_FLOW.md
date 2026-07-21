# Onboarding Flow — Endpoints

The 6-phase onboarding flow guides users from signup to active workspace.

---

## Flow Overview

```
Phase 1: Welcome        → Use case selection (personal/work/business)
Phase 2: Profile        → Industry, department, company size
Phase 3: Workspace      → Workspace name, goals
Phase 4: Connectors     → Select data sources (Marketplace)
Phase 5: Activation     → Initialize Spine, start sync
Phase 6: Complete       → Redirect to workspace
```

---

## Endpoints

### Phase 1-3: Identity & Profile

| Method | Endpoint | Phase | Description | Request Body | Response |
|--------|----------|-------|-------------|--------------|----------|
| `GET` | `/api/v1/workspace/onboarding-state` | All | Get current onboarding state | - | `{onboarding: OnboardingState}` |
| `POST` | `/api/v1/workspace/initialize-spine` | 5 | Initialize Spine schema | `{domain, industry, department, connectors}` | `{tenantConfig, syncJobs}` |
| `POST` | `/api/v1/workspace/complete-onboarding` | 6 | Complete onboarding | `{preferences?}` | `{success, redirectUrl, backgroundJobs}` |
| `GET` | `/api/v1/workspace/progress` | 5 | Poll sync progress | - | `{type: "sync_progress", jobs: SyncJob[]}` |

### Phase 4: Connector Selection

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/v1/workspace/connectors/catalog` | Get available connectors | `{connectors: [...], total: 100}` |
| `GET` | `/api/v1/workspace/connectors` | List installed connectors | `{connectors: [...]}` |
| `POST` | `/api/v1/workspace/register-connector` | Register connector | `{success, connector_id}` |
| `POST` | `/api/v1/integrations/:provider/authorize` | Start OAuth flow | `{auth_url, state}` |
| `GET` | `/api/v1/integrations/callback` | OAuth callback (public) | Redirect to app |

### Phase 5: Activation

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `POST` | `/api/v1/workspace/initialize-spine` | Initialize Spine | `{tenantConfig, syncJobs}` |
| `GET` | `/api/v1/loader/creamy/:jobId` | Check extraction progress | `{status, progress, extractedCount}` |
| `GET` | `/api/v1/workspace/progress` | Poll sync progress | `{type: "sync_progress", jobs: [...]}` |

### Phase 6: Completion

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `POST` | `/api/v1/workspace/complete-onboarding` | Mark onboarding complete | `{success, redirectUrl}` |

---

## Request/Response Details

### GET /api/v1/workspace/onboarding-state

Returns the current onboarding state for the user.

**Response:**
```json
{
  "onboarding": {
    "status": "in_progress",
    "currentStep": "profile",
    "completedSteps": ["welcome"],
    "connectorsConfig": [
      {"provider": "salesforce", "flowType": "A"}
    ],
    "createdAt": "2026-07-21T10:00:00Z"
  }
}
```

---

### POST /api/v1/workspace/initialize-spine

Initializes the Spine schema with domain, industry, and connectors.

**Request:**
```json
{
  "domain": "SALES",
  "industry": "technology",
  "department": "Sales",
  "connectors": [
    {"provider": "salesforce", "flowType": "A"},
    {"provider": "hubspot", "flowType": "A"}
  ]
}
```

**Response:**
```json
{
  "tenantConfig": {
    "id": "tenant_abc123",
    "domain": "SALES",
    "connectors": {
      "salesforce": {"flowType": "A"},
      "hubspot": {"flowType": "A"}
    }
  },
  "syncJobs": [
    {"jobId": "job_001", "connector": "salesforce", "status": "running"},
    {"jobId": "job_002", "connector": "hubspot", "status": "pending"}
  ]
}
```

---

### POST /api/v1/workspace/complete-onboarding

Marks onboarding as complete and returns redirect URL.

**Request:**
```json
{
  "preferences": {
    "theme": "light",
    "notifications": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "/app/work/dashboard",
  "backgroundJobs": [
    {"jobId": "job_001", "type": "sync", "status": "running"}
  ]
}
```

---

### GET /api/v1/workspace/progress

Polls sync progress during activation phase.

**Response:**
```json
{
  "type": "sync_progress",
  "jobs": [
    {
      "jobId": "job_001",
      "connector": "salesforce",
      "phase": "creamy",
      "status": "running",
      "progress": {
        "total": 1250,
        "processed": 800,
        "percentage": 64,
        "stage": "extracting"
      }
    }
  ]
}
```

---

### GET /api/v1/loader/creamy/:jobId

Checks extraction progress for a specific job.

**Response:**
```json
{
  "jobId": "job_001",
  "status": "running",
  "progress": {
    "total": 1250,
    "processed": 800,
    "percentage": 64
  },
  "extractedCount": 800,
  "message": "Extracting accounts from Salesforce"
}
```

---

## OnboardingState Type

```typescript
interface OnboardingState {
  status: "not_started" | "in_progress" | "completed";
  currentStep: string;
  completedSteps: string[];
  connectorsConfig?: Array<{
    provider: string;
    flowType: "A" | "B" | "C";
  }>;
  creamyJobId?: string;
  normalizerJobId?: string;
  createdAt?: string;
  completedAt?: string;
}
```

## SyncJob Type

```typescript
interface SyncJob {
  jobId: string;
  connector: string;
  phase: "creamy" | "needed" | "delta";
  status: "pending" | "running" | "completed" | "failed";
  progress: {
    total?: number;
    processed?: number;
    percentage?: number;
    stage?: string;
  };
}
```

---

## Frontend Implementation

```typescript
import { 
  initializeSpine, 
  getOnboardingState, 
  completeOnboarding,
  subscribeToProgress 
} from "@/api/workspace";

// Check onboarding state
const { onboarding } = await getOnboardingState();

// Initialize Spine (Phase 5)
const { tenantConfig, syncJobs } = await initializeSpine({
  domain: "SALES",
  industry: "technology",
  department: "Sales",
  connectors: [
    { provider: "salesforce", flowType: "A" },
    { provider: "hubspot", flowType: "A" }
  ]
});

// Subscribe to progress updates
const unsubscribe = subscribeToProgress(
  (jobs) => {
    jobs.forEach(job => {
      console.log(`${job.connector}: ${job.progress.percentage}%`);
    });
  },
  (error) => console.error(error)
);

// Complete onboarding (Phase 6)
const { redirectUrl } = await completeOnboarding({
  preferences: { theme: "light" }
});

// Redirect to workspace
window.location.href = redirectUrl;
```

---

## Domain Resolution

| Use Case | Department | Domain |
|----------|------------|--------|
| personal | * | PERSONAL |
| work | SALES | SALES |
| work | MARKETING | MARKETING |
| work | REVOPS | REVOPS |
| work | CUSTOMER_SUCCESS | CUSTOMER_SUCCESS |
| work | ENGINEERING | PRODUCT_ENGINEERING |
| work | PRODUCT | PRODUCT_ENGINEERING |
| work | IT | PRODUCT_ENGINEERING |
| work | OPERATIONS | CUSTOMER_SUCCESS |
| work | SUPPLY_CHAIN | PROCUREMENT |
| work | SERVICE_OPS | SERVICE |
| work | FINANCE | FINANCE |
| work | HR | CUSTOMER_SUCCESS |
| work | LEGAL | CUSTOMER_SUCCESS |

---

**Base URL:** `https://gateway.dev.integratewise.ai`  
**Auth:** `Authorization: Bearer $INTEGRATEWISE_API_TOKEN` + `x-tenant-id: $INTEGRATEWISE_TENANT_ID`

**Auth Endpoints (Clerk):**
| Endpoint | URL |
|----------|-----|
| Sign In | `https://accounts.integratewise.ai/sign-in` |
| Sign Up | `https://accounts.integratewise.ai/sign-up` |
| OAuth Authorize | `https://integratewise.ai/clerk/oauth/authorize` |
| OAuth Token | `https://integratewise.ai/clerk/oauth/token` |
| User Info | `https://integratewise.ai/clerk/oauth/userinfo` |
