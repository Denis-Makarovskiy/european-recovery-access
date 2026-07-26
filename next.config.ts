import type { NextConfig } from "next";

/**
 * Set for project-pages hosting (https://<user>.github.io/<repo>/), where
 * every asset/route must be prefixed with the repo name. Leave unset (default
 * "") for a custom domain or a user/organization pages repo, where the site
 * is served from the origin root and no prefix is needed.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // GitHub Pages only serves static files — there is no server to run route
  // handlers or the image optimizer, so the app is built as a static export.
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    // No remote imagery is wired up yet (see public/images/hero-placeholder note).
    // Add remotePatterns here once a licensed hero photo / CDN is configured.
    formats: ["image/avif", "image/webp"],
    // next/image's optimizer is a server-side feature and is unavailable in
    // a static export. Pre-built AVIF/WebP variants already exist in
    // public/images (see 08-hero-image-brief.md), so this simply serves them
    // as-is instead of trying to route through the (absent) optimizer.
    unoptimized: true,
  },
};

export default nextConfig;
