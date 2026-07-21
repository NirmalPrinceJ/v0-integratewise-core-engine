'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Search, CheckCircle2, AlertCircle, Clock, ExternalLink,
  Loader2, Unplug, Plug
} from 'lucide-react'
import { useConnectors } from '@/lib/hooks/use-gateway'
import type { IntegrationConnection } from '@/lib/integratewise/types'

const CATEGORY_ICONS: Record<string, string> = {
  crm: '🏢', communication: '💬', project: '📋',
  finance: '💰', analytics: '📊', storage: '📁',
  ai: '🤖', marketing: '📣', support: '🎧', default: '🔗',
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'active')
    return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 gap-1"><CheckCircle2 className="w-3 h-3"/>Connected</Badge>
  if (status === 'error')
    return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200 gap-1"><AlertCircle className="w-3 h-3"/>Error</Badge>
  return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 gap-1"><Clock className="w-3 h-3"/>Pending</Badge>
}

function ConnectorCard({ connector, onConnect, onDisconnect, connecting }: {
  connector: IntegrationConnection & { category?: string }
  onConnect: (provider: string) => void
  onDisconnect: (provider: string) => void
  connecting: string | null
}) {
  const icon = CATEGORY_ICONS[connector.category ?? 'default'] ?? CATEGORY_ICONS.default
  const isConnecting = connecting === connector.provider

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl flex-shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm capitalize truncate">{connector.provider}</p>
              {connector.last_sync && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Synced {new Date(connector.last_sync).toLocaleDateString()}
                </p>
              )}
              {connector.entities_synced != null && (
                <p className="text-xs text-muted-foreground">
                  {connector.entities_synced.toLocaleString()} records
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={connector.status} />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          {connector.status === 'active' ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => onDisconnect(connector.provider)}
              disabled={isConnecting}
            >
              <Unplug className="w-3 h-3" />Disconnect
            </Button>
          ) : (
            <Button
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => onConnect(connector.provider)}
              disabled={isConnecting}
            >
              {isConnecting
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <Plug className="w-3 h-3" />}
              {isConnecting ? 'Connecting…' : 'Connect'}
            </Button>
          )}
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs ml-auto">
            <ExternalLink className="w-3 h-3" />View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function IntegrationsView() {
  const { connectors, loading, error, connect, disconnect } = useConnectors()
  const [search, setSearch] = useState('')
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (provider: string) => {
    setConnecting(provider)
    try { await connect(provider) }
    catch (e) { console.error('[IntegrationsView] connect failed', e) }
    finally { setConnecting(null) }
  }

  const handleDisconnect = async (provider: string) => {
    setConnecting(provider)
    try { await disconnect(provider) }
    catch (e) { console.error('[IntegrationsView] disconnect failed', e) }
    finally { setConnecting(null) }
  }

  const filtered = connectors.filter(c =>
    !search || c.provider.toLowerCase().includes(search.toLowerCase())
  )
  const active    = filtered.filter(c => c.status === 'active')
  const inactive  = filtered.filter(c => c.status !== 'active')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Integrations</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {active.length} connected · tenant-level, shared across all surfaces
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search connectors…"
            className="pl-9"
          />
        </div>
      </div>

      {error && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="p-4 text-sm text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error} — check your Gateway connection.
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Connected ({active.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map(c => (
                  <ConnectorCard
                    key={c.id}
                    connector={c as any}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    connecting={connecting}
                  />
                ))}
              </div>
            </section>
          )}
          {inactive.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Available ({inactive.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactive.map(c => (
                  <ConnectorCard
                    key={c.id}
                    connector={c as any}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    connecting={connecting}
                  />
                ))}
              </div>
            </section>
          )}
          {filtered.length === 0 && (
            <div className="py-20 text-center text-sm text-muted-foreground">
              No connectors found. Try a different search.
            </div>
          )}
        </>
      )}
    </div>
  )
}
