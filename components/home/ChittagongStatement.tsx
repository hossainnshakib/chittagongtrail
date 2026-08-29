import { Container } from "@/components/ui";
import { SectionReveal } from "@/components/ui";

interface ChittagongStatementProps {
  heading?: string;
  content?: string | null;
}

export function ChittagongStatement({ heading, content }: ChittagongStatementProps) {
  if (!heading && !content) return null;

  const displayHeading = heading && heading.trim() !== "" ? heading : null;
  const displayContent = content && content.trim() !== "" ? content : null;

  if (!displayHeading && !displayContent) return null;

  return (
    <section className="section-cream py-20 md:py-28 lg:py-36">
      <Container>
        <SectionReveal>
          <div className="max-w-3xl mx-auto text-center">
            {displayHeading && (
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-text leading-snug mb-6 md:mb-8">
                {displayHeading}
              </h2>
            )}
            {displayContent && (
              <div
                className="text-text-secondary text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto prose prose-lg prose-p:text-text-secondary prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            )}
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
