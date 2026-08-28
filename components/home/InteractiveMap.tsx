import { Container, SectionHeading } from "@/components/ui";
import { TrailMap } from "@/components/map";
import { getTrailsWithCoordinates } from "@/lib/data";

export async function InteractiveMap() {
  const trails = await getTrailsWithCoordinates();

  return (
    <section className="section bg-dark-bg">
      <Container>
        <SectionHeading
          title="Discover Chittagong"
          subtitle="Explore the trails and locations across Chittagong — from coastal shores to misty hills, ancient temples to bustling markets."
          className="text-dark-text"
        />

        <TrailMap trails={trails} />
      </Container>
    </section>
  );
}
