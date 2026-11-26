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
import { getHomepageSectionSettings } from "@/lib/public-content";
import { getPublicHomepageFeatured } from "@/lib/homepage-service";
import { getLatestJournalPosts } from "@/lib/data";
import { HOMEPAGE_FEATURED_LIMITS } from "@/lib/homepage-featured";
import { selectHomepageStorySections } from "@/lib/homepage-story-selection";
import { buildPublicPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPublicPageMetadata("home");
}

export default async function Home() {
  const [settings, homepageSections] = await Promise.all([
    getPublicSiteSettings(),
    getHomepageSectionSettings(),
  ]);
  const section = (sectionKey: string) => homepageSections.find((item) => item.sectionKey === sectionKey);

  // One canonical curation read keeps public sections aligned with the admin editors.
  // Non-featured stories fill the second story section only after curation is assigned.
  const [
    { trails: featuredTrails, stories: featuredStories, food: featuredFood, gallery: homepageGallery },
    publishedStories,
  ] = await Promise.all([
    getPublicHomepageFeatured(),
    getLatestJournalPosts(HOMEPAGE_FEATURED_LIMITS.stories * 2),
  ]);
  const { highlights: journalHighlights, journeys } = selectHomepageStorySections(
    featuredStories,
    publishedStories
  );

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
      {section("destinations")?.enabled !== false && featuredTrails.length > 0 && (
        <DestinationsGrid trails={featuredTrails} section={section("destinations")} />
      )}
      <EditorialQuote
        eyebrow={settings.seasonalEyebrow}
        title={settings.seasonalTitle}
        content={settings.seasonalContent}
        media={settings.seasonalMedia}
      />
      {section("experiences")?.enabled !== false && journalHighlights.length > 0 && (
        <ExperiencesGrid stories={journalHighlights} section={section("experiences")} />
      )}
      {section("food")?.enabled !== false && featuredFood.length > 0 && (
        <FoodGallery foodPosts={featuredFood} section={section("food")} />
      )}
      {section("stories")?.enabled !== false && journeys.length > 0 && (
        <Journeys stories={journeys} section={section("stories")} />
      )}
      {section("gallery")?.enabled !== false && homepageGallery.length > 0 && (
        <UneditedGallery galleryItems={homepageGallery} section={section("gallery")} />
      )}
      <ClosingInvitation
        heading={settings.aboutHeading}
        content={settings.aboutContent}
      />
    </PublicLayout>
  );
}
