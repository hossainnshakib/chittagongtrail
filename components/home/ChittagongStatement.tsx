import { SectionReveal } from "@/components/ui";

interface ChittagongStatementProps {
  heading?: string;
  content?: string | null;
}

export function ChittagongStatement({ heading, content }: ChittagongStatementProps) {
  const displayHeading = heading?.trim() || "";
  const displayContent = content?.trim() || "";

  if (!displayHeading && !displayContent) return null;

  return (
    <section className="ct-section ct-cream">
      <div className="ct-container">
        <SectionReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start py-8 md:py-12 lg:py-16">
            <div className="lg:col-span-5">
              <span className="text-text-muted text-xs uppercase tracking-[0.2em] font-medium block mb-4">
                Chittagong Trail
              </span>
              {displayHeading && (
                <h2
                  className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-semibold text-text leading-[1.1] tracking-tight"
                  dangerouslySetInnerHTML={{
                    __html: displayHeading.replace(
                      /\*(.*?)\*/g,
                      '<em class="italic font-normal text-accent">$1</em>'
                    ),
                  }}
                />
              )}
            </div>

            <div className="lg:col-span-1 hidden lg:flex items-stretch justify-center">
              <div className="w-px bg-border-default relative">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent/40" />
                <span className="absolute top-2/3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent/40" />
              </div>
            </div>

            <div className="lg:col-span-6 lg:pt-12">
              {displayContent && (
                <div
                  className="text-text-secondary text-base md:text-lg leading-relaxed max-w-xl"
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />
              )}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
