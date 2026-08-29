import { Container, SectionReveal } from "@/components/ui";
import { TrailMap } from "@/components/map";
import { getTrailsWithCoordinates } from "@/lib/data";

export async function ChittagongMap() {
  const trails = await getTrailsWithCoordinates();

  return (
    <section className="section-dark py-16 md:py-24 lg:py-32">
      <Container>
        <SectionReveal>
          <div className="mb-10 md:mb-14">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-3">
              Geography
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-dark-text">
              Where in Chittagong
            </h2>
            <p className="text-dark-text/60 text-base md:text-lg mt-3 max-w-xl">
              Every trail has a place. Explore the geography that makes Chittagong extraordinary.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal>
          <TrailMap trails={trails} />
        </SectionReveal>
      </Container>
    </section>
  );
}
