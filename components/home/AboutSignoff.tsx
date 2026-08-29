import { Container, Button } from "@/components/ui";

interface AboutSignoffProps {
  heading?: string;
  content?: string | null;
}

export function AboutSignoff({ heading, content }: AboutSignoffProps) {
  const displayHeading =
    heading && heading.trim() !== ""
      ? heading
      : "“Chittagong is a city that rewards those who take the time to look closely. Every trail leads deeper into understanding what makes this place extraordinary.”";

  const displayContent =
    content && content.trim() !== "" ? (
      <div className="text-dark-text/70 mb-8" dangerouslySetInnerHTML={{ __html: content }} />
    ) : (
      <p className="text-dark-text/70 mb-8">
        Chittagong Trail exists to document this city with care, honesty,
        and genuine appreciation — presenting Chittagong through a personal
        editorial lens while offering meaningful, accurate knowledge about
        its places, culture, and people.
      </p>
    );

  return (
    <section className="section bg-dark-bg">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-display text-2xl md:text-3xl text-dark-text mb-8 leading-relaxed">
            &ldquo;{displayHeading}&rdquo;
          </blockquote>
          {displayContent}
          <Button href="/about" variant="secondary">
            Read More
          </Button>
        </div>
      </Container>
    </section>
  );
}
