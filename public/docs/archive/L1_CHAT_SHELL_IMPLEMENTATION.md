# L1 Chat Shell: First-Class Chat Interface

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Context-Aware AI Chat with Spine Integration**

---

## Overview

The **L1 Chat Shell** is a first-class Next.js chat interface that:
- Has full context of user's Spine data (events, memory, entities)
- Routes intelligently to multiple AI models (GPT-4o, Claude 3, etc.)
- Generates actionable tasks from conversations
- Maintains thread history with memory scopes
- Syncs with OpenWebUI for multi-platform access
- Becomes the primary entry point for "ask AI about anything"

---

## Architecture

```
┌─────────────────────────────────────────┐
│  User Interface (Chat Shell)            │
│  • Thread management                    │
│  • Message display + formatting         │
│  • Context panel (Spine, Models, Memory)│
│  • Quick actions (Tasks, Summary, etc.) │
└──────────────────────┬──────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────┐
│  API Layer (/api/chat)                  │
│  • Message validation                   │
│  • Session authentication               │
│  • Request routing                      │
│  • Response formatting                  │
└──────────────────────┬──────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌─────────────┐
    │ Spine  │    │ Memory │    │ Core Engine │
    │ Events │    │ Scopes │    │ (AI Router) │
    └────────┘    └────────┘    └─────────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
        ┌─────────────────────────────┐
        │  Task Generation + Insights │
        └─────────────────────────────┘
```

---

## Files Added

### 1. **Page Route**
**Location:** `apps/web/app/(app)/chat/page.tsx`

- Entry point for the chat interface
- Validates user session (requires authentication)
- Passes user context to chat component
- Server-side rendering with dynamic content

### 2. **Chat Shell Component**
**Location:** `apps/web/components/views/chat-shell-view.tsx` (467 lines)

**Features:**
- **Thread Management**: Create, switch, delete conversations
- **Message Display**: User/assistant messages with rich formatting
- **Spine Context Panel**: Shows live connection status, memory scopes, AI models
- **Quick Actions**: Extract tasks, summarize, find connections
- **Multi-line Input**: Shift+Enter for long messages
- **Auto-scroll**: Messages auto-scroll to bottom
- **Message Metadata**: Sources, actions, suggested next steps

**Key Components:**
```typescript
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: string[]      // Where data came from
  actions?: string[]      // Suggested next steps
}

interface ChatThread {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}
```

### 3. **Chat API Route**
**Location:** `apps/web/app/api/chat/route.ts`

**Endpoints:**

```typescript
POST /api/chat
  Request: { messages: Message[], threadId, userId }
  Response: {
    role: "assistant"
    content: string
    sources: string[]           // Spine, Memory, Task Engine
    actions: string[]           // Create Task, Update Memory, etc.
    metadata: {
      threadId, userId, model, latency, tokensUsed
    }
  }

GET /api/chat?threadId=...&limit=50&offset=0
  Returns paginated chat history for a thread
```

**Flow:**
1. Validate user session (authentication required)
2. Query Spine for context (events, memory, entities)
3. Route to appropriate AI model based on query type
4. Generate response with sources + actions
5. Store in chat history (database)
6. Return to client with metadata

### 4. **Sidebar Navigation Update**
**Location:** `apps/web/components/sidebar.tsx`

Added "Chat with Spine" link to Core navigation section:
```typescript
{renderLink("/chat", <MessageSquare className="h-5 w-5" />, "Chat with Spine")}
```

---

## Integration with Core Engine

The Chat Shell connects to the **integratewise-core-engine** via:

```typescript
// 1. Event Ingestion
GET /events              // Get recent events from all sources
GET /events/:source      // Get events by source (Stripe, Slack, etc.)

// 2. AI Routing
POST /ai/route           // Route to appropriate model
                         // Input: event, context
                         // Output: task + insights

// 3. Task Generation
// Tasks from Core Engine displayed in Chat
// User can create tasks directly from chat responses

// 4. Memory Scopes
// Org, Work, Personal, Audit all accessible
// Chat maintains context across scopes
```

---

## Integration with Spine

The Chat Shell queries the Spine database for:

```sql
-- Recent events (all sources)
SELECT * FROM spine_events 
ORDER BY created_at DESC 
LIMIT 100;

-- Events by source
SELECT * FROM spine_events 
WHERE source = 'stripe' 
ORDER BY created_at DESC;

-- AI tasks generated
SELECT * FROM ai_tasks 
WHERE event_id IN (...)
ORDER BY created_at DESC;

-- Memory access
-- (scope: org, work, personal, audit)
```

---

## Context Awareness

### What the Chat Knows

1. **User Profile**
   - Name, email, tenant ID
   - Permissions + access control
   - Preferences + settings

2. **Recent Events** (Last 100)
   - Stripe payments
   - Slack mentions
   - GitHub PRs
   - Notion updates
   - HubSpot deals
   - + all other integrated sources

3. **Memory Scopes**
   - Org: Team insights, company goals
   - Work: Project context, goals
   - Personal: User reflections, goals
   - Audit: Compliance trail

4. **Generated Tasks**
   - From events (automated)
   - From conversations (manual)
   - Status + priority

### Example Queries

**"What are my top risks?"**
→ Queries Spine for negative events (churn, missed deals, errors)
→ Routes to GPT-4o (complex analysis)
→ Returns risks + suggested actions

**"Summarize this week"**
→ Gets all events from last 7 days
→ Extracts patterns + highlights
→ Routes to Claude 3 (fast + comprehensive)
→ Returns weekly summary

**"Extract tasks from my messages"**
→ Analyzes recent Slack/Discord messages
→ Identifies actionable items
→ Routes to GPT-4o-mini (task extraction)
→ Generates task objects + due dates

---

## OpenWebUI Sync

For OpenWebUI synchronization:

```typescript
// 1. Export Chat History
GET /api/chat/export?threadId=...
  Returns: Standard OpenWebUI format (JSONL)

// 2. Import from OpenWebUI
POST /api/chat/import
  Input: OpenWebUI thread format
  Action: Create thread in IntegrateWise

// 3. Real-time Sync
// WebSocket connection (optional)
// Keep chat history in sync across platforms
```

---

## Features & Use Cases

### 1. **Context-Aware Conversation**
- Chat remembers all events, memory, tasks
- Provides source citations for all statements
- Suggests next steps automatically

### 2. **Task Extraction**
- "Extract tasks from my last 10 messages"
- Auto-generates title, description, due date, priority
- Stores in task system

### 3. **Multi-Threading**
- Start new conversations
- Switch between threads
- Thread history preserved
- Quick search + filter

### 4. **Quick Actions**
```
• Extract Tasks       → Analyze content + generate tasks
• Summarize          → Condense long content
• Find Connections   → Link to related entities
• Draft Response     → AI drafts email/message
• Create Proposal    → Generate business proposal
```

### 5. **Spine Context Panel**
- Shows live Spine connection status
- Displays active memory scopes
- Shows which AI models are available
- Token usage + latency metrics

---

## Deployment

### Prerequisites
- Neon database with spine_events + ai_tasks tables
- Core Engine deployed (CF Workers)
- Authentication configured (Clerk)

### Environment Variables
```env
# Core Engine
CORE_ENGINE_API_URL=https://core-engine.integratewise.com
CORE_ENGINE_API_KEY=...

# Spine Database (via gateway)
SPINE_DATABASE_URL=...

# AI Models
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...

# OpenWebUI Sync (optional)
OPENWEBUI_API_URL=https://openwebui.integratewise.com
OPENWEBUI_API_KEY=...
```

### Build & Deploy
```bash
# Install dependencies
npm install

# Build
npm run build

# Type check
tsc --noEmit

# Deploy to Vercel
vercel deploy
```

---

## Future Enhancements

### Phase 1 (Current)
- [x] Basic chat interface
- [x] Thread management
- [x] Context panel (Spine info)
- [x] API routes (stubs)

### Phase 2 (Next)
- [ ] Wire Core Engine integration
- [ ] Add chat history persistence
- [ ] Implement task generation
- [ ] Add file upload support

### Phase 3 (Advanced)
- [ ] Voice input + output
- [ ] Image generation from chat
- [ ] Collaborative chats (multiple users)
- [ ] Chat analytics + insights
- [ ] OpenWebUI full sync

### Phase 4 (Enterprise)
- [ ] Custom instructions per user
- [ ] Chat guardrails + compliance
- [ ] Audit logging
- [ ] Rate limiting + quotas
- [ ] Multi-tenant isolation

---

## Integration Timeline

**Week 1: This Week**
- ✓ Chat Shell UI complete
- ✓ API routes scaffolded
- ✓ Sidebar navigation added

**Week 2**
- Wire Core Engine /events API
- Add Spine database queries
- Implement AI routing selection

**Week 3**
- Add chat history persistence
- Connect to task generation
- Implement memory scope access

**Week 4**
- Add file upload + processing
- Implement voice input
- Add analytics + metrics

---

## Technical Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 16 |
| Language | TypeScript | 5.0 |
| UI Library | shadcn/ui | Latest |
| Database | Neon Postgres | - |
| API | CF Workers | - |
| AI Models | Multi (OpenAI, Anthropic) | - |
| State | React hooks + component state | - |
| Styling | Tailwind CSS | Latest |

---

## Success Metrics

- Chat becomes primary entry point for AI queries
- 80%+ of users using chat weekly
- Average response time < 2 seconds
- User satisfaction > 4.5/5
- Task generation accuracy > 90%
- Spike in daily active users

---

*Implementation: L1 Chat Shell*
*Status: UI Complete, API Scaffolded, Ready for Core Engine Integration*
*Next: Wire Chat Shell to Core Engine (Week 2)*

