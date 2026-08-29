import { PublicLayout } from "@/components/layout";
import {
  Hero,
  Introduction,
  ExploreTrails,
  SeasonalMood,
  InteractiveMap,
  Journal,
  Food,
  UneditedGallery,
  AboutSignoff,
} from "@/components/home";
import { SectionWrapper } from "@/components/home/SectionWrapper";
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
      <SectionWrapper>
        <Introduction
          heading={settings.introductionHeading}
          content={settings.introductionContent}
        />
      </SectionWrapper>
      <SectionWrapper>
        <ExploreTrails />
      </SectionWrapper>
      <SectionWrapper>
        <SeasonalMood
          eyebrow={settings.seasonalEyebrow}
          title={settings.seasonalTitle}
          content={settings.seasonalContent}
          media={settings.seasonalMedia}
        />
      </SectionWrapper>
      <SectionWrapper>
        <InteractiveMap />
      </SectionWrapper>
      <SectionWrapper>
        <Journal />
      </SectionWrapper>
      <SectionWrapper>
        <Food />
      </SectionWrapper>
      <SectionWrapper>
        <UneditedGallery />
      </SectionWrapper>
      <SectionWrapper>
        <AboutSignoff
          heading={settings.aboutHeading}
          content={settings.aboutContent}
        />
      </SectionWrapper>
    </PublicLayout>
  );
}
