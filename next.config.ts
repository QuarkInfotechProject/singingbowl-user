import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Bypass image optimization for external URLs
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
    ],
  },
};

export default nextConfig;
