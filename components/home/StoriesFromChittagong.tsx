import Link from "next/link";
import Image from "next/image";
import { Container, Button, SectionReveal } from "@/components/ui";
import { getLatestJournalPosts } from "@/lib/data";

export async function StoriesFromChittagong() {
  const stories = await getLatestJournalPosts(3);

  if (stories.length === 0) return null;

  const featured = stories[0];
  const supporting = stories.slice(1, 3);

  return (
    <section className="section-cream py-16 md:py-24 lg:py-32">
      <Container>
        <SectionReveal>
          <div className="mb-10 md:mb-14">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-3">
              Stories
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
              From Chittagong
            </h2>
          </div>
        </SectionReveal>

        {/* Featured story — large editorial */}
        <SectionReveal>
          <Link
            href={`/journal/${featured.slug}`}
            className="group block mb-6 md:mb-8"
            data-reveal
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                {featured.coverMedia?.secureUrl ? (
                  <Image
                    src={featured.coverMedia.secureUrl}
                    alt={featured.coverMedia.altText || featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A882]/20 to-[#7FB5C4]/10" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center">
                {featured.trail && (
                  <span className="text-accent text-xs uppercase tracking-[0.15em] font-medium mb-3">
                    {featured.trail.name}
                  </span>
                )}
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-text mb-3 group-hover:text-accent transition-colors duration-300">
                  {featured.title}
                </h3>
                <p className="text-text-secondary text-base leading-relaxed line-clamp-3 mb-4">
                  {featured.excerpt ||
                    featured.content.replace(/<[^>]*>?/gm, "").substring(0, 180)}
                </p>
                <span className="inline-flex items-center gap-2 text-accent text-sm font-medium group-hover:gap-3 transition-all duration-200">
                  Read story
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </SectionReveal>

        {/* Supporting stories */}
        {supporting.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {supporting.map((story) => (
              <SectionReveal key={story.id}>
                <Link
                  href={`/journal/${story.slug}`}
                  className="group block"
                  data-reveal
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4">
                    {story.coverMedia?.secureUrl ? (
                      <Image
                        src={story.coverMedia.secureUrl}
                        alt={story.coverMedia.altText || story.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 500px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#C9A882]/15 to-[#7FB5C4]/10" />
                    )}
                  </div>
                  {story.trail && (
                    <span className="text-accent text-xs uppercase tracking-[0.15em] font-medium">
                      {story.trail.name}
                    </span>
                  )}
                  <h3 className="font-display text-xl font-semibold text-text mt-1 mb-2 group-hover:text-accent transition-colors duration-300">
                    {story.title}
                  </h3>
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {story.excerpt ||
                      story.content.replace(/<[^>]*>?/gm, "").substring(0, 120)}
                  </p>
                </Link>
              </SectionReveal>
            ))}
          </div>
        )}

        <SectionReveal>
          <div className="mt-10 md:mt-14">
            <Button href="/journal" variant="secondary">
              More Stories
            </Button>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
