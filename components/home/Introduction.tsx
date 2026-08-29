import { Container, SectionHeading } from "@/components/ui";

interface IntroductionProps {
  heading?: string;
  content?: string | null;
}

export function Introduction({ heading, content }: IntroductionProps) {
  const displayHeading = heading && heading.trim() !== "" ? heading : "Welcome to Chittagong Trail";
  
  if (content === null || (content !== undefined && content.trim() === "")) {
    return null; // Deliberate hidden/minimal state when content lacks owner copy
  }

  const displayContent =
    content && content.trim() !== "" ? (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    ) : (
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
    );

  return (
    <section className="section bg-background">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            title={displayHeading}
            subtitle="An independent exploration and storytelling platform documenting Chittagong in its full geographic, cultural, and human context."
            centered
          />
          {displayContent}
        </div>
      </Container>
    </section>
  );
}
