import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: 'http://localhost:8000/media/:path*', // Proxy to Django
      },
    ];
  },
};

export default nextConfig;
