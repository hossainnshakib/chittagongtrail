import { SectionReveal } from "@/components/ui";

interface EditorialQuoteProps {
  quote?: string;
  attribution?: string;
}

export function EditorialQuote({ quote, attribution }: EditorialQuoteProps) {
  const displayQuote = quote?.trim() || "You do not visit Chittagong. You walk into it and let the hills, the river, and the streets take you somewhere.";
  const displayAttribution = attribution?.trim() || null;

  return (
    <section className="ct-section ct-dark" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div className="ct-container">
        <SectionReveal>
          <div className="max-w-4xl mx-auto text-center">
            <blockquote
              className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[2.25rem] text-dark-text leading-relaxed italic"
              dangerouslySetInnerHTML={{
                __html: displayQuote.replace(/\*(.*?)\*/g, '<em class="not-italic text-accent">$1</em>'),
              }}
            />
            {displayAttribution && (
              <p className="text-dark-text/40 text-sm mt-6">{displayAttribution}</p>
            )}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
