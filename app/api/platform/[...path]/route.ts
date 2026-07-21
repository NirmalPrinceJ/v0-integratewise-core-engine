/**
 * Platform API Proxy
 * Forwards requests to IntegrateWise Gateway with auth headers
 */

import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = 'https://gateway.dev.integratewise.ai';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathSegments = params.path || [];
    const pathname = '/' + pathSegments.join('/');

    const url = new URL(pathname, GATEWAY_URL);
    url.search = request.nextUrl.search;

    const token = request.headers.get('Authorization');
    const tenantId = request.headers.get('x-tenant-id');

    if (!token || !tenantId) {
      return NextResponse.json(
        { error: 'Missing authorization headers' },
        { status: 401 }
      );
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': token,
        'x-tenant-id': tenantId,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[v0] Platform proxy error:', error);
    return NextResponse.json(
      { error: 'Platform request failed' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathSegments = params.path || [];
    const pathname = '/' + pathSegments.join('/');

    const url = new URL(pathname, GATEWAY_URL);

    const token = request.headers.get('Authorization');
    const tenantId = request.headers.get('x-tenant-id');

    if (!token || !tenantId) {
      return NextResponse.json(
        { error: 'Missing authorization headers' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': token,
        'x-tenant-id': tenantId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[v0] Platform proxy error:', error);
    return NextResponse.json(
      { error: 'Platform request failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathSegments = params.path || [];
    const pathname = '/' + pathSegments.join('/');

    const url = new URL(pathname, GATEWAY_URL);

    const token = request.headers.get('Authorization');
    const tenantId = request.headers.get('x-tenant-id');

    if (!token || !tenantId) {
      return NextResponse.json(
        { error: 'Missing authorization headers' },
        { status: 401 }
      );
    }

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'x-tenant-id': tenantId,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[v0] Platform proxy error:', error);
    return NextResponse.json(
      { error: 'Platform request failed' },
      { status: 500 }
    );
  }
}
