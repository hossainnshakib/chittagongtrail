import { Container, Button, SectionReveal } from "@/components/ui";

interface ClosingInvitationProps {
  heading?: string;
  content?: string | null;
}

export function ClosingInvitation({ heading, content }: ClosingInvitationProps) {
  const displayHeading =
    heading && heading.trim() !== ""
      ? heading
      : null;

  const displayContent =
    content && content.trim() !== "" ? content : null;

  if (!displayHeading && !displayContent) return null;

  return (
    <section className="section-dark py-20 md:py-28 lg:py-36">
      <Container>
        <SectionReveal>
          <div className="max-w-3xl mx-auto text-center">
            {displayHeading && (
              <blockquote className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[2rem] text-dark-text leading-relaxed mb-6 md:mb-8">
                &ldquo;{displayHeading}&rdquo;
              </blockquote>
            )}
            {displayContent && (
              <div
                className="text-dark-text/60 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-xl mx-auto"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/trails" variant="secondary">
                Explore All Trails
              </Button>
              <Button href="/about" variant="tertiary">
                About Chittagong Trail
              </Button>
            </div>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
