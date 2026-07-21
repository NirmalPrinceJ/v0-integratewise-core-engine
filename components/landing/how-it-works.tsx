'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, CheckSquare, Search, Calendar, Lock } from 'lucide-react'

const steps = [
  {
    icon: Phone,
    title: 'Call Sarah',
    description: 'Best available calling provider',
    status: 'EXECUTED',
    color: 'bg-green-500/20 text-green-600 border-green-500/30',
  },
  {
    icon: Mail,
    title: 'Email the customer',
    description: 'Gmail, Outlook, or CRM Email',
    status: 'EXECUTED',
    color: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  },
  {
    icon: CheckSquare,
    title: 'Create a task',
    description: 'Jira, GitHub, Linear, or Notion',
    status: 'EXECUTED',
    color: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  },
  {
    icon: Search,
    title: 'Find the roadmap',
    description: 'Notion, Confluence, Google Docs',
    status: 'EXECUTED',
    color: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  },
  {
    icon: Calendar,
    title: 'Schedule follow-up',
    description: 'Google Calendar or Outlook',
    status: 'EXECUTED',
    color: 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30',
  },
  {
    icon: Lock,
    title: 'Approve renewal',
    description: 'CRM + Governance workflow',
    status: 'EXECUTED',
    color: 'bg-red-500/20 text-red-600 border-red-500/30',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">
            HUMAN INTENT → EXECUTION
          </p>
          <h2 className="text-4xl font-bold">You think in work. We handle the rest.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <Card key={step.title} className="p-6 space-y-4 bg-background border-border hover:border-primary/50 transition">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
                <Badge className={`w-fit ${step.color} border`}>
                  {step.status}
                </Badge>
              </Card>
            )
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>IntegrateWise securely resolves the intent, selects the right provider, executes the action, and maintains operational continuity.</p>
        </div>
      </div>
    </section>
  )
}
