import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Static export has no server to answer requests at request time, so this
// must resolve to a fixed sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // next.config.ts sets trailingSlash: true, so these must match the
  // trailing-slash URLs the site actually serves (and that layout.tsx's
  // canonical resolves to), not bare paths.
  const routes = ["/", "/privacy/", "/terms/"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
