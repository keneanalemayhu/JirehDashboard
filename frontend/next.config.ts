import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "export",
  // Remove trailingSlash setting as we'll handle it in .htaccess
  images: {
    unoptimized: true,
  },
};

export default nextConfig;