'use client'

import { Card } from '@/components/ui/card'
import { Check, Lock } from 'lucide-react'

const features = [
  'Zero data training',
  'Tenant isolation',
  'Role-based access',
  'Full audit history',
]

export function SecurityCard() {
  return (
    <Card className="p-8 bg-muted/50 border-primary/20 space-y-4">
      <div className="flex items-center gap-2">
        <Lock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Your data. Your control.</h3>
      </div>
      <div className="space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
