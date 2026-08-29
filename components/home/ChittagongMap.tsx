import { SectionReveal } from "@/components/ui";
import { TrailMap } from "@/components/map";
import { getTrailsWithCoordinates } from "@/lib/data";

export async function ChittagongMap() {
  const trails = await getTrailsWithCoordinates();

  return (
    <section className="ct-section ct-dark">
      <div className="ct-container">
        <SectionReveal>
          <div className="mb-8 md:mb-10">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-2">Geography</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-dark-text">
              Where in Chittagong
            </h2>
            <p className="text-dark-text/50 text-base mt-2 max-w-lg">
              Every trail has a place. Explore the geography that makes Chittagong extraordinary.
            </p>
          </div>
        </SectionReveal>
        <SectionReveal>
          <TrailMap trails={trails} />
        </SectionReveal>
      </div>
    </section>
  );
}
