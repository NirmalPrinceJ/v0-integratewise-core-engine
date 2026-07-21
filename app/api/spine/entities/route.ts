import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/spine/entities
 * List all entities from the Spine
 *
 * Query params:
 * - type?: string - Filter by entity type
 * - limit?: number - Limit results (default 50)
 * - offset?: number - Pagination offset (default 0)
 * - search?: string - Search query
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 500)
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')

    // TODO: Replace with actual Supabase query
    // For now, return mock data structure
    const mockEntities = [
      {
        id: 'acc-001',
        type: 'account',
        name: 'Acme Corporation',
        data: {
          industry: 'Technology',
          annualRevenue: 5000000,
          employees: 250,
          status: 'active',
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user-001',
      },
      {
        id: 'contact-001',
        type: 'contact',
        name: 'Jane Smith',
        data: {
          email: 'jane@acme.com',
          role: 'CTO',
          phone: '+1-555-0100',
        },
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'user-002',
      },
      {
        id: 'deal-001',
        type: 'deal',
        name: 'Acme Enterprise License',
        data: {
          stage: 'proposal',
          value: 250000,
          expectedClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          probability: 0.75,
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'user-001',
      },
    ]

    const filtered = type ? mockEntities.filter((e) => e.type === type) : mockEntities
    const paginated = filtered.slice(offset, offset + limit)

    return NextResponse.json({
      data: paginated,
      total: filtered.length,
      limit,
      offset,
      hasMore: offset + limit < filtered.length,
    })
  } catch (error) {
    console.error('Error fetching entities:', error)
    return NextResponse.json({ error: 'Failed to fetch entities' }, { status: 500 })
  }
}

/**
 * POST /api/spine/entities
 * Create a new entity in the Spine
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, name, data } = body

    if (!type || !name) {
      return NextResponse.json({ error: 'Missing required fields: type, name' }, { status: 400 })
    }

    // TODO: Replace with actual Supabase insert
    const newEntity = {
      id: `${type}-${Date.now()}`,
      type,
      name,
      data: data || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user-id',
    }

    return NextResponse.json(newEntity, { status: 201 })
  } catch (error) {
    console.error('Error creating entity:', error)
    return NextResponse.json({ error: 'Failed to create entity' }, { status: 500 })
  }
}
