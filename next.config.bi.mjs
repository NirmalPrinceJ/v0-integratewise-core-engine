import { withMicrofrontends } from '@vercel/microfrontends'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // BI is mounted at /bi — basePath scopes all routes
  basePath: '/bi',

  assetPrefix: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/bi`
    : 'http://localhost:3001/bi',

  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
}

export default withMicrofrontends(nextConfig)
