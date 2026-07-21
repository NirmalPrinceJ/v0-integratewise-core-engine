'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AccountSuccessWorkbench } from './account-success-workbench'
import { SalesWorkbench } from './sales-workbench'
import { TwinSignalFeed } from './twin-signal-feed'
import { ChevronDown, Bell } from 'lucide-react'

const DEPARTMENTS = [
  {
    id: 'account-success',
    name: 'Account Success',
    icon: '🏢',
    color: '#3B82F6',
    description: 'Manage customer accounts, renewals, and health',
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: '💼',
    color: '#10B981',
    description: 'Manage deals, leads, and opportunities',
  },
  {
    id: 'support',
    name: 'Support',
    icon: '🎧',
    color: '#06B6D4',
    description: 'Handle customer support and tickets',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📢',
    color: '#8B5CF6',
    description: 'Manage campaigns and leads',
  },
  {
    id: 'product',
    name: 'Product',
    icon: '📦',
    color: '#F59E0B',
    description: 'Track features and feedback',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: '⚙️',
    color: '#EC4899',
    description: 'Manage issues and deployments',
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    color: '#059669',
    description: 'Manage invoices and payments',
  },
  {
    id: 'operations',
    name: 'Operations',
    icon: '📊',
    color: '#6366F1',
    description: 'Manage projects and tasks',
  },
]

export function WorkbenchRouter() {
  const [selectedDepartment, setSelectedDepartment] = useState('account-success')
  const [showDepartmentMenu, setShowDepartmentMenu] = useState(false)

  const currentDept = DEPARTMENTS.find((d) => d.id === selectedDepartment)

  const renderWorkbench = () => {
    switch (selectedDepartment) {
      case 'account-success':
        return <AccountSuccessWorkbench />
      case 'sales':
        return <SalesWorkbench />
      // Other departments would be implemented similarly
      default:
        return <SalesWorkbench /> // Fallback
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar - Department Selector */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Department Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowDepartmentMenu(!showDepartmentMenu)}
                className="flex items-center gap-2 hover:bg-muted"
              >
                <span className="text-lg">{currentDept?.icon}</span>
                <span className="font-semibold">{currentDept?.name}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>

              {/* Department Menu */}
              {showDepartmentMenu && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
                  <div className="p-2 space-y-1">
                    {DEPARTMENTS.map((dept) => (
                      <button
                        key={dept.id}
                        onClick={() => {
                          setSelectedDepartment(dept.id)
                          setShowDepartmentMenu(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-2 hover:bg-muted transition ${
                          selectedDepartment === dept.id ? 'bg-primary/10 border-l-2 border-primary' : ''
                        }`}
                        style={
                          selectedDepartment === dept.id
                            ? { borderLeftColor: dept.color }
                            : {}
                        }
                      >
                        <span className="text-lg mt-0.5">{dept.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{dept.name}</p>
                          <p className="text-xs text-muted-foreground">{dept.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workbench */}
        <div className="flex-1 overflow-auto">
          {renderWorkbench()}
        </div>

        {/* Right Sidebar - Twin Signals */}
        <div className="w-80 border-l border-border bg-muted/30 overflow-auto">
          <div className="p-4 space-y-4">
            <div className="sticky top-0 bg-background/95 backdrop-blur -m-4 p-4 border-b border-border">
              <h2 className="font-bold flex items-center gap-2">
                <span>🤖</span> Twin Intelligence
              </h2>
            </div>
            <TwinSignalFeed maxSignals={10} />
          </div>
        </div>
      </div>
    </div>
  )
}
