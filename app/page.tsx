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

export default async function Home() {
  const settings = await getPublicSiteSettings();

  return (
    <PublicLayout>
      <Hero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        media={settings.heroMedia}
        videoEnabled={settings.heroVideoEnabled}
        videoProvider={settings.heroVideoProvider as "NONE" | "YOUTUBE" | "VIMEO" | "DIRECT"}
        videoUrl={settings.heroVideoUrl}
        videoOverlay={settings.heroVideoOverlay}
      />
      <ChittagongStatement
        heading={settings.introductionHeading}
        content={settings.introductionContent}
      />
      <DestinationsGrid />
      <EditorialQuote
        eyebrow={settings.seasonalEyebrow}
        title={settings.seasonalTitle}
        content={settings.seasonalContent}
        media={settings.seasonalMedia}
      />
      <ExperiencesGrid />
      <FoodGallery />
      <Journeys />
      <UneditedGallery />
      <ClosingInvitation
        heading={settings.aboutHeading}
        content={settings.aboutContent}
      />
    </PublicLayout>
  );
}
