/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable fast refresh and hot reload optimizations
  reactStrictMode: true,
  
  // TypeScript configuration - strict in development, flexible in deployment
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production',
  },
  
  // ESLint configuration - strict in development, flexible in deployment
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production',
  },
  
  experimental: {
    serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs'],
    // Enable faster builds and hot reload
    optimizePackageImports: ['@heroicons/react'],
    // Turbopack configuration
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // PWA Configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Image optimization for performance
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    domains: [],
  },
  // Compression and performance
  compress: true,
  // Enable SWC minification
  swcMinify: true,
  // Note: NEXT_PUBLIC_ environment variables are automatically exposed by Next.js
  // No need to explicitly expose them in the env config
}

module.exports = nextConfig