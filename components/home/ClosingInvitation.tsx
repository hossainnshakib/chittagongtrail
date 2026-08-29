import Link from "next/link";
import { SectionReveal } from "@/components/ui";

interface ClosingInvitationProps {
  heading?: string;
  content?: string | null;
}

export function ClosingInvitation({ heading, content }: ClosingInvitationProps) {
  const displayHeading = heading?.trim() || "";
  const displayContent = content?.trim() || "";

  if (!displayHeading && !displayContent) return null;

  return (
    <section className="ct-section ct-dark" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="ct-container">
        <SectionReveal>
          <div className="max-w-3xl mx-auto text-center">
            {displayHeading && (
              <h2
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-text leading-[1.1] mb-6 md:mb-8"
                dangerouslySetInnerHTML={{
                  __html: displayHeading.replace(
                    /\*(.*?)\*/g,
                    '<em class="italic text-accent">$1</em>'
                  ),
                }}
              />
            )}
            {displayContent && (
              <div
                className="text-dark-text/50 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/trails" className="ct-btn ct-btn-outline">
                Explore all trails
              </Link>
              <Link href="/journal" className="ct-btn ct-btn-ghost text-sm">
                Read the stories →
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
