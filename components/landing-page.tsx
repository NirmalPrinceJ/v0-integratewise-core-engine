'use client'

import { Suspense } from 'react'
import { Hero } from './landing/hero'
import { TrustedBy } from './landing/trusted-by'
import { HowItWorks } from './landing/how-it-works'
import { Workbenches } from './landing/workbenches'
import { Features } from './landing/features'
import { FooterCTA } from './landing/footer-cta'

export function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <div className="w-full">
        <Hero />
        <TrustedBy />
        <HowItWorks />
        <Workbenches />
        <Features />
        <FooterCTA />
      </div>
    </Suspense>
  )
}
