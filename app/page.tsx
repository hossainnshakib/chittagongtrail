import { PublicLayout } from "@/components/layout";
import {
  Hero,
  ChittagongStatement,
  DestinationsGrid,
  EditorialQuote,
  ExperiencesGrid,
  ChittagongMap,
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
        siteName={settings.siteName}
      />
      <DestinationsGrid />
      <ChittagongStatement
        heading={settings.introductionHeading}
        content={settings.introductionContent}
      />
      <EditorialQuote />
      <ExperiencesGrid />
      <ChittagongMap />
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
