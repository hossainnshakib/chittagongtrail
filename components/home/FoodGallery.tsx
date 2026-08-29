import Link from "next/link";
import Image from "next/image";
import { SectionReveal } from "@/components/ui";
import { getLatestFoodPosts } from "@/lib/data";

export async function FoodGallery() {
  const stories = await getLatestFoodPosts(3);

  return (
    <section className="ct-section ct-warm">
      <div className="ct-container mb-8 md:mb-10">
        <SectionReveal>
          <p className="text-text-muted text-xs uppercase tracking-[0.2em] font-medium mb-3">
            Food
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
            Taste of Chittagong
          </h2>
          <p className="text-text-secondary text-base mt-2 max-w-xl">
            Dishes worth building a trip around. Rice, river fish, slow beef, and a sweet course the city takes seriously.
          </p>
        </SectionReveal>
      </div>

      {stories.length === 0 ? (
        <div className="ct-container">
          <SectionReveal>
            <p className="text-text-secondary text-base py-12 text-center">
              Food stories will appear here.
            </p>
          </SectionReveal>
        </div>
      ) : (
        <SectionReveal>
          <div className="ct-food-scroll" role="region" aria-label="Food gallery" tabIndex={0}>
            {stories.map((story) => (
              <Link key={story.id} href={`/food/${story.slug}`} className="ct-food-card group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-3">
                  {story.coverMedia?.secureUrl ? (
                    <Image
                      src={story.coverMedia.secureUrl}
                      alt={story.coverMedia.altText || story.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="360px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/20 to-accent/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/50 to-transparent" />
                  {story.trail && (
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-dark-text/50 text-xs uppercase tracking-wider">
                        {story.trail.name}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-display text-base md:text-lg font-semibold text-text group-hover:text-accent transition-colors leading-tight">
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
      )}

      <div className="ct-container mt-6">
        <SectionReveal>
          <Link href="/food" className="ct-btn-ghost text-sm">
            Explore all food →
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
