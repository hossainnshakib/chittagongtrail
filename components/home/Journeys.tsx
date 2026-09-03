import Link from "next/link";
import Image from "next/image";
import { SectionReveal } from "@/components/ui";

interface StoryItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverMedia?: { secureUrl: string; altText: string | null } | null;
  trail?: { id: number; name: string; slug: string } | null;
}

interface JourneysProps {
  stories?: StoryItem[];
}

export function Journeys({ stories }: JourneysProps) {
  const displayStories = stories && stories.length > 0 ? stories : [];

  return (
    <section className="ct-section ct-dark">
      <div className="ct-container">
        <SectionReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8 mb-8 md:mb-12">
            <div>
              <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-2">
                Stories & Journeys
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-dark-text">
                Journeys and Dispatches
              </h2>
            </div>
            <Link
              href="/journal"
              className="ct-btn-ghost text-sm shrink-0"
            >
              View all stories →
            </Link>
          </div>
        </SectionReveal>

        {displayStories.length === 0 ? (
          <SectionReveal>
            <p className="text-dark-text/60 text-base py-8">
              Featured stories will appear here once configured in Admin (Featured Stories).
            </p>
          </SectionReveal>
        ) : (
          <SectionReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayStories.map((story) => (
                <Link
                  key={story.slug}
                  href={`/journal/${story.slug}`}
                  className="group flex flex-col bg-dark-card rounded-lg overflow-hidden border border-dark-border hover:border-accent transition-colors"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {story.coverMedia?.secureUrl ? (
                      <Image
                        src={story.coverMedia.secureUrl}
                        alt={story.coverMedia.altText || story.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-teal/10" />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {story.trail && (
                        <span className="text-accent text-xs uppercase tracking-wider block mb-2">
                          {story.trail.name}
                        </span>
                      )}
                      <h3 className="font-display text-lg font-semibold text-dark-text group-hover:text-accent transition-colors mb-2">
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="text-dark-text/60 text-sm line-clamp-3">
                          {story.excerpt}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-accent text-xs uppercase tracking-[0.15em] font-medium mt-4">
                      Read dispatch →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}
