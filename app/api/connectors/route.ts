/**
 * Tenant-Scoped Connector API Routes
 * 
 * GET /api/connectors - List all connectors for a tenant
 * POST /api/connectors - Create a new connector
 */

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { TenantConnector } from '@/lib/types/connectors'

// In production, these would come from Supabase
const mockConnectors: Record<string, TenantConnector[]> = {}

async function getTenantId(): Promise<string> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  // In production, resolve tenant from user context
  return `tenant_${userId}`
}

export async function GET(request: Request) {
  try {
    const tenantId = await getTenantId()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const provider = searchParams.get('provider')

    let connectors = mockConnectors[tenantId] || []

    if (status) {
      connectors = connectors.filter((c) => c.status === status)
    }
    if (provider) {
      connectors = connectors.filter((c) => c.provider === provider)
    }

    return NextResponse.json({
      success: true,
      data: {
        connectors,
        total: connectors.length,
      },
    })
  } catch (error) {
    console.error('[v0] GET /api/connectors error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch connectors' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const tenantId = await getTenantId()
    const body = await request.json()

    const newConnector: TenantConnector = {
      id: `conn_${Date.now()}`,
      tenantId,
      canonicalId: `canon_${Date.now()}`,
      version: 1,
      name: body.name,
      description: body.description,
      provider: body.provider,
      product: body.product,
      vendor: body.vendor,
      integrationType: body.integrationType || 'REST',
      protocol: body.protocol || 'HTTPS',
      baseUrl: body.baseUrl,
      authType: body.authType || 'oauth2',
      status: body.status || 'active',
      credentials: body.credentials || {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: body.createdBy,
      ownerTeam: body.ownerTeam,
    }

    if (!mockConnectors[tenantId]) {
      mockConnectors[tenantId] = []
    }
    mockConnectors[tenantId].push(newConnector)

    return NextResponse.json({
      success: true,
      data: {
        connector: newConnector,
      },
    })
  } catch (error) {
    console.error('[v0] POST /api/connectors error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create connector' },
      { status: 500 }
    )
  }
}
