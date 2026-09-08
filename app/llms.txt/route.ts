import { NextResponse } from "next/server";
import { getConfiguredSiteOrigin } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteOrigin = getConfiguredSiteOrigin();
  const siteName = "Chittagong Trail";
  const siteDescription =
    "An editorial and discovery platform covering places, trails, stories, food, culture, and travel across the five districts of greater Chittagong.";

  const lines = [
    `# ${siteName}`,
    "",
    siteDescription,
    "",
    "## Main sections",
    "",
    `- [Home](${siteOrigin}/)`,
    `- [Trails](${siteOrigin}/trails)`,
    `- [Journal](${siteOrigin}/journal)`,
    `- [Food](${siteOrigin}/food)`,
    `- [About](${siteOrigin}/about)`,
    "",
    "## Machine-readable resources",
    "",
    `- [Sitemap](${siteOrigin}/sitemap.xml)`,
    `- [Robots](${siteOrigin}/robots.txt)`,
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
