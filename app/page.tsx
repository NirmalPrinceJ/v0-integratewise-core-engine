import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LandingPage } from '@/components/landing-page'

export default function Home() {
  return (
    <div className="w-full">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            iW IntegrateWise
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/customer-zero" className="text-muted-foreground hover:text-foreground transition">Customer Zero</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">Platform</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">Workbenches</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">Capabilities</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">Pricing</Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/sign-up">Start Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Landing Page Content */}
      <LandingPage />
    </div>
  )
}
