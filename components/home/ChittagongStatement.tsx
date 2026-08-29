import { SectionReveal } from "@/components/ui";

interface ChittagongStatementProps {
  heading?: string;
  content?: string | null;
}

export function ChittagongStatement({ heading, content }: ChittagongStatementProps) {
  if (!heading && !content) return null;

  const displayHeading = heading?.trim() || null;
  const displayContent = content?.trim() || null;

  if (!displayHeading && !displayContent) return null;

  return (
    <section className="ct-section ct-cream">
      <div className="ct-container">
        <SectionReveal>
          <div className="max-w-3xl mx-auto text-center py-8 md:py-12">
            {displayHeading && (
              <h2
                className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-semibold text-text leading-snug mb-5 md:mb-6"
                dangerouslySetInnerHTML={{ __html: displayHeading.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>') }}
              />
            )}
            {displayContent && (
              <div
                className="text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            )}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
