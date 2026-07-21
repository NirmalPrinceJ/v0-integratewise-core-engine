import type React from "react"
import type { Metadata, Viewport } from "next"

import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/next"
import { PlatformProvider } from "@/lib/platform"
import "./globals.css"

import { Inter, Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Customer Zero – IntegrateWise Internal Operations",
  description:
    "The internal operating workspace that runs IntegrateWise on its own Platform API — Customer Zero, the reference implementation.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Customer Zero – IntegrateWise Internal Operations",
    description:
      "The internal operating workspace that runs IntegrateWise on its own Platform API — Customer Zero, the reference implementation.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <PlatformProvider>
        <html lang="en" className={inter.variable}>
          <body className="font-sans antialiased">
            {children}
            <Analytics />
          </body>
        </html>
      </PlatformProvider>
    </ClerkProvider>
  )
}
