/**
 * Authentication utilities for IntegrateWise
 * Handles JWT tokens, session management, and tenant resolution
 */

const STORAGE_KEY_TOKEN = 'iw_api_token'
const STORAGE_KEY_TENANT = 'iw_tenant_id'
const STORAGE_KEY_USER = 'iw_user_id'

export interface AuthSession {
  token: string
  tenantId: string
  userId?: string
  expiresAt?: number
}

/**
 * Get stored authentication session
 */
export function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem(STORAGE_KEY_TOKEN)
  const tenantId = localStorage.getItem(STORAGE_KEY_TENANT)
  const userId = localStorage.getItem(STORAGE_KEY_USER)

  if (!token || !tenantId) return null

  return { token, tenantId, userId: userId || undefined }
}

/**
 * Store authentication session
 */
export function storeSession(session: AuthSession): void {
  if (typeof window === 'undefined') return

  localStorage.setItem(STORAGE_KEY_TOKEN, session.token)
  localStorage.setItem(STORAGE_KEY_TENANT, session.tenantId)
  if (session.userId) {
    localStorage.setItem(STORAGE_KEY_USER, session.userId)
  }
}

/**
 * Clear stored session
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(STORAGE_KEY_TOKEN)
  localStorage.removeItem(STORAGE_KEY_TENANT)
  localStorage.removeItem(STORAGE_KEY_USER)
}

/**
 * Check if session is valid
 */
export function isSessionValid(session: AuthSession | null): boolean {
  if (!session || !session.token || !session.tenantId) return false

  // If expiry is set, check if token is expired
  if (session.expiresAt && Date.now() > session.expiresAt) {
    return false
  }

  return true
}

/**
 * Parse JWT token to get expiry time
 */
export function parseJwt(token: string): { exp?: number; [key: string]: any } {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to parse JWT:', error)
    return {}
  }
}

/**
 * Get OAuth authorize URL
 */
export function getOAuthUrl(
  baseUrl: string = 'https://gateway.dev.integratewise.ai',
  provider: string = 'google'
): string {
  return `${baseUrl}/api/v1/auth/descope?provider=${provider}`
}

/**
 * Extract token and tenant from OAuth callback URL
 */
export function extractAuthFromCallback(url: string): AuthSession | null {
  try {
    const urlObj = new URL(url)
    const token = urlObj.searchParams.get('token')
    const tenantId = urlObj.searchParams.get('tenant_id') || urlObj.searchParams.get('tenantId')
    const userId = urlObj.searchParams.get('user_id') || urlObj.searchParams.get('userId')

    if (!token || !tenantId) return null

    return { token, tenantId, userId: userId || undefined }
  } catch (error) {
    console.error('Failed to extract auth from callback:', error)
    return null
  }
}

/**
 * Refresh token if close to expiry
 */
export async function refreshTokenIfNeeded(
  session: AuthSession,
  baseUrl: string = 'https://gateway.dev.integratewise.ai'
): Promise<AuthSession | null> {
  if (!session.expiresAt) return session

  const timeUntilExpiry = session.expiresAt - Date.now()
  const REFRESH_THRESHOLD = 5 * 60 * 1000 // Refresh if within 5 minutes of expiry

  if (timeUntilExpiry > REFRESH_THRESHOLD) {
    return session
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.token}`,
        'x-tenant-id': session.tenantId,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    const newSession: AuthSession = {
      token: data.token || session.token,
      tenantId: session.tenantId,
      userId: session.userId,
    }

    if (data.token) {
      const parsed = parseJwt(data.token)
      if (parsed.exp) {
        newSession.expiresAt = parsed.exp * 1000
      }
    }

    return newSession
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return null
  }
}
