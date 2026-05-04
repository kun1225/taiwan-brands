import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn01.pinkoi.com" },
      { protocol: "https", hostname: "cdn02.pinkoi.com" },
    ],
  },
};

export default nextConfig;
