import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: ['10.0.0.132', 'localhost', '127.0.0.1'],
  },
};

export default nextConfig;
