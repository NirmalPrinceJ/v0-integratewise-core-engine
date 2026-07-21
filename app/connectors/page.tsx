'use client'

import { useEffect, useState } from 'react'
import { integrateWiseClient, ConnectorCatalogItem, ConnectorInstance } from '@/lib/client/integratewise'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Loader2, PlugZap } from 'lucide-react'

export default function ConnectorsPage() {
  const [catalog, setCatalog] = useState<ConnectorCatalogItem[]>([])
  const [installed, setInstalled] = useState<ConnectorInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [health, setHealth] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check health
        try {
          const healthResponse = await integrateWiseClient.health()
          setHealth(healthResponse.gateway)
        } catch (err) {
          setHealth(false)
          console.warn('Health check failed:', err)
        }

        // Load catalog and installed connectors
        const [catalogData, installedData] = await Promise.all([
          integrateWiseClient.getCatalog(),
          integrateWiseClient.listConnectors(),
        ])

        setCatalog(catalogData || [])
        setInstalled(installedData || [])
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load connectors'
        setError(message)
        console.error('Error loading connectors:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleDisconnect = async (connectorId: string) => {
    try {
      await integrateWiseClient.disconnectConnector(connectorId)
      setInstalled(installed.filter(c => c.id !== connectorId))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Connectors</h1>
          <p className="text-muted-foreground">Manage your IntegrateWise connectors and integrations</p>
        </div>

        {/* Health Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlugZap className="h-5 w-5" />
              Gateway Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {health === null ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking...</span>
              </div>
            ) : health ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span>Connected to IntegrateWise Gateway</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>Unable to connect to gateway</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Installed Connectors */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Installed Connectors ({installed.length})</h2>
            <p className="text-muted-foreground">Your active integrations</p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : installed.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No connectors installed yet. Browse the catalog below to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {installed.map(connector => (
                <Card key={connector.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {connector.name}
                          <Badge variant="secondary">{connector.status}</Badge>
                        </CardTitle>
                        <CardDescription>{connector.category}</CardDescription>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDisconnect(connector.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {connector.connectedAt && (
                      <p className="text-sm text-muted-foreground">
                        Connected: {new Date(connector.connectedAt).toLocaleDateString()}
                      </p>
                    )}
                    {connector.lastSyncAt && (
                      <p className="text-sm text-muted-foreground">
                        Last sync: {new Date(connector.lastSyncAt).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Catalog */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Connector Catalog ({catalog.length})</h2>
            <p className="text-muted-foreground">Available integrations you can add</p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading catalog...</span>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {catalog.map(connector => (
                <Card key={connector.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{connector.name}</CardTitle>
                        <CardDescription>{connector.category}</CardDescription>
                      </div>
                      <Badge variant={connector.status === 'connected' ? 'default' : 'outline'}>
                        {connector.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Auth Type</p>
                      <Badge variant="secondary" className="text-xs">
                        {connector.authType}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Flow Type</p>
                      <Badge variant="outline" className="text-xs">
                        Flow {connector.flowType}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Capabilities</p>
                      <div className="flex flex-wrap gap-1">
                        {connector.capabilities.slice(0, 3).map(cap => (
                          <Badge key={cap} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                        {connector.capabilities.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{connector.capabilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      variant={connector.status === 'connected' ? 'secondary' : 'default'}
                      disabled={connector.status === 'connected'}
                    >
                      {connector.status === 'connected' ? 'Connected' : 'Connect'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
