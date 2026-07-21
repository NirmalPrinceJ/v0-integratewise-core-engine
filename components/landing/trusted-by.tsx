'use client'

export function TrustedBy() {
  const companies = [
    'GrowthX',
    'Rocketlane',
    'Razorpay',
    'Chargebee',
    'Postman',
    'Zeta',
    'Whatfix',
  ]

  return (
    <section className="py-16 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-8">
          Trusted by innovative teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {companies.map((company) => (
            <div key={company} className="text-sm font-semibold text-muted-foreground opacity-60 hover:opacity-100 transition">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
