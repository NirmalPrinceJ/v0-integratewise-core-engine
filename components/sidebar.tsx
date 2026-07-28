"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Sparkles } from "lucide-react"
import { IntegrateWiseLogo } from "@/components/integratewise-logo"
import { CURRENT_VIEWER, visibleProjectionGroups } from "@/lib/projections"

interface SidebarProps {
  onSearchClick: () => void
  onAIClick: () => void
}

const PROJECTION_LABEL: Record<string, string> = {
  table: "Table",
  board: "Board",
  calendar: "Calendar",
  dashboard: "Dashboard",
  canvas: "Canvas",
  feed: "Feed",
}

export function Sidebar({ onAIClick }: SidebarProps) {
  const pathname = usePathname()
  const groups = useMemo(() => visibleProjectionGroups(CURRENT_VIEWER), [])
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  const toggle = (label: string) => setCollapsed((s) => ({ ...s, [label]: !s[label] }))

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-r border-sidebar-border bg-sidebar md:w-64">
      <div className="flex-shrink-0 border-b border-sidebar-border p-4">
        <Link href="/workbench" className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3F3182] to-[#E94B8A] shadow-sm">
            <IntegrateWiseLogo className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-sidebar-foreground">IntegrateWise</h1>
            <p className="truncate text-xs text-sidebar-foreground/60">Twin-projected workspace</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-4 touch-pan-y">
        {groups.map((group) => {
          const isCollapsed = collapsed[group.label] ?? false
          return (
            <div key={group.label} className="space-y-1">
              <button
                onClick={() => toggle(group.label)}
                className="flex w-full items-center justify-between px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 transition-colors hover:text-sidebar-foreground/70"
                aria-expanded={!isCollapsed}
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", isCollapsed && "-rotate-90")}
                />
              </button>
              {!isCollapsed &&
                group.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.description ?? item.label}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-muted hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <span
                        className={cn(
                          "flex-shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide opacity-0 transition-opacity group-hover:opacity-100",
                          active ? "bg-sidebar-primary/15 text-sidebar-primary" : "bg-sidebar-muted text-sidebar-foreground/50",
                        )}
                      >
                        {PROJECTION_LABEL[item.projection]}
                      </span>
                    </Link>
                  )
                })}
            </div>
          )
        })}

        <div className="space-y-1 pt-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Twin
          </p>
          <button
            onClick={onAIClick}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-sidebar-foreground/80 transition-all duration-150 hover:bg-sidebar-muted hover:text-sidebar-foreground"
          >
            <Sparkles className="h-[18px] w-[18px] flex-shrink-0" />
            Ask Twin
          </button>
        </div>
      </nav>

      <div className="flex-shrink-0 border-t border-sidebar-border p-3">
        <Link href="/settings" className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-muted">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-sidebar-border bg-gradient-to-br from-primary/20 to-primary/10">
            <span className="text-sm font-semibold text-sidebar-primary">CZ</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">Customer Zero Team</p>
            <p className="truncate text-xs text-sidebar-foreground/60 capitalize">
              {CURRENT_VIEWER.role} · {CURRENT_VIEWER.department}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
