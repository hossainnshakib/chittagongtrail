import Link from "next/link";
import Image from "next/image";
import { SectionReveal } from "@/components/ui";
import { getLatestJournalPosts } from "@/lib/data";

export async function ExperiencesGrid() {
  const stories = await getLatestJournalPosts(3);

  return (
    <section className="ct-section ct-cream">
      <div className="ct-container mb-8 md:mb-12">
        <SectionReveal>
          <p className="text-text-muted text-xs uppercase tracking-[0.2em] font-medium mb-3">
            Journal
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
            Stories from the trail
          </h2>
        </SectionReveal>
      </div>

      {stories.length === 0 ? (
        <div className="ct-container">
          <SectionReveal>
            <p className="text-text-secondary text-base py-12 text-center">
              Journal stories will appear here.
            </p>
          </SectionReveal>
        </div>
      ) : (
        <div className="ct-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {stories[0] && (
              <SectionReveal className="lg:col-span-7">
                <Link
                  href={`/journal/${stories[0].slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                    {stories[0].coverMedia?.secureUrl ? (
                      <Image
                        src={stories[0].coverMedia.secureUrl}
                        alt={stories[0].coverMedia.altText || stories[0].title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-warm/30" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/50 to-transparent" />
                    {stories[0].trail && (
                      <div className="absolute bottom-4 left-4">
                        <span className="text-dark-text/60 text-xs uppercase tracking-wider bg-dark-bg/40 backdrop-blur-sm px-2 py-1 rounded">
                          {stories[0].trail.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-text group-hover:text-accent transition-colors leading-tight mb-2">
                    {stories[0].title}
                  </h3>
                  <div className="flex items-center gap-3 text-text-muted text-sm">
                    <time>{new Date(stories[0].publishedAt || stories[0].createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
                  </div>
                  {stories[0].excerpt && (
                    <p className="text-text-secondary text-sm md:text-base mt-3 max-w-xl leading-relaxed">
                      {stories[0].excerpt}
                    </p>
                  )}
                </Link>
              </SectionReveal>
            )}

            <div className="lg:col-span-5 flex flex-col gap-4">
              {stories.slice(1).map((story, i) => (
                <SectionReveal key={story.id}>
                  <Link
                    href={`/journal/${story.slug}`}
                    className="group block"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0">
                        {story.coverMedia?.secureUrl ? (
                          <Image
                            src={story.coverMedia.secureUrl}
                            alt={story.coverMedia.altText || story.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="128px"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-warm/30" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="ct-number text-lg block mb-1">
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-base md:text-lg font-semibold text-text group-hover:text-accent transition-colors leading-tight line-clamp-2 mb-1">
                          {story.title}
                        </h3>
                        <div className="flex items-center gap-2 text-text-muted text-xs">
                          <time>{new Date(story.publishedAt || story.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
                          {story.trail && (
                            <>
                              <span className="text-border-default">·</span>
                              <span>{story.trail.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="ct-container mt-6">
        <SectionReveal>
          <Link href="/journal" className="ct-btn-ghost text-sm">
            Read all stories →
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
