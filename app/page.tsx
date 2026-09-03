import { PublicLayout } from "@/components/layout";
import {
  Hero,
  ChittagongStatement,
  DestinationsGrid,
  EditorialQuote,
  ExperiencesGrid,
  FoodGallery,
  Journeys,
  UneditedGallery,
  ClosingInvitation,
} from "@/components/home";
import { getPublicSiteSettings } from "@/lib/settings-service";
import { prisma } from "@/lib/prisma";
import { ContentStatus, JournalType } from "@prisma/client";

export default async function Home() {
  const settings = await getPublicSiteSettings();

  // Fetch verified public curated data server-side
  const [featuredTrails, featuredStories, featuredFood, homepageGallery] = await Promise.all([
    prisma.trailLocation.findMany({
      where: { status: ContentStatus.PUBLISHED, isFeatured: true },
      orderBy: [{ featuredOrder: "asc" }, { publishedAt: "desc" }],
      take: 4,
      include: { coverMedia: true },
    }),
    prisma.journalPost.findMany({
      where: { status: ContentStatus.PUBLISHED, type: JournalType.STORY, isFeatured: true },
      orderBy: [{ featuredOrder: "asc" }, { publishedAt: "desc" }],
      take: 3,
      include: { coverMedia: true, trail: true },
    }),
    prisma.journalPost.findMany({
      where: { status: ContentStatus.PUBLISHED, type: JournalType.FOOD, isFeatured: true },
      orderBy: [{ featuredOrder: "asc" }, { publishedAt: "desc" }],
      take: 3,
      include: { coverMedia: true, trail: true },
    }),
    prisma.homepageGallery.findMany({
      orderBy: { sortOrder: "asc" },
      include: { mediaAsset: true },
    }),
  ]);

  return (
    <PublicLayout>
      <Hero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        media={settings.heroMedia}
        videoEnabled={settings.heroVideoEnabled}
        videoProvider={settings.heroVideoProvider as "NONE" | "YOUTUBE" | "VIMEO" | "DIRECT"}
        videoUrl={settings.heroVideoUrl}
        videoFormat={(settings as unknown as { heroVideoFormat?: string | null }).heroVideoFormat || null}
        videoOverlay={settings.heroVideoOverlay}
      />
      <ChittagongStatement
        heading={settings.introductionHeading}
        content={settings.introductionContent}
      />
      <DestinationsGrid trails={featuredTrails} />
      <EditorialQuote
        eyebrow={settings.seasonalEyebrow}
        title={settings.seasonalTitle}
        content={settings.seasonalContent}
        media={settings.seasonalMedia}
      />
      <ExperiencesGrid />
      <FoodGallery foodPosts={featuredFood} />
      <Journeys stories={featuredStories} />
      <UneditedGallery galleryItems={homepageGallery} />
      <ClosingInvitation
        heading={settings.aboutHeading}
        content={settings.aboutContent}
      />
    </PublicLayout>
  );
}
