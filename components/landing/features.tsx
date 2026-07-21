'use client'

import { Card } from '@/components/ui/card'
import { Zap, Network, Shield, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Adaptive Spine',
    description: 'A continuously evolving operational memory across your organization.',
  },
  {
    icon: Network,
    title: 'Universal Capability Fabric',
    description: 'Translate human intent into governed execution across any system.',
  },
  {
    icon: CheckCircle,
    title: 'AI-Native',
    description: 'Works where users already work—inside their AI assistants.',
  },
  {
    icon: Shield,
    title: 'Enterprise Governance',
    description: 'Policies, approvals, audit trails, and operational trust built in.',
  },
]

export function Features() {
  return (
    <section className="py-24 bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">
            WHY INTEGRATEWISE
          </p>
          <h2 className="text-4xl font-bold">Built for every workbench</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="p-6 space-y-4 bg-background border-border hover:border-primary/50 transition">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
