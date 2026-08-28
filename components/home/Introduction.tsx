import { Container, SectionHeading } from "@/components/ui";

export function Introduction() {
  return (
    <section className="section bg-background">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            title="Welcome to Chittagong Trail"
            subtitle="A personal exploration journal documenting one person's journeys through Chittagong, Bangladesh."
            centered
          />
          <div className="space-y-4 text-text-secondary text-lg">
            <p>
              This journal is about more than just visiting places. It&apos;s about
              discovering the stories that make Chittagong unique — the people,
              the culture, the food, the landscapes, and the moments that happen
              when you take the time to look closer.
            </p>
            <p>
              Every trail I walk, every corner I turn, every conversation I have
              — it all becomes part of this ongoing story about a city that
              continues to surprise me.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
