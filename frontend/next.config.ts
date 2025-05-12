import type { NextConfig } from "next";

const now = new Date().toISOString();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_TIME: now,
  },
};

export default nextConfig;
