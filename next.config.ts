import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {

    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '98',
        pathname: '/modules/files/**',
      },
      {
        protocol: 'https',
        hostname: 'api.singingbowlvillagenepal.com',
        pathname: '/modules/files/**',
      },
      {
        protocol: 'http',
        hostname: 'api.singingbowlvillagenepal.com',
        pathname: '/modules/review/**',
      },
      {
        protocol: 'https',
        hostname: 'api.singingbowlvillagenepal.com',
        pathname: '/modules/review/**',
      },
      {
        protocol: 'http',
        hostname: 'api.singingbowlvillagenepal.com',
        pathname: '/modules/files/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
