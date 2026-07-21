import { withMicrofrontends } from '@vercel/microfrontends'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required: unique asset prefix prevents static asset collisions
  // between microfrontend apps
  assetPrefix: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000',

  images: { unoptimized: true },

  typescript: { ignoreBuildErrors: true },
}

export default withMicrofrontends(nextConfig)
