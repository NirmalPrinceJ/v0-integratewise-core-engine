'use client'

import { ReactNode, useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Plus,
  Filter,
  Clock,
  Users,
  TrendingUp,
  Eye,
  Compass,
  Brain,
  Zap,
} from 'lucide-react'
import { useSpineEntities } from '@/lib/hooks/use-spine'
import { getDepartment } from '@/lib/platform/departments'
import type { DepartmentId } from '@/lib/platform/departments'

interface DepartmentWorkbenchProps {
  departmentId: DepartmentId
  onOODAAction?: (action: 'observe' | 'orient' | 'decide' | 'act') => void
}

export function DepartmentWorkbench({
  departmentId,
  onOODAAction,
}: DepartmentWorkbenchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const dept = getDepartment(departmentId)
  if (!dept) return <div className="p-6">Department not found</div>

  // Load entities for all primary entity types
  const entityQueries = dept.primaryEntities.map(entityType => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const query = useSpineEntities(entityType)
    return { entityType, ...query }
  })

  const allEntities = useMemo(() => {
    return entityQueries.flatMap(q => 
      (q.entities || []).map(e => ({ ...e, category: q.entityType }))
    ).filter(e => !searchQuery || e.data.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [entityQueries, searchQuery])

  const stats = useMemo(() => {
    return {
      total: allEntities.length,
      today: allEntities.filter((e: any) => {
        const created = new Date(e.createdAt)
        const today = new Date()
        return created.toDateString() === today.toDateString()
      }).length,
      active: allEntities.filter((e: any) => e.data.status === 'active' || e.data.status === 'open').length,
    }
  }, [allEntities])

  // Get icon component
  const IconComponent = require('lucide-react')[dept.icon] || Clock

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
        <div className="space-y-4">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${dept.color}20` }}
              >
                <IconComponent 
                  className="w-6 h-6"
                  style={{ color: dept.color }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{dept.name}</h1>
                <p className="text-sm text-muted-foreground">{dept.description}</p>
              </div>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${dept.primaryEntities.join(', ')}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2">
            <QuickStat label="Today" value={stats.today} icon={<Clock className="w-4 h-4" />} />
            <QuickStat label="Total" value={stats.total} icon={<Users className="w-4 h-4" />} />
            <QuickStat label="Active" value={stats.active} icon={<TrendingUp className="w-4 h-4" />} />
            <QuickStat label="Brief Time" value={`${String(dept.defaultTimeslot).padStart(2, '0')}:00`} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="items">Items ({allEntities.length})</TabsTrigger>
              <TabsTrigger value="signals">Twin Signals</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Department Overview</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Primary Entities</p>
                    <p className="mt-1">{dept.primaryEntities.join(', ')}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Daily Brief</p>
                    <p className="mt-1">Every day at {String(dept.defaultTimeslot).padStart(2, '0')}:00 IST</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">OODA Cycle</p>
                    <div className="mt-2 space-y-1 text-xs">
                      <p><strong>Observe:</strong> {dept.ooodaActions.observe}</p>
                      <p><strong>Orient:</strong> {dept.ooodaActions.orient}</p>
                      <p><strong>Decide:</strong> {dept.ooodaActions.decide}</p>
                      <p><strong>Act:</strong> {dept.ooodaActions.act}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="space-y-2 mt-4">
              {entityQueries.some(q => q.isLoading) ? (
                <div className="text-center py-8 text-muted-foreground">Loading items...</div>
              ) : allEntities.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No items found</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {allEntities.map((entity: any) => (
                    <Card
                      key={entity.id}
                      className={`p-4 cursor-pointer hover:bg-accent transition ${
                        selectedEntity === entity.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedEntity(entity.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{entity.data.name || 'Untitled'}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {entity.category} • {new Date(entity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {entity.data.status && (
                          <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {entity.data.status}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="signals" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Twin Signals</h3>
                <p className="text-sm text-muted-foreground">
                  AI-generated signals from the Twin engine analyzing {dept.name.toLowerCase()} data
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Activity Timeline</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b last:border-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium">Activity item {i}</p>
                        <p className="text-xs text-muted-foreground mt-1">{i * 2} hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* OODA Action Buttons Footer */}
      <div className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
        <div className="grid grid-cols-4 gap-3">
          <OODAButton
            icon={<Eye className="w-5 h-5" />}
            label="Observe"
            description={dept.ooodaActions.observe}
            disabled={!selectedEntity}
            onClick={() => onOODAAction?.('observe')}
          />
          <OODAButton
            icon={<Compass className="w-5 h-5" />}
            label="Orient"
            description={dept.ooodaActions.orient}
            disabled={!selectedEntity}
            onClick={() => onOODAAction?.('orient')}
          />
          <OODAButton
            icon={<Brain className="w-5 h-5" />}
            label="Decide"
            description={dept.ooodaActions.decide}
            disabled={!selectedEntity}
            onClick={() => onOODAAction?.('decide')}
          />
          <OODAButton
            icon={<Zap className="w-5 h-5" />}
            label="Act"
            description={dept.ooodaActions.act}
            disabled={!selectedEntity}
            onClick={() => onOODAAction?.('act')}
          />
        </div>
      </div>
    </div>
  )
}

interface QuickStatProps {
  label: string
  value: string | number
  icon?: ReactNode
}

function QuickStat({ label, value, icon }: QuickStatProps) {
  return (
    <Card className="p-3 bg-muted/30 border-border hover:border-primary/50 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
        {icon && <div className="text-primary/60">{icon}</div>}
      </div>
    </Card>
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
      className={`h-auto py-3 flex flex-col items-center gap-1.5 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10'
      }`}
    >
      <div className="text-primary">{icon}</div>
      <span className="font-semibold text-xs">{label}</span>
      <span className="text-xs text-muted-foreground text-center leading-tight">{description}</span>
    </Button>
  )
}
