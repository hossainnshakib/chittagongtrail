import Link from "next/link";
import { SectionReveal } from "@/components/ui";

export function Journeys() {
  return (
    <section className="ct-section ct-dark">
      <div className="ct-container">
        <SectionReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8 mb-4 md:mb-6">
            <div>
              <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-2">
                Geography
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-dark-text">
                The shape of Chittagong
              </h2>
            </div>
            <Link
              href="/trails"
              className="ct-btn-ghost text-sm shrink-0"
            >
              View all trails →
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
