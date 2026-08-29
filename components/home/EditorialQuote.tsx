import { SectionReveal } from "@/components/ui";
import Image from "next/image";

interface EditorialQuoteProps {
  eyebrow?: string;
  title?: string;
  content?: string | null;
  media?: { secureUrl: string; altText: string | null } | null;
}

export function EditorialQuote({ eyebrow, title, content, media }: EditorialQuoteProps) {
  const displayEyebrow = eyebrow?.trim() || "";
  const displayTitle = title?.trim() || "";
  const displayContent = content?.trim() || "";

  if (!displayEyebrow && !displayTitle) return null;

  return (
    <section className="ct-section ct-dark relative overflow-hidden" style={{ paddingTop: 0, paddingBottom: 0 }}>
      {media?.secureUrl && (
        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
          <Image
            src={media.secureUrl}
            alt={media.altText || "Seasonal Chittagong"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-dark-bg/30" />
          <div className="absolute inset-0 flex items-end">
            <div className="ct-container w-full pb-12 md:pb-16 lg:pb-20">
              <SectionReveal>
                <div className="max-w-4xl">
                  {displayEyebrow && (
                    <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium block mb-4">
                      {displayEyebrow}
                    </span>
                  )}
                  {displayTitle && (
                    <h2
                      className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-dark-text leading-[1.05] tracking-tight"
                      dangerouslySetInnerHTML={{
                        __html: displayTitle.replace(
                          /\*(.*?)\*/g,
                          '<em class="italic font-normal text-accent">$1</em>'
                        ),
                      }}
                    />
                  )}
                  {displayContent && (
                    <div
                      className="text-dark-text/60 text-base md:text-lg leading-relaxed mt-4 md:mt-6 max-w-2xl"
                      dangerouslySetInnerHTML={{ __html: displayContent }}
                    />
                  )}
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      )}

      {!media?.secureUrl && (
        <div className="ct-container py-16 md:py-24 lg:py-32">
          <SectionReveal>
            <div className="max-w-4xl">
              {displayEyebrow && (
                <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium block mb-4">
                  {displayEyebrow}
                </span>
              )}
              {displayTitle && (
                <h2
                  className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-dark-text leading-[1.05] tracking-tight"
                  dangerouslySetInnerHTML={{
                    __html: displayTitle.replace(
                      /\*(.*?)\*/g,
                      '<em class="italic font-normal text-accent">$1</em>'
                    ),
                  }}
                />
              )}
              {displayContent && (
                <div
                  className="text-dark-text/60 text-base md:text-lg leading-relaxed mt-4 md:mt-6 max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />
              )}
            </div>
          </SectionReveal>
        </div>
      )}
    </section>
  );
}
