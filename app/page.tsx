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

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <Introduction />
      <ExploreTrails />
      <SeasonalMood />
      <InteractiveMap />
      <Journal />
      <Food />
      <UneditedGallery />
      <AboutSignoff />
    </PublicLayout>
  );
}
