import { Container, SectionReveal } from "@/components/ui";

interface EditorialQuoteProps {
  quote?: string;
  attribution?: string;
}

export function EditorialQuote({ quote, attribution }: EditorialQuoteProps) {
  if (!quote && !attribution) return null;

  const displayQuote =
    quote && quote.trim() !== ""
      ? quote
      : "You do not visit Chittagong. You walk into it and let the hills, the river, and the streets take you somewhere.";

  const displayAttribution =
    attribution && attribution.trim() !== "" ? attribution : null;

  return (
    <section className="section-dark py-20 md:py-28 lg:py-36">
      <Container>
        <SectionReveal>
          <div className="max-w-4xl mx-auto text-center">
            <blockquote
              className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-dark-text leading-relaxed md:leading-relaxed italic"
              dangerouslySetInnerHTML={{
                __html: displayQuote.replace(/\*(.*?)\*/g, '<em class="not-italic text-accent">$1</em>'),
              }}
            />
            {displayAttribution && (
              <p className="text-dark-text/50 text-sm mt-6 md:mt-8">
                {displayAttribution}
              </p>
            )}
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
