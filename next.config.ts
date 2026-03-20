import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow images from Google (for user avatars in session)
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}

export default nextConfig
