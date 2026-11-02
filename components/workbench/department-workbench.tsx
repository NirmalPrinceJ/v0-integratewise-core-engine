'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Plus,
  Clock,
  Eye,
  Compass,
  Brain,
  Zap,
} from 'lucide-react'
import { getDepartment } from '@/lib/platform/departments'
import type { DepartmentId } from '@/lib/platform/departments'
import {
  addOperatingItem,
  recordOoda,
  useOperatingFlow,
  type OodaAction,
} from '@/lib/platform/operating-flow'

interface DepartmentWorkbenchProps {
  departmentId: DepartmentId
  onOODAAction?: (action: OodaAction) => void
}

export function DepartmentWorkbench({
  departmentId,
  onOODAAction,
}: DepartmentWorkbenchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('items')
  const [lastOutcome, setLastOutcome] = useState<string | null>(null)
  const { items, events } = useOperatingFlow()

  const dept = getDepartment(departmentId)
  const IconComponent = dept ? require('lucide-react')[dept.icon] || Clock : Clock

  const departmentItems = useMemo(() => {
    if (!dept) return []
    const allowed = new Set(dept.primaryEntities)
    return items.filter((entry) => {
      if (!allowed.has(entry.type)) return false
      if (!searchQuery) return true
      const haystack = `${entry.data.name} ${entry.data.summary}`.toLowerCase()
      return haystack.includes(searchQuery.toLowerCase())
    })
  }, [dept, items, searchQuery])

  useEffect(() => {
    setSelectedEntity(departmentItems[0]?.id ?? null)
    setLastOutcome(null)
  }, [departmentId])

  if (!dept) return <div className="p-6">Department not found</div>

  const selected = departmentItems.find((entry) => entry.id === selectedEntity) ?? departmentItems[0] ?? null
  const departmentEvents = events.filter((event) =>
    departmentItems.some((entry) => entry.id === event.entityId) || event.entityId === selected?.id,
  )

  const stats = {
    total: departmentItems.length,
    active: departmentItems.filter((entry) => entry.data.status === 'active' || entry.data.status === 'open').length,
  }

  function runAction(action: OodaAction) {
    if (!selected) return
    const verb = dept.ooodaActions[action]
    const detail = `${verb} — ${selected.data.name}. ${selected.data.summary}`
    recordOoda(selected.id, action, detail)
    setLastOutcome(detail)
    setActiveTab('timeline')
    onOODAAction?.(action)
  }

  function createItem() {
    const type = dept.primaryEntities[0] || 'task'
    const created = addOperatingItem(
      type,
      `New ${type.replace('_', ' ')}`,
      `Opened from the ${dept.name} workbench.`,
    )
    setSelectedEntity(created.id)
    setSearchQuery('')
    setActiveTab('items')
    setLastOutcome(`Created ${created.data.name}. Select an OODA action to continue.`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <IconComponent className="h-4 w-4 shrink-0" style={{ color: dept.color }} />
              <h1 className="truncate text-base font-semibold">{dept.name}</h1>
              <span className="hidden text-xs text-muted-foreground sm:inline">{stats.total} items · {stats.active} active</span>
            </div>
          </div>
          <div className="relative w-56 shrink-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button size="sm" onClick={createItem}>
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="items">Items ({departmentItems.length})</TabsTrigger>
              <TabsTrigger value="signals">Twin Signals</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Card className="p-6">
                <h3 className="mb-2 font-semibold">Department Overview</h3>
                <div className="flex flex-col gap-3 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Primary Entities</p>
                    <p className="mt-1">{dept.primaryEntities.join(', ')}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Selected item</p>
                    <p className="mt-1">{selected ? selected.data.name : 'None yet'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">OODA Cycle</p>
                    <div className="mt-2 flex flex-col gap-1 text-xs leading-relaxed">
                      <p><strong>Observe:</strong> {dept.ooodaActions.observe}</p>
                      <p><strong>Orient:</strong> {dept.ooodaActions.orient}</p>
                      <p><strong>Decide:</strong> {dept.ooodaActions.decide}</p>
                      <p><strong>Act:</strong> {dept.ooodaActions.act}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="mt-4">
              {departmentItems.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No items match this department.</p>
                </Card>
              ) : (
                <div className="flex flex-col gap-2">
                  {departmentItems.map((entity) => (
                    <Card
                      key={entity.id}
                      className={`cursor-pointer p-4 transition hover:bg-accent ${
                        selected?.id === entity.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedEntity(entity.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{entity.data.name}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{entity.data.summary}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {entity.type} · {new Date(entity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                          {entity.data.status}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="signals" className="mt-4">
              <Card className="p-6">
                <h3 className="mb-2 font-semibold">Twin Signals</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selected
                    ? `${selected.data.name} is the current focus. ${selected.data.summary}`
                    : `No item selected in ${dept.name}.`}
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Activity Timeline</h3>
                {departmentEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Select an item and run Observe, Orient, Decide, or Act.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {departmentEvents.map((event) => (
                      <div key={event.id} className="flex gap-3 border-b border-border pb-3 last:border-0">
                        <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                        <div className="min-w-0 flex-1 text-sm">
                          <p className="font-medium capitalize">{event.action} · {event.entityName}</p>
                          <p className="mt-1 leading-relaxed text-muted-foreground">{event.detail}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{new Date(event.at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="sticky bottom-0 z-40 border-t border-border bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mb-3 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            {selected ? `Acting on ${selected.data.name}` : 'Create or select an item to run the loop'}
          </p>
          {lastOutcome ? <p className="text-sm leading-relaxed text-foreground">{lastOutcome}</p> : null}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <OODAButton icon={<Eye className="h-5 w-5" />} label="Observe" description={dept.ooodaActions.observe} disabled={!selected} onClick={() => runAction('observe')} />
          <OODAButton icon={<Compass className="h-5 w-5" />} label="Orient" description={dept.ooodaActions.orient} disabled={!selected} onClick={() => runAction('orient')} />
          <OODAButton icon={<Brain className="h-5 w-5" />} label="Decide" description={dept.ooodaActions.decide} disabled={!selected} onClick={() => runAction('decide')} />
          <OODAButton icon={<Zap className="h-5 w-5" />} label="Act" description={dept.ooodaActions.act} disabled={!selected} onClick={() => runAction('act')} />
        </div>
      </div>
    </div>
  )
}

interface OODAButtonProps {
  icon: ReactNode
  label: string
  description: string
  disabled?: boolean
  onClick?: () => void
}

function OODAButton({ icon, label, description, disabled, onClick }: OODAButtonProps) {
  return (
    <Button
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className="h-auto whitespace-normal px-2 py-3"
    >
      <span className="flex flex-col items-center gap-1">
        <span className="text-primary">{icon}</span>
        <span className="text-xs font-semibold">{label}</span>
        <span className="line-clamp-2 text-center text-xs leading-snug text-muted-foreground">{description}</span>
      </span>
    </Button>
  )
}
