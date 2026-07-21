'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export function Hero() {
  const aiSurfaces = [
    { name: 'ChatGPT', icon: '🤖' },
    { name: 'Claude', icon: '🧠' },
    { name: 'Perplexity', icon: '🔍' },
    { name: 'Hermes', icon: '✨' },
  ]

  const ecosystemApps = [
    { name: 'Salesforce', icon: '☁️' },
    { name: 'HubSpot', icon: '🎯' },
    { name: 'Slack', icon: '💬' },
    { name: 'Teams', icon: '👥' },
    { name: 'Gmail', icon: '📧' },
    { name: 'Outlook', icon: '📮' },
    { name: 'Notion', icon: '📝' },
    { name: 'Google Drive', icon: '📁' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative w-full max-w-7xl mx-auto px-6 py-20 space-y-12">
        {/* Left Side Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                AI-NATIVE. OPERATIONAL. GOVERNED.
              </p>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                Your <span className="text-primary">Last Auth</span> to Complete Your Ecosystem
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                One authentication. Every capability. Everywhere you work. Connect your AI, business applications, and teams into a single operational capability fabric. Stay in ChatGPT, Claude, Hermes, or your workbench while IntegrateWise securely executes work across your connected ecosystem.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Free
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4">
              <Lock className="w-4 h-4" />
              <span>Enterprise grade security • SOC 2 • GDPR • HIPAA • ISO 27001</span>
            </div>
          </div>

          {/* Right Side: AI Surfaces → iW Hub → Ecosystem */}
          <div className="relative h-full min-h-96 lg:min-h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* AI Surfaces Section */}
              <div className="absolute top-0 left-0 right-0 text-center space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase">AI SURFACES</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {aiSurfaces.map((surface) => (
                    <div key={surface.name} className="w-14 h-14 rounded-lg bg-muted border border-border flex items-center justify-center text-xl hover:border-primary/50 transition">
                      {surface.icon}
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-lg bg-muted border border-border flex items-center justify-center text-xl hover:border-primary/50 transition">
                    •••
                  </div>
                </div>
              </div>

              {/* Central Hub */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-3 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">iW</span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground">UNIVERSAL CAPABILITY FABRIC</p>
                <p className="text-xs text-muted-foreground max-w-xs">Human intent → Governed execution</p>
              </div>

              {/* Ecosystem Apps */}
              <div className="absolute bottom-0 left-0 right-0 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase text-center">YOUR CONNECTED ECOSYSTEM</p>
                <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                  {ecosystemApps.slice(0, 8).map((app) => (
                    <div key={app.name} className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center text-lg hover:border-primary/50 transition" title={app.name}>
                      {app.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
