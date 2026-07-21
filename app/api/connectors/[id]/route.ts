/**
 * Individual Connector Routes
 * 
 * GET /api/connectors/[id] - Get a specific connector
 * PATCH /api/connectors/[id] - Update a connector
 * DELETE /api/connectors/[id] - Delete a connector
 */

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { TenantConnector } from '@/lib/types/connectors'

// Mock storage (in production: Supabase)
const mockConnectors: Record<string, TenantConnector[]> = {}

async function getTenantId(): Promise<string> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return `tenant_${userId}`
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = await getTenantId()
    const { id } = await params

    const connectors = mockConnectors[tenantId] || []
    const connector = connectors.find((c) => c.id === id)

    if (!connector) {
      return NextResponse.json(
        { success: false, error: 'Connector not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { connector },
    })
  } catch (error) {
    console.error('[v0] GET /api/connectors/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch connector' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = await getTenantId()
    const { id } = await params
    const body = await request.json()

    if (!mockConnectors[tenantId]) {
      mockConnectors[tenantId] = []
    }

    const connectors = mockConnectors[tenantId]
    const index = connectors.findIndex((c) => c.id === id)

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Connector not found' },
        { status: 404 }
      )
    }

    // Update connector
    const updated = {
      ...connectors[index],
      ...body,
      id: connectors[index].id, // Preserve ID
      tenantId: connectors[index].tenantId, // Preserve tenant
      updatedAt: Date.now(),
      version: (connectors[index].version || 0) + 1,
    }

    connectors[index] = updated

    return NextResponse.json({
      success: true,
      data: { connector: updated },
    })
  } catch (error) {
    console.error('[v0] PATCH /api/connectors/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update connector' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = await getTenantId()
    const { id } = await params

    if (!mockConnectors[tenantId]) {
      return NextResponse.json(
        { success: false, error: 'Connector not found' },
        { status: 404 }
      )
    }

    const connectors = mockConnectors[tenantId]
    const index = connectors.findIndex((c) => c.id === id)

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Connector not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting status to 'retired'
    connectors[index].status = 'retired'
    connectors[index].updatedAt = Date.now()

    return NextResponse.json({
      success: true,
      data: { deleted: true },
    })
  } catch (error) {
    console.error('[v0] DELETE /api/connectors/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete connector' },
      { status: 500 }
    )
  }
}
