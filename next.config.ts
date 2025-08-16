// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para producción
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true // Importante para algunos hostings
  },
  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  }
};

export default nextConfig;