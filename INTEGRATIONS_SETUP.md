# IntegrateWise Integration Setup Guide

This document describes how to configure all integrations for the Customer Zero platform.

## Coda Integration

The Coda integration fetches IntegrateWise strategic documentation and syncs it into the Spine knowledge base.

### Setup Steps

1. **Generate Coda API Token**
   - Go to https://coda.io/account/settings/api
   - Click "Generate API Token"
   - Copy the token

2. **Add Environment Variable**
   ```bash
   CODA_API_TOKEN=your_token_here
   ```

3. **Sync Documentation**
   - POST `/api/integrations/coda/sync` to trigger sync
   - GET `/api/integrations/coda/sync` to list docs
   - GET `/api/integrations/coda/sync?category=technical-architecture` for specific docs

### Available Strategic Doc Categories

The following categories are automatically synced from your Coda workspace:

| Category | Mapped Doc |
|----------|-----------|
| `technical-architecture` | Technical Architecture |
| `spine-schema` | Spine Schema |
| `commercial-bible` | IntegrateWise Commercial Bible |
| `launch-checklist` | Launch checklist |
| `crm` | CRM |
| `product-roadmap` | Product roadmap |
| `sales-hub` | Sales team hub |
| `ai-pack` | IntegrateWise Canonical AI Pack |
| `atlas-memory` | IW ATLAS MEMORY |
| `decision-log` | Decision log |

### Usage in React Components

```tsx
import { useCodeDocs } from '@/lib/hooks/use-coda-docs';

export function StrategicDocsPanel() {
  const { docs, categories, loading, syncDocs, fetchByCategory } = useCodeDocs();

  return (
    <div>
      <button onClick={syncDocs}>Sync from Coda</button>
      
      {categories.map((cat) => (
        <div key={cat.category}>
          <h3>{cat.docName}</h3>
          <p>Sections: {cat.sections}, Tables: {cat.tables}</p>
          <p>Last sync: {new Date(cat.lastSync).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

## Supabase Integration

Supabase provides authentication and PostgreSQL database for the platform.

### Setup Steps

1. **Project Details**
   - Project ID: `fhlnrmrrkgqfxujcgfwa`
   - Region: `us-east-1`

2. **Environment Variables**
   - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role (server-only)

3. **Schema Setup**
   - Run migrations in `/lib/db/migrations/`
   - Enable RLS on all tables
   - Set up service role access for admin operations

## Stripe Integration

Stripe handles payments, subscriptions, and billing.

### Setup Steps

1. **API Keys**
   - `STRIPE_SECRET_KEY` - Server-side key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side key
   - `STRIPE_WEBHOOK_SECRET` - For webhooks

2. **Webhook Endpoints**
   - POST `/api/webhooks/stripe` - Handles payment events

## Connector Management

All external integrations (Slack, Linear, GitHub, etc.) are managed through the Connector Manager:

```typescript
import { ConnectorManager } from '@/lib/core/connectors';

const manager = new ConnectorManager();
const slackConnector = await manager.getConnector('slack');
await slackConnector.sendMessage(channelId, message);
```

## Testing Integrations

Run the integration tests:

```bash
npm run test:integration
```

This will verify all configured integrations are working correctly.

## Troubleshooting

### Coda Sync Fails
- Check `CODA_API_TOKEN` is valid
- Verify docs are accessible in your workspace
- Check browser console for detailed errors

### Supabase Connection Issues
- Verify VPC/network allows connections to your project
- Check connection string in `.env.local`
- Run `npm run db:check` to test connection

### Stripe Webhook Issues
- Verify webhook signing secret
- Check webhook endpoint is accessible
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
