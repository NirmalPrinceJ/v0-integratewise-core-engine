'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Lock, Zap, Brain, Users, Layers } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-background pointer-events-none opacity-50" />
      
      <div className="relative w-full max-w-7xl mx-auto px-6 py-20 space-y-12">
        {/* Main Content */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
              Operating System for Scaling Companies
            </p>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-blue-400 to-slate-100">
                Customer Zero
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              The intelligence layer for your business. AI-powered twins execute decisions across 12 departments, 65+ integrations, and every operational workflow.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white text-black hover:bg-slate-100 font-semibold" asChild>
              <Link href="/customer-zero">Launch Platform</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
              View Documentation
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-6">
            <Lock className="w-4 h-4" />
            <span>Enterprise-grade • SOC 2 • GDPR • HIPAA</span>
          </div>
        </div>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-12">
          <div className="group p-6 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-blue-400/50 transition">
            <Brain className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition" />
            <h3 className="font-semibold text-slate-100 mb-2">AI Twins</h3>
            <p className="text-sm text-slate-400">Twin agents execute decisions autonomously with human oversight</p>
          </div>
          
          <div className="group p-6 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-blue-400/50 transition">
            <Zap className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition" />
            <h3 className="font-semibold text-slate-100 mb-2">OODA Loops</h3>
            <p className="text-sm text-slate-400">Observe, Orient, Decide, Act—governance built into every workflow</p>
          </div>
          
          <div className="group p-6 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-blue-400/50 transition">
            <Users className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition" />
            <h3 className="font-semibold text-slate-100 mb-2">12 Workbenches</h3>
            <p className="text-sm text-slate-400">Department-specific UIs for Sales, CSM, Marketing, Finance & more</p>
          </div>
          
          <div className="group p-6 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-blue-400/50 transition">
            <Layers className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition" />
            <h3 className="font-semibold text-slate-100 mb-2">65+ Integrations</h3>
            <p className="text-sm text-slate-400">Connected to all your tools through unified capability fabric</p>
          </div>
        </div>
      </div>
    </section>
  )
}
