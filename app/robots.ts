import type { MetadataRoute } from "next";
import { getConfiguredSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = getConfiguredSiteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api",
        "/api/",
        "/preview",
        "/preview/",
      ],
    },
    ...(siteOrigin ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}),
  };
}
