'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">
            AI-NATIVE. OPERATIONAL. GOVERNED.
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Your <span className="text-primary">Last Auth</span> to Complete Your Ecosystem
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One authentication. Every capability. Everywhere you work. Connect your AI, business applications, and teams into a single operational capability fabric.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Start Free
          </Button>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>

        <div className="flex flex-col items-center gap-3 pt-8 text-xs text-muted-foreground">
          <span>Enterprise grade security • SOC 2 • GDPR • HIPAA • ISO 27001</span>
        </div>
      </div>
    </section>
  )
}
