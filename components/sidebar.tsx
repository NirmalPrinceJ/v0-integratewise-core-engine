"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Home,
  Crown,
  Target,
  Megaphone,
  Cog,
  Cpu,
  HeadphonesIcon,
  DollarSign,
  Shield,
  Layers,
  Bot,
  Boxes,
  BookOpen,
  Webhook,
  BarChart3,
  GitBranch,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { IntegrateWiseLogo } from "@/components/integratewise-logo"

interface SidebarProps {
  onSearchClick: () => void
  onAIClick: () => void
}

interface NavChild {
  label: string
  href: string
}
interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavChild[]
}
interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    label: "Workspaces",
    items: [
      { label: "Home", href: "/", icon: Home },
      { label: "Founder", href: "/founder", icon: Crown, children: [
        { label: "Strategic Hub", href: "/strategy" },
        { label: "Brainstorming", href: "/brainstorming" },
      ] },
      { label: "Sales", href: "/sales", icon: Target, children: [
        { label: "Leads", href: "/leads" },
        { label: "Pipeline", href: "/pipeline" },
        { label: "Deals", href: "/deals" },
        { label: "Campaigns", href: "/campaigns" },
      ] },
      { label: "Marketing", href: "/marketing", icon: Megaphone, children: [
        { label: "Content Library", href: "/content" },
        { label: "Website Manager", href: "/website" },
      ] },
      { label: "Operations", href: "/operations", icon: Cog, children: [
        { label: "Tasks", href: "/tasks" },
        { label: "Projects", href: "/projects" },
      ] },
      { label: "Technology", href: "/technology", icon: Cpu, children: [
        { label: "Architecture", href: "/architecture" },
        { label: "Integrations", href: "/integrations" },
        { label: "Data Flow", href: "/data-flow" },
        { label: "Data Sources", href: "/data-sources" },
      ] },
      { label: "Customer Success", href: "/customer-success", icon: HeadphonesIcon, children: [
        { label: "Clients", href: "/clients" },
        { label: "Sessions", href: "/sessions" },
      ] },
      { label: "Finance", href: "/finance", icon: DollarSign, children: [
        { label: "Metrics", href: "/metrics" },
        { label: "Products", href: "/products" },
        { label: "Services", href: "/services" },
      ] },
      { label: "Administration", href: "/administration", icon: Shield, children: [
        { label: "Admin Console", href: "/admin" },
        { label: "Settings", href: "/settings" },
      ] },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Adaptive Spine", href: "/architecture", icon: Layers },
      { label: "Agent Runtime", href: "/agents", icon: Bot },
      { label: "Capabilities", href: "/agents", icon: Boxes },
      { label: "Knowledge", href: "/knowledge", icon: BookOpen },
      { label: "Integrations", href: "/integrations", icon: Webhook },
      { label: "Analytics", href: "/metrics", icon: BarChart3 },
      { label: "Data Flow", href: "/data-flow", icon: GitBranch },
    ],
  },
  {
    label: "Customer Zero",
    items: [
      { label: "Evidence", href: "/evidence", icon: BarChart3 },
      { label: "Our Business Runs Here", href: "/customer-zero", icon: ShieldCheck },
      { label: "Template Analysis", href: "/customer-zero/templates", icon: Layers },
    ],
  },
]

export function Sidebar({ onAIClick }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }
  const childActive = (item: NavItem) =>
    item.children?.some((c) => isActive(c.href)) ?? false

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-r border-sidebar-border bg-sidebar md:w-64">
      <div className="flex-shrink-0 border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3F3182] to-[#E94B8A] shadow-sm">
            <IntegrateWiseLogo className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-sidebar-foreground">Customer Zero</h1>
            <p className="truncate text-xs text-sidebar-foreground/60">IntegrateWise Internal Ops</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-4 touch-pan-y">
        {NAV.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href) || childActive(item)
              const isOpen = open[item.label] ?? childActive(item)
              return (
                <div key={`${group.label}-${item.label}`}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-muted hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                    </Link>
                    {item.children && (
                      <button
                        aria-label={`Toggle ${item.label}`}
                        onClick={() => setOpen((s) => ({ ...s, [item.label]: !isOpen }))}
                        className="ml-0.5 rounded-md p-1.5 text-sidebar-foreground/50 hover:bg-sidebar-muted hover:text-sidebar-foreground"
                      >
                        {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                  {item.children && isOpen && (
                    <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-sidebar-border pl-3">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className={cn(
                            "block rounded-md px-3 py-1.5 text-sm transition-colors",
                            isActive(c.href)
                              ? "bg-sidebar-accent/50 font-medium text-sidebar-primary"
                              : "text-sidebar-foreground/60 hover:bg-sidebar-muted/50 hover:text-sidebar-foreground",
                          )}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        <div className="space-y-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Assistant
          </p>
          <button
            onClick={onAIClick}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-sidebar-foreground/80 transition-all duration-150 hover:bg-sidebar-muted hover:text-sidebar-foreground"
          >
            <Sparkles className="h-4.5 w-4.5 flex-shrink-0" />
            AI Assistant
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
            <p className="truncate text-xs text-sidebar-foreground/60">team@integratewise.online</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
