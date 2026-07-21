'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenantConnectors, useDeleteConnector } from '@/lib/hooks/use-connectors'
import { Loader, Trash2, Edit2, Plus } from 'lucide-react'
import type { TenantConnector } from '@/lib/types/connectors'

export default function ConnectorsPage() {
  const { connectors, isLoading, error } = useTenantConnectors()
  const { delete: deleteConnector, isLoading: isDeleting } = useDeleteConnector()
  const [selectedConnector, setSelectedConnector] = useState<TenantConnector | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async (connectorId: string) => {
    if (await deleteConnector(connectorId)) {
      setShowDeleteConfirm(false)
      setSelectedConnector(null)
    }
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/10 text-green-700 border-green-500/20',
    beta: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    deprecated: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    planned: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
    sunset: 'bg-red-500/10 text-red-700 border-red-500/20',
    retired: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
        <h1 className="text-3xl font-bold mt-1">Connectors & Integrations</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage tenant-level connectors shared across all workbenches
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {connectors.length} connector{connectors.length !== 1 ? 's' : ''}
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Connector
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : connectors.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No connectors configured yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add your first connector to enable integrations
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {connectors.map((connector) => (
            <Card key={connector.id} className="p-4 hover:border-primary/50 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{connector.name}</h3>
                    <Badge className={statusColors[connector.status] || statusColors.active}>
                      {connector.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {connector.description || connector.provider}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>Provider: {connector.provider}</span>
                    <span>Type: {connector.integrationType}</span>
                    <span>Auth: {connector.authType}</span>
                    {connector.lastTestedAt && (
                      <span>
                        Last tested: {new Date(connector.lastTestedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-700 hover:text-red-700"
                    onClick={() => {
                      setSelectedConnector(connector)
                      setShowDeleteConfirm(true)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showDeleteConfirm && selectedConnector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm">
            <h2 className="font-semibold text-lg">Delete Connector?</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete {selectedConnector.name}? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedConnector.id)}
                disabled={isDeleting}
                className="gap-2"
              >
                {isDeleting && <Loader className="w-4 h-4 animate-spin" />}
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
