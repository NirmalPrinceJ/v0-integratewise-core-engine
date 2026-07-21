'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function FooterCTA() {
  return (
    <footer className="py-20 bg-muted/30 border-t border-border">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Your AI already knows language.
          </h2>
          <p className="text-xl text-muted-foreground">
            Now let it know your business.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 border border-border space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">iW IntegrateWise</h3>
            <p className="text-sm text-muted-foreground">
              Your Last Auth to Complete Your Ecosystem.
              <br />
              Connect once. Work everywhere.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Your Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            ✓ No credit card required
          </p>
        </div>
      </div>
    </footer>
  )
}
