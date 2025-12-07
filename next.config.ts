import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Bypass image optimization for external URLs
    domains: ["localhost", "api.singingbowlvillagenepal.com"],
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
    ],
  },
};

export default nextConfig;
