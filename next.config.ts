import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // No remote imagery is wired up yet (see public/images/hero-placeholder note).
    // Add remotePatterns here once a licensed hero photo / CDN is configured.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
