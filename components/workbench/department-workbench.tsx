'use client'

import { ReactNode, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Clock,
  Users,
  TrendingUp,
} from 'lucide-react'
import type { SpineEntity, SpineEntityType } from '@/lib/types/spine'

interface DepartmentWorkbenchProps {
  department: string
  title: string
  description: string
  icon?: string
  color?: string
  activeEntity?: SpineEntity
  entityTypes: SpineEntityType[]
  children?: ReactNode
  onEntitySelect?: (entity: SpineEntity) => void
  onCreateEntity?: (type: string) => void
  onSearch?: (query: string) => void
}

export function DepartmentWorkbench({
  department,
  title,
  description,
  icon,
  color = '#3B82F6',
  activeEntity,
  entityTypes,
  children,
  onEntitySelect,
  onCreateEntity,
  onSearch,
}: DepartmentWorkbenchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{ borderTopColor: color }}
      >
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && <span className="text-2xl">{icon}</span>}
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => onCreateEntity?.('task')}
              >
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search entities, notes, contacts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2">
            <QuickStat label="Today" value="12" icon={<Clock className="w-4 h-4" />} />
            <QuickStat label="Team" value="8" icon={<Users className="w-4 h-4" />} />
            <QuickStat label="Trend" value="+15%" icon={<TrendingUp className="w-4 h-4" />} />
            <QuickStat label="Active" value="24" icon={<Badge className="w-4 h-4" />} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>

      {/* Footer - OODA Action Buttons */}
      <div className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
        <div className="grid grid-cols-4 gap-3">
          <OODAButton
            phase="OBSERVE"
            title="Store in Spine"
            description="Capture evidence and decisions"
            disabled={!activeEntity}
          />
          <OODAButton
            phase="ORIENT"
            title="Ask Your Twin"
            description="Query with context"
            disabled={!activeEntity}
          />
          <OODAButton
            phase="DECIDE"
            title="Assign Your Twin"
            description="Plan and propose"
            disabled={!activeEntity}
          />
          <OODAButton
            phase="ACT"
            title="Approve Action"
            description="Execute with governance"
            disabled={!activeEntity}
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
  phase: 'OBSERVE' | 'ORIENT' | 'DECIDE' | 'ACT'
  title: string
  description: string
  disabled?: boolean
  onClick?: () => void
}

function OODAButton({ phase, title, description, disabled, onClick }: OODAButtonProps) {
  const colors = {
    OBSERVE: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-400',
    ORIENT: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-700 dark:text-purple-400',
    DECIDE: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-400',
    ACT: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-400',
  }

  return (
    <Button
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className={`h-auto py-3 flex flex-col items-start gap-1 ${colors[phase]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="text-xs font-bold uppercase tracking-wide">{phase}</span>
      <span className="font-semibold text-sm">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </Button>
  )
}
