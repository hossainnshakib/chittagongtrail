import { NextResponse } from "next/server";
import { getConfiguredSiteOrigin } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteOrigin = getConfiguredSiteOrigin();
  const siteName = "Chittagong Trail";
  const siteDescription =
    "An independent exploration and storytelling platform documenting Chittagong's places, culture, history, food, and people across five districts: Chittagong, Cox's Bazar, Rangamati, Bandarban, and Khagrachari.";

  const sections = [
    {
      title: "Trails",
      url: `${siteOrigin}/trails`,
      description:
        "Discover coastal shores, misty hills, heritage sites, markets, and hidden places across Chittagong's five districts. Each trail includes location details, district information, terrain type, and related stories.",
    },
    {
      title: "Journal",
      url: `${siteOrigin}/journal`,
      description:
        "Stories, observations, and discoveries from across Chittagong's five districts, shaped by place, culture, history, food, and people.",
    },
    {
      title: "Food",
      url: `${siteOrigin}/food`,
      description:
        "Explore Chittagong's culinary traditions, street food, regional flavors, and food culture across five districts. Covers shared tables, coastal lunches, tea stops, and regional dishes.",
    },
    {
      title: "About",
      url: `${siteOrigin}/about`,
      description:
        "Learn about Chittagong Trail, an independent platform documenting the places, culture, history, food, and people of Chittagong.",
    },
  ];

  const lines = [
    `# ${siteName}`,
    "",
    siteDescription,
    "",
    "## Public Sections",
    "",
    ...sections.flatMap((section) => [
      `### ${section.title}`,
      `URL: ${section.url}`,
      section.description,
      "",
    ]),
    "## Sitemap",
    "",
    `${siteOrigin}/sitemap.xml`,
    "",
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
