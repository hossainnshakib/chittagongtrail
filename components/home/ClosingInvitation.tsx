import { Container, Button, SectionReveal } from "@/components/ui";

interface ClosingInvitationProps {
  heading?: string;
  content?: string | null;
}

export function ClosingInvitation({ heading, content }: ClosingInvitationProps) {
  const displayHeading =
    heading && heading.trim() !== ""
      ? heading
      : "Come while it is still yours to find";

  const displayContent =
    content && content.trim() !== "" ? content : null;

  return (
    <section className="section-dark py-20 md:py-28 lg:py-36">
      <Container>
        <SectionReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-dark-text leading-snug mb-6 md:mb-8"
              dangerouslySetInnerHTML={{
                __html: displayHeading.replace(/\*(.*?)\*/g, '<em class="italic text-accent">$1</em>'),
              }}
            />
            {displayContent && (
              <div
                className="text-dark-text/60 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-xl mx-auto"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/trails" variant="secondary">
                Explore all trails
              </Button>
              <Button href="/journal" variant="tertiary">
                Read the stories
              </Button>
            </div>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
