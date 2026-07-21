import { NextResponse } from 'next/server'
import { gateway } from '@/lib/integratewise-gateway'

/**
 * GET /api/v1/health
 * Verify connection to IntegrateWise gateway
 */
export async function GET() {
  try {
    const response = await gateway.health()

    if (!response.success) {
      return NextResponse.json(
        {
          status: 'error',
          message: response.error,
          gateway: false,
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      status: 'ok',
      gateway: true,
      data: response.data,
    })
  } catch (error) {
    console.error('[health] Error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        gateway: false,
      },
      { status: 500 }
    )
  }
}
