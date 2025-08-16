// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Durante el desarrollo, permitir errores de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Durante el desarrollo, ignorar errores de ESLint
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;