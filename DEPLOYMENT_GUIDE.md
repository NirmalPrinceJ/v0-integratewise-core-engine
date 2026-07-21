# Customer Zero - Complete Deployment Guide

## System Overview

Customer Zero is now a **fully integrated operational workbench** with:

- **8 Core Systems**: Capability Engine, Context Builder, OODA Buttons, Operating Calendar, Twin Memory, Workbenches, Templates, Lifecycle Events
- **65+ MCP Tools**: All integrated across 13 categories
- **12 Department Hubs**: Sales, CSM, Support, Marketing, Finance, Product, Engineering, Ops, AI/Twin, Knowledge, Security, HR
- **27 Lifecycle Categories**: Covering all business operations from lead generation to knowledge capture
- **4 OODA Buttons**: Store in Spine → Ask Your Twin → Assign Your Twin → Approve Action

## Environment Variables Setup

### 1. Authentication (Required)
```bash
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

### 2. Database (Required)
```bash
DATABASE_URL=postgresql://...
SUPABASE_URL=https://....supabase.co
SUPABASE_ANON_KEY=eyJhbG...
REDIS_URL=redis://...  # Optional but recommended for cache
```

### 3. Coda Integration (Recommended)
```bash
CODA_API_TOKEN=...
CODA_WORKSPACE_ID=ws-...
```

### 4. CRM Tools (Recommended)
```bash
SALESFORCE_CLIENT_ID=...
SALESFORCE_CLIENT_SECRET=...
HUBSPOT_API_KEY=...
PIPEDRIVE_API_TOKEN=...
```

### 5. AI/LLM (Recommended)
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
AI_GATEWAY_API_KEY=... # Vercel AI Gateway
FAL_API_KEY=...        # Image generation
```

### 6. Communication (Recommended)
```bash
SLACK_BOT_TOKEN=xoxb-...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

### 7. Cloud Infrastructure (Recommended)
```bash
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
```

### 8. Monitoring & Analytics (Optional)
```bash
SENTRY_DSN=...
POSTHOG_API_KEY=...
```

## Deployment Steps

### Step 1: Configure Environment Variables

All variables are validated at runtime via `/lib/secrets/cloudflare-kv.ts`

```bash
# Check which secrets are missing
npm run validate-secrets
```

### Step 2: Set Up Databases

```sql
-- Spine Schema (Supabase/Postgres)
-- Templates, capabilities, entities, continuity records

-- Twin Memory Schema
-- Session logs, audit logs, memory vectors, context cache

-- Sync State Schema
-- Tool sync cursors, pending mutations, DLQ records
```

### Step 3: Deploy to Vercel

```bash
# Push to your connected repository
git add .
git commit -m "Customer Zero deployment"
git push origin main

# Vercel automatically builds and deploys
# Monitor: https://vercel.com/your-team/customer-zero
```

### Step 4: Run Initial Sync

After deployment, trigger the initial sync:

```bash
# Sync Coda docs into Spine
curl -X POST https://your-deployment.vercel.app/api/integrations/coda/sync

# Sync Salesforce data
curl -X POST https://your-deployment.vercel.app/api/connectors/salesforce/sync
```

## MCP Tool Categories

The system includes **65+ tools** across these categories:

### Sales Tools (8)
- Salesforce, HubSpot, Pipedrive, Dynamics 365, Zoho CRM, Freshsales, SugarCRM, Copper

### Support Tools (7)
- Zendesk, Freshdesk, Intercom, Help Scout, Gorgias, Jira Service Desk, Groove

### Communication Tools (6)
- Slack, Discord, Teams, Email (SMTP/IMAP), Twilio, SendGrid

### Project Management (6)
- Jira, Asana, Monday.com, ClickUp, Trello, Notion

### Development Tools (8)
- GitHub, GitLab, Bitbucket, Linear, Vercel, Heroku, Datadog, Sentry

### Product & Analytics (6)
- Amplitude, Mixpanel, PostHog, Segment, Google Analytics, Heap

### Finance & Billing (5)
- Stripe, QuickBooks, Xero, Chargebee, Plaid

### Marketing & Content (6)
- Mailchimp, Klaviyo, Facebook Ads, Google Ads, HubSpot Marketing, Content Calendar

### Design & Collaboration (5)
- Figma, Adobe XD, Miro, Confluence, Coda

### AI & ML (7)
- OpenAI, Anthropic Claude, Cohere, Hugging Face, fal.ai, Deep Infra, LlamaIndex

### Storage & Data (5)
- Supabase, Firebase, MongoDB, Airtable, Snowflake

### Media & Hosting (5)
- Cloudinary, AWS S3, Cloudflare R2, YouTube, Vimeo

### Compliance & Security (4)
- Okta, JumpCloud, HashiCorp Vault, Wiz

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      USER WORKBENCH                         │
│         (Department-specific operational hub)               │
├─────────────────────────────────────────────────────────────┤
│  OODA Buttons: Store → Ask → Assign → Approve              │
├─────────────────────────────────────────────────────────────┤
│              CAPABILITY FABRIC                              │
│  ┌─────────┬──────────┬─────────┬──────────┬──────────┐    │
│  │Tool→Tool│ Memory   │   MCP   │ Agent→   │ Local/   │    │
│  │         │ Fetch    │         │ Agent    │ API      │    │
│  └─────────┴──────────┴─────────┴──────────┴──────────┘    │
├─────────────────────────────────────────────────────────────┤
│                  MCP POOL (65+ Tools)                       │
│  Sales · Support · Comms · Projects · Dev · Product       │
│  Finance · Marketing · Design · AI · Data · Media         │
├─────────────────────────────────────────────────────────────┤
│              ADAPTIVE SPINE (SSOT)                          │
│  ┌──────────┬──────────┬──────────┬──────────┐              │
│  │ Entities │ Twin     │ Session  │ Audit    │              │
│  │ Relations│ Memory   │ Logs     │ Logs     │              │
│  └──────────┴──────────┴──────────┴──────────┘              │
├─────────────────────────────────────────────────────────────┤
│              RUNTIME INFRASTRUCTURE                         │
│  Database · Cache · Blobs · Vector Store · Message Queue  │
└─────────────────────────────────────────────────────────────┘
```

## Workbench Surface Examples

### Sales Workbench
- Composed fields: Deal size, stage, probability, account health
- Connected tools: Salesforce, Gmail, HubSpot, Slack, Calendly
- Capabilities: Create deal, update pipeline, send email, schedule meeting
- Lifecycles: Deal creation, renewal, expansion

### CSM Workbench
- Composed fields: Account health, NRR, engagement, support tickets
- Connected tools: Salesforce, Zendesk, Intercom, GitHub, Slack
- Capabilities: Create task, escalate issue, send message, approve renewal
- Lifecycles: Onboarding, health tracking, renewal

### Engineering Workbench
- Composed fields: PR status, test coverage, deployment status, incidents
- Connected tools: GitHub, Jira, Datadog, Sentry, Vercel
- Capabilities: Deploy, create issue, escalate incident, merge PR
- Lifecycles: Code review, deployment, monitoring

## Operations

### Health Checks

```bash
# Check system health
curl https://your-deployment.vercel.app/health

# Validate all secrets are set
npm run validate-secrets

# Check MCP tool connectivity
npm run test-mcp-tools
```

### Monitoring

- **Errors**: Sentry integration tracks all errors
- **Performance**: Datadog tracks latency and throughput
- **Usage**: PostHog tracks feature adoption
- **Audit**: Twin Audit Logs track all actions and approvals

### Scaling

- **Database**: Supabase Postgres auto-scales
- **Cache**: Redis for hot entity 360 and continuity bundles
- **Queues**: Bull for async Twin inference and sync jobs
- **CDN**: Vercel Edge Network for global distribution

## Next Steps

1. **Populate Templates**: Create instances for each department
2. **Configure Connectors**: Connect your actual tools via OAuth
3. **Train Twin**: Build specialized agents for each domain
4. **Set Approvals**: Define authorization policies per capability
5. **Enable Webhooks**: Real-time sync from connected systems
6. **Monitor Adoption**: Track workbench usage per department

## Support

- Architecture questions: See `/CUSTOMER_ZERO_IMPLEMENTATION_MAP.md`
- MCP Tool catalog: See `/lib/integrations/mcp-pool.ts`
- Capability definitions: See `/lib/core/capability-registry/registry.ts`
- Runtime contracts: See `/AI-Action-Buttons-(2).md`

---

**Customer Zero is now production-ready. Deploy with confidence.**
