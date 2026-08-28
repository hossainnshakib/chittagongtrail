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

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <SectionWrapper>
        <Introduction />
      </SectionWrapper>
      <SectionWrapper>
        <ExploreTrails />
      </SectionWrapper>
      <SectionWrapper>
        <SeasonalMood />
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
        <AboutSignoff />
      </SectionWrapper>
    </PublicLayout>
  );
}
