import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/spine/timeline
 * Get timeline of Spine mutations (audit log)
 *
 * Query params:
 * - entityId?: string - Filter by entity ID
 * - type?: string - Filter by event type
 * - limit?: number - Limit results (default 50)
 * - offset?: number - Pagination offset (default 0)
 * - startDate?: ISO string - Start date filter
 * - endDate?: ISO string - End date filter
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const entityId = searchParams.get('entityId')
    const type = searchParams.get('type')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 500)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Mock timeline events (in production, these come from Spine)
    const mockTimeline = [
      {
        id: 'timeline-001',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        entityId: 'acc-001',
        entityType: 'account',
        action: 'ENTITY_CREATED',
        title: 'Account created',
        description: 'New account "Acme Corporation" created',
        source: 'api',
        sourceId: 'user-001',
        metadata: {
          entityName: 'Acme Corporation',
          changes: { status: 'active' },
        },
      },
      {
        id: 'timeline-002',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        entityId: 'contact-001',
        entityType: 'contact',
        action: 'ENTITY_UPDATED',
        title: 'Contact updated',
        description: 'Contact "Jane Smith" information updated',
        source: 'api',
        sourceId: 'user-002',
        metadata: {
          entityName: 'Jane Smith',
          changes: { role: 'CTO', email: 'jane@acme.com' },
        },
      },
      {
        id: 'timeline-003',
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        entityId: 'deal-001',
        entityType: 'deal',
        action: 'ENTITY_CREATED',
        title: 'Deal created',
        description: 'New deal "Acme Enterprise License" created',
        source: 'twin',
        sourceId: 'agent-lead-qualifier',
        metadata: {
          entityName: 'Acme Enterprise License',
          value: 250000,
          confidence: 0.85,
        },
      },
      {
        id: 'timeline-004',
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        entityId: 'deal-001',
        entityType: 'deal',
        action: 'APPROVAL_GRANTED',
        title: 'Approval completed',
        description: 'Deal proposal approved by governance',
        source: 'governance',
        sourceId: 'user-001',
        metadata: {
          approvalLevel: 'manager',
          reason: 'Within authority limits',
        },
      },
      {
        id: 'timeline-005',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        entityId: 'github-deploy-001',
        entityType: 'deployment',
        action: 'DEPLOYMENT_STARTED',
        title: 'GitHub deployment',
        description: 'Production deployment initiated',
        source: 'capability',
        sourceId: 'cap-github-deploy',
        metadata: {
          repo: 'integratewise-core',
          branch: 'main',
          commit: 'abc123def',
        },
      },
      {
        id: 'timeline-006',
        timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
        entityId: 'ticket-001',
        entityType: 'ticket',
        action: 'ENTITY_CREATED',
        title: 'Support ticket routed',
        description: 'Customer support case assigned to team',
        source: 'connector',
        sourceId: 'zendesk-connector',
        metadata: {
          priority: 'high',
          assignee: 'support-team-1',
        },
      },
    ]

    const filtered = entityId
      ? mockTimeline.filter((e) => e.entityId === entityId)
      : type
        ? mockTimeline.filter((e) => e.action === type)
        : mockTimeline

    const paginated = filtered.slice(offset, offset + limit)

    return NextResponse.json({
      data: paginated,
      total: filtered.length,
      limit,
      offset,
      hasMore: offset + limit < filtered.length,
    })
  } catch (error) {
    console.error('Error fetching timeline:', error)
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 })
  }
}

/**
 * POST /api/spine/timeline
 * Create a new timeline entry (mutation event)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityId, entityType, action, title, description, metadata } = body

    if (!entityId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: entityId, action' },
        { status: 400 },
      )
    }

    // TODO: Replace with actual Supabase insert
    const newTimelineEntry = {
      id: `timeline-${Date.now()}`,
      timestamp: new Date().toISOString(),
      entityId,
      entityType,
      action,
      title: title || action,
      description: description || '',
      source: 'api',
      sourceId: 'current-user-id',
      metadata: metadata || {},
    }

    return NextResponse.json(newTimelineEntry, { status: 201 })
  } catch (error) {
    console.error('Error creating timeline entry:', error)
    return NextResponse.json({ error: 'Failed to create timeline entry' }, { status: 500 })
  }
}
