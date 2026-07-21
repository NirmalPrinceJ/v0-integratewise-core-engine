'use client'

import { Button } from '@/components/ui/button'
import { Users, TrendingUp, MessageSquare, Zap, Settings, Briefcase, Code, AlertCircle, Users2, DollarSign, UserCheck, Shield } from 'lucide-react'

const workbenches = [
  { icon: Users, label: 'Founder' },
  { icon: TrendingUp, label: 'Sales' },
  { icon: Briefcase, label: 'Marketing' },
  { icon: Users2, label: 'Account Success' },
  { icon: MessageSquare, label: 'Support' },
  { icon: Settings, label: 'Product' },
  { icon: Code, label: 'Engineering' },
  { icon: Zap, label: 'Operations' },
  { icon: AlertCircle, label: 'Finance' },
  { icon: UserCheck, label: 'HR' },
  { icon: DollarSign, label: 'Procurement' },
  { icon: Shield, label: 'Governance' },
]

export function Workbenches() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">
            BUILT FOR EVERY WORKBENCH
          </p>
          <h2 className="text-4xl font-bold">One platform. Twelve operational workbenches.</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {workbenches.map((workbench) => {
            const Icon = workbench.icon
            return (
              <div key={workbench.label} className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-muted transition">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-center">{workbench.label}</span>
              </div>
            )
          })}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" size="lg">
            Explore All Workbenches →
          </Button>
        </div>
      </div>
    </section>
  )
}
