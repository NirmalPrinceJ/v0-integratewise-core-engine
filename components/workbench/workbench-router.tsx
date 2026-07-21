'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DepartmentWorkbench } from './department-workbench'
import { TwinSignalFeed } from './twin-signal-feed'
import { getAllDepartments } from '@/lib/platform/departments'
import { ChevronDown, ChevronRight, BarChart3, Bell } from 'lucide-react'
import type { DepartmentId } from '@/lib/platform/departments'

export function WorkbenchRouter() {
  const [selectedDept, setSelectedDept] = useState<DepartmentId>('founder')
  const [showDeptMenu, setShowDeptMenu] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  const departments = getAllDepartments()
  const currentDept = departments.find(d => d.id === selectedDept)

  if (!currentDept) return <div>Department not found</div>

  const DeptIcon = require('lucide-react')[currentDept.icon] || BarChart3

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Sidebar Toggle + Department Selector */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showSidebar ? '☰' : '▶'}
            </Button>

            {/* Department Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowDeptMenu(!showDeptMenu)}
                className="flex items-center gap-2"
              >
                <div 
                  className="p-2 rounded-md"
                  style={{ backgroundColor: `${currentDept.color}20` }}
                >
                  <DeptIcon 
                    className="w-4 h-4"
                    style={{ color: currentDept.color }}
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold">{currentDept.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {String(currentDept.defaultTimeslot).padStart(2, '0')}:00 daily
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
              </Button>

              {/* Department Menu Dropdown */}
              {showDeptMenu && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
                  <ScrollArea className="h-96">
                    <div className="p-2 space-y-1">
                      {departments.map(dept => {
                        const Icon = require('lucide-react')[dept.icon] || BarChart3
                        return (
                          <button
                            key={dept.id}
                            onClick={() => {
                              setSelectedDept(dept.id as DepartmentId)
                              setShowDeptMenu(false)
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 hover:bg-muted transition ${
                              selectedDept === dept.id ? 'bg-primary/10 border-l-2' : ''
                            }`}
                            style={
                              selectedDept === dept.id
                                ? { borderLeftColor: dept.color }
                                : {}
                            }
                          >
                            <div 
                              className="p-2 rounded-md mt-0.5 flex-shrink-0"
                              style={{ backgroundColor: `${dept.color}20` }}
                            >
                              <Icon 
                                className="w-4 h-4"
                                style={{ color: dept.color }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">{dept.name}</p>
                              <p className="text-xs text-muted-foreground">{dept.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Entities: {dept.primaryEntities.join(', ')}
                              </p>
                            </div>
                            {selectedDept === dept.id && (
                              <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>

          {/* Right: Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
              3
            </Badge>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Department Navigation */}
        {showSidebar && (
          <div className="w-72 border-r border-border bg-card/50 hidden lg:flex flex-col">
            {/* Sidebar Header */}
            <div className="border-b border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-bold">Customer Zero</h1>
              </div>
              <p className="text-xs text-muted-foreground">
                Multi-department operational hub
              </p>
            </div>

            {/* Department List */}
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
                  All Departments
                </div>

                {departments.map(dept => {
                  const Icon = require('lucide-react')[dept.icon] || BarChart3
                  const isSelected = selectedDept === dept.id

                  return (
                    <Button
                      key={dept.id}
                      variant={isSelected ? 'default' : 'ghost'}
                      className="w-full justify-start gap-3 h-auto py-2.5"
                      onClick={() => setSelectedDept(dept.id as DepartmentId)}
                    >
                      <div 
                        className={`p-2 rounded-md flex-shrink-0 ${
                          isSelected ? 'bg-primary-foreground/10' : 'opacity-60'
                        }`}
                        style={!isSelected ? { color: dept.color } : undefined}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-sm font-medium truncate">{dept.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {String(dept.defaultTimeslot).padStart(2, '0')}:00 IST
                        </div>
                      </div>
                      {isSelected && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Sidebar Footer */}
            <div className="border-t border-border p-3 text-xs text-muted-foreground">
              <p>Operating Rhythm</p>
              <p className="mt-1">08:00 - 18:00 IST daily</p>
            </div>
          </div>
        )}

        {/* Main Workbench */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <DepartmentWorkbench 
            departmentId={selectedDept}
            onOODAAction={(action) => {
              console.log(`[v0] OODA ${action} triggered in ${currentDept.name}`)
            }}
          />
        </div>

        {/* Right Sidebar - Twin Intelligence Feed */}
        <div className="w-80 border-l border-border bg-card/50 hidden xl:flex flex-col overflow-hidden">
          {/* Sidebar Header */}
          <div className="border-b border-border p-4 flex-shrink-0">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span>Twin Intelligence</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              AI signals for {currentDept.name}
            </p>
          </div>

          {/* Twin Signals Feed */}
          <div className="flex-1 overflow-auto">
            <TwinSignalFeed departmentId={selectedDept} />
          </div>
        </div>
      </div>
    </div>
  )
}
