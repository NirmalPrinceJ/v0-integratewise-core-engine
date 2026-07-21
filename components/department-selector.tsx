'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  Users,
  Headphones,
  Zap,
  Code,
  TrendingUp,
  DollarSign,
  Briefcase,
  Lock,
  ShoppingCart,
  Settings,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const DEPARTMENTS = [
  { id: 'home', label: 'Home', href: '/', icon: Home },
  { id: 'account-success', label: 'Account Success', href: '/workbench/account-success', icon: Users },
  { id: 'sales', label: 'Sales', href: '/workbench/sales', icon: TrendingUp },
  { id: 'support', label: 'Support', href: '/workbench/support', icon: Headphones },
  { id: 'marketing', label: 'Marketing', href: '/workbench/marketing', icon: BarChart3 },
  { id: 'customer-success', label: 'Customer Success', href: '/workbench/customer-success', icon: Users },
  { id: 'operations', label: 'Operations', href: '/workbench/operations', icon: Zap },
  { id: 'technology', label: 'Technology', href: '/workbench/technology', icon: Code },
  { id: 'finance', label: 'Finance', href: '/workbench/finance', icon: DollarSign },
  { id: 'hr', label: 'HR', href: '/workbench/hr', icon: Briefcase },
  { id: 'it', label: 'IT', href: '/workbench/it', icon: Code },
  { id: 'legal', label: 'Legal', href: '/workbench/legal', icon: Lock },
  { id: 'procurement', label: 'Procurement', href: '/workbench/procurement', icon: ShoppingCart },
  { id: 'administration', label: 'Administration', href: '/workbench/administration', icon: Settings },
]

export function DepartmentSelector() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const currentDept = DEPARTMENTS.find((d) => {
    if (d.href === '/') return pathname === '/'
    return pathname.startsWith(d.href)
  })

  return (
    <div className="w-full">
      <Select
        value={currentDept?.id || 'home'}
        onValueChange={(value) => {
          const dept = DEPARTMENTS.find((d) => d.id === value)
          if (dept) {
            window.location.href = dept.href
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent>
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon
            return (
              <SelectItem key={dept.id} value={dept.id}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{dept.label}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

// For sidebar navigation
export function DepartmentNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {DEPARTMENTS.map((dept) => {
        const Icon = dept.icon
        const isActive =
          dept.href === '/' ? pathname === '/' : pathname.startsWith(dept.href)

        return (
          <Link
            key={dept.id}
            href={dept.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{dept.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
