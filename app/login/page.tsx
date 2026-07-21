'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Chrome, LogIn, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import {
  getOAuthUrl,
  extractAuthFromCallback,
  storeSession,
  getStoredSession,
} from '@/lib/integratewise'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [manualAuth, setManualAuth] = useState(false)
  const [formData, setFormData] = useState({ token: '', tenantId: '' })
  const [error, setError] = useState('')

  // Check if already logged in
  useEffect(() => {
    const session = getStoredSession()
    if (session) {
      router.push('/app/work/dashboard')
    }
  }, [router])

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const tenantId = urlParams.get('tenant_id') || urlParams.get('tenantId')

    if (token && tenantId) {
      storeSession({ token, tenantId })
      router.push('/app/work/dashboard')
    }
  }, [router])

  const handleOAuthLogin = () => {
    setLoading(true)
    const oauthUrl = getOAuthUrl(
      'https://gateway.dev.integratewise.ai',
      'google'
    )
    window.location.href = oauthUrl
  }

  const handleManualAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.token || !formData.tenantId) {
      setError('Please provide both API token and tenant ID')
      return
    }

    try {
      setLoading(true)
      storeSession({
        token: formData.token,
        tenantId: formData.tenantId,
      })
      router.push('/app/work/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">iW</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">IntegrateWise</h1>
          <p className="text-muted-foreground">Sign in to your workspace</p>
        </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

        {/* OAuth Login */}
        <Card className="p-6 space-y-4">
          <Button
            onClick={handleOAuthLogin}
            disabled={loading}
            size="lg"
            className="w-full gap-2"
          >
            <Chrome className="w-4 h-4" />
            {loading ? 'Redirecting...' : 'Sign in with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setManualAuth(!manualAuth)}
            className="w-full"
          >
            Use API Token
          </Button>
        </Card>

        {/* Manual Auth Form */}
        {manualAuth && (
          <Card className="p-6 space-y-4">
            <form onSubmit={handleManualAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Token</label>
                <Input
                  type="password"
                  placeholder="Bearer token from IntegrateWise"
                  value={formData.token}
                  onChange={(e) =>
                    setFormData({ ...formData, token: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tenant ID</label>
                <Input
                  placeholder="Your workspace tenant ID"
                  value={formData.tenantId}
                  onChange={(e) =>
                    setFormData({ ...formData, tenantId: e.target.value })
                  }
                />
              </div>

              <Button type="submit" disabled={loading} size="lg" className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p>
            <Link href="/" className="text-primary hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
