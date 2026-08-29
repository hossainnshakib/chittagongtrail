import { PublicLayout } from "@/components/layout";
import {
  Hero,
  ChittagongStatement,
  TrailDiscovery,
  FeaturedTrailMoment,
  ChittagongMap,
  StoriesFromChittagong,
  TasteOfChittagong,
  VisualInterlude,
  ClosingInvitation,
} from "@/components/home";
import { getPublicSiteSettings } from "@/lib/settings-service";
import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";

async function getFeaturedTrail() {
  try {
    const trail = await prisma.trailLocation.findFirst({
      where: {
        status: ContentStatus.PUBLISHED,
        isFeatured: true,
      },
      orderBy: { featuredOrder: "asc" },
      include: { coverMedia: true },
    });
    if (trail) return trail;

    // Fallback: most recently published
    return await prisma.trailLocation.findFirst({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      include: { coverMedia: true },
    });
  } catch {
    return null;
  }
}

export default async function Home() {
  const [settings, featuredTrail] = await Promise.all([
    getPublicSiteSettings(),
    getFeaturedTrail(),
  ]);

  return (
    <PublicLayout>
      <Hero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        media={settings.heroMedia}
        siteName={settings.siteName}
      />
      <ChittagongStatement
        heading={settings.introductionHeading}
        content={settings.introductionContent}
      />
      <TrailDiscovery />
      <FeaturedTrailMoment trail={featuredTrail} />
      <ChittagongMap />
      <StoriesFromChittagong />
      <TasteOfChittagong />
      <VisualInterlude />
      <ClosingInvitation
        heading={settings.aboutHeading}
        content={settings.aboutContent}
      />
    </PublicLayout>
  );
}
