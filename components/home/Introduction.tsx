import { Container, SectionHeading } from "@/components/ui";

export function Introduction() {
  return (
    <section className="section bg-background">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            title="Welcome to Chittagong Trail"
            subtitle="An independent exploration and storytelling platform documenting Chittagong in its full geographic, cultural, and human context."
            centered
          />
          <div className="space-y-4 text-text-secondary text-lg">
            <p>
              Chittagong Trail is a personally operated project dedicated to
              exploring, documenting, and sharing the places, stories, food,
              culture, history, and people that make Chittagong extraordinary.
              From the hills to the coast, from ancient temples to bustling
              markets — every corner of this city has a story worth telling.
            </p>
            <p>
              This platform is guided by genuine exploration and careful
              observation, presented through an authentic editorial voice that
              values both personal discovery and meaningful, accurate knowledge
              about Chittagong.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
