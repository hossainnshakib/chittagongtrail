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
  const { trails: featuredTrails, stories: featuredStories, food: featuredFood, gallery: homepageGallery } =
    await getPublicHomepageFeatured();

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
      {section("destinations")?.enabled !== false && (
        <DestinationsGrid trails={featuredTrails} section={section("destinations")} />
      )}
      <EditorialQuote
        eyebrow={settings.seasonalEyebrow}
        title={settings.seasonalTitle}
        content={settings.seasonalContent}
        media={settings.seasonalMedia}
      />
      {section("experiences")?.enabled !== false && <ExperiencesGrid section={section("experiences")} />}
      {section("food")?.enabled !== false && <FoodGallery foodPosts={featuredFood} section={section("food")} />}
      {section("stories")?.enabled !== false && <Journeys stories={featuredStories} section={section("stories")} />}
      {section("gallery")?.enabled !== false && <UneditedGallery galleryItems={homepageGallery} section={section("gallery")} />}
      <ClosingInvitation
        heading={settings.aboutHeading}
        content={settings.aboutContent}
      />
    </PublicLayout>
  );
}
