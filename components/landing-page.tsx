'use client'

import { Suspense } from 'react'
import { Hero } from './landing/hero'
import { Features } from './landing/features'
import { HowItWorks } from './landing/how-it-works'
import { Workbenches } from './landing/workbenches'

export function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <div className="w-full">
        <Hero />
        <Features />
        <HowItWorks />
        <Workbenches />
      </div>
    </Suspense>
  )
}
