import Link from "next/link";
import Image from "next/image";
import { Container, Button, SectionReveal } from "@/components/ui";
import { getLatestFoodPosts } from "@/lib/data";

export async function TasteOfChittagong() {
  const stories = await getLatestFoodPosts(4);

  if (stories.length === 0) return null;

  return (
    <section className="section-warm py-16 md:py-24 lg:py-32">
      <Container>
        <SectionReveal>
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-3">
                Food Culture
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
                Taste of Chittagong
              </h2>
            </div>
            <Link
              href="/food"
              className="hidden md:inline-flex items-center gap-2 text-accent text-sm font-medium hover:text-accent-secondary transition-colors duration-200"
            >
              All food
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </SectionReveal>
      </Container>

      {/* Horizontal scroll */}
      <SectionReveal>
        <div
          className="horizontal-scroll pl-4 md:pl-[max(1.5rem,calc((100vw-1200px)/2+2rem))]"
          role="region"
          aria-label="Food stories carousel"
          tabIndex={0}
        >
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/food/${story.slug}`}
              className="group w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0"
              data-reveal
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-4">
                {story.coverMedia?.secureUrl ? (
                  <Image
                    src={story.coverMedia.secureUrl}
                    alt={story.coverMedia.altText || story.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="360px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4956A]/20 to-[#C9A882]/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {story.trail && (
                    <span className="text-dark-text/60 text-xs uppercase tracking-[0.15em]">
                      {story.trail.name}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold text-text group-hover:text-accent transition-colors duration-300">
                {story.title}
              </h3>
              {story.excerpt && (
                <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                  {story.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      </SectionReveal>

      <Container>
        <SectionReveal>
          <div className="mt-8 md:hidden">
            <Button href="/food" variant="secondary">
              Explore Food
            </Button>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
