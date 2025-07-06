import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home",
      },
    ];
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
