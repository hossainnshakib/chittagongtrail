import Link from "next/link";
import Image from "next/image";
import { Container, SectionReveal } from "@/components/ui";
import { getLatestFoodPosts } from "@/lib/data";

export async function FoodGallery() {
  const stories = await getLatestFoodPosts(6);

  return (
    <section className="section-warm py-16 md:py-24 lg:py-32">
      <Container>
        <SectionReveal>
          <div className="mb-10 md:mb-14">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-3">
              Eat first, ask later
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
              Taste of Chittagong
            </h2>
            <p className="text-text-secondary text-base md:text-lg mt-3 max-w-xl">
              Dishes worth building a trip around. Rice, river fish, slow beef, and a sweet course the city takes seriously.
            </p>
          </div>
        </SectionReveal>
      </Container>

      {/* Horizontal scroll gallery */}
      <SectionReveal>
        <div
          className="horizontal-scroll pl-4 md:pl-[max(1.5rem,calc((100vw-1200px)/2+2rem))]"
          role="region"
          aria-label="Food gallery"
          tabIndex={0}
        >
          {stories.length > 0
            ? stories.map((story) => (
                <Link
                  key={story.id}
                  href={`/food/${story.slug}`}
                  className="group w-[260px] sm:w-[300px] md:w-[340px] flex-shrink-0"
                  data-reveal
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-4">
                    {story.coverMedia?.secureUrl ? (
                      <Image
                        src={story.coverMedia.secureUrl}
                        alt={story.coverMedia.altText || story.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="340px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4956A]/20 to-[#C9A882]/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {story.trail && (
                        <span className="text-dark-text/60 text-xs uppercase tracking-[0.15em]">
                          {story.trail.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display text-base md:text-lg font-semibold text-text group-hover:text-accent transition-colors duration-300">
                    {story.title}
                  </h3>
                  {story.excerpt && (
                    <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                      {story.excerpt}
                    </p>
                  )}
                </Link>
              ))
            : /* Fallback food items when database is empty */
              [
                { name: "Kala Bhuna", location: "Chittagong", desc: "Beef cooked down for hours until the gravy turns almost black. Chittagong's signature, and not remotely subtle." },
                { name: "Mezbani", location: "Chittagong", desc: "Slow-cooked spice-rich beef served on banana leaves. The feast that defines Chittagong's food culture." },
                { name: "Shutki", location: "Coastal Chittagong", desc: "Dried fish, fermented and fierce. Chittagong's most honest flavour." },
                { name: "Bhorta Thali", location: "Every home", desc: "Mashes around a plate of rice — aubergine, dried fish, potato, coriander, chilli. It beats most restaurant food." },
                { name: "Fuchka", location: "Every street corner", desc: "Crisp hollow shells filled with spiced potato, dunked in tamarind water. Negotiate the chilli level before you commit." },
                { name: "Bhapa Pitha", location: "Winter, at dusk", desc: "Steamed rice cakes with date palm molasses in the middle, made only in the cold months." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="w-[260px] sm:w-[300px] md:w-[340px] flex-shrink-0"
                  data-reveal
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-[#D4956A]/15 to-[#C9A882]/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-dark-text/60 text-xs uppercase tracking-[0.15em]">
                        {item.location}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display text-base md:text-lg font-semibold text-text">
                    {item.name}
                  </h3>
                  <p className="text-text-secondary text-sm mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
        </div>
      </SectionReveal>

      <Container>
        <SectionReveal>
          <div className="mt-8 md:mt-10">
            <Link
              href="/food"
              className="inline-flex items-center gap-2 text-accent text-sm font-medium hover:text-accent-secondary transition-colors duration-200"
            >
              Explore all food
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
