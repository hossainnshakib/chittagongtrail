import Link from "next/link";
import Image from "next/image";
import { SectionReveal } from "@/components/ui";
import { getLatestFoodPosts } from "@/lib/data";

const fallbackFoods = [
  { name: "Kala Bhuna", location: "Chittagong", desc: "Beef cooked down for hours until the gravy turns almost black. Chittagong's signature, and not remotely subtle.", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80" },
  { name: "Mezbani", location: "Chittagong", desc: "Slow-cooked spice-rich beef served on banana leaves. The feast that defines Chittagong's food culture.", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80" },
  { name: "Shutki", location: "Coastal Chittagong", desc: "Dried fish, fermented and fierce. Chittagong's most honest flavour.", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80" },
  { name: "Bhorta Thali", location: "Every home", desc: "Mashes around a plate of rice — aubergine, dried fish, potato, coriander, chilli.", img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80" },
  { name: "Fuchka", location: "Every street corner", desc: "Crisp hollow shells filled with spiced potato, dunked in tamarind water.", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80" },
  { name: "Bhapa Pitha", location: "Winter, at dusk", desc: "Steamed rice cakes with date palm molasses, made only in the cold months.", img: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80" },
];

export async function FoodGallery() {
  const stories = await getLatestFoodPosts(6);
  const hasContent = stories.length > 0;

  return (
    <section className="ct-section ct-warm">
      <div className="ct-container mb-8 md:mb-10">
        <SectionReveal>
          <p className="text-text-muted text-sm mb-2">Eat first, ask later</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
            Taste of Chittagong
          </h2>
          <p className="text-text-secondary text-base mt-2 max-w-xl">
            Dishes worth building a trip around. Rice, river fish, slow beef, and a sweet course the city takes seriously.
          </p>
        </SectionReveal>
      </div>

      <SectionReveal>
        <div className="ct-food-scroll" role="region" aria-label="Food gallery" tabIndex={0}>
          {hasContent
            ? stories.map((story) => (
                <Link key={story.id} href={`/food/${story.slug}`} className="ct-food-card group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-3">
                    {story.coverMedia?.secureUrl ? (
                      <Image src={story.coverMedia.secureUrl} alt={story.coverMedia.altText || story.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="360px" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4956A]/20 to-[#C9A882]/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/50 to-transparent" />
                    {story.trail && (
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="text-dark-text/50 text-xs uppercase tracking-wider">{story.trail.name}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-base md:text-lg font-semibold text-text group-hover:text-accent transition-colors">{story.title}</h3>
                  {story.excerpt && <p className="text-text-secondary text-sm mt-1 line-clamp-2">{story.excerpt}</p>}
                </Link>
              ))
            : fallbackFoods.map((food, i) => (
                <div key={i} className="ct-food-card">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-3">
                    <Image src={food.img} alt={food.name} fill className="object-cover" sizes="360px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-dark-text/50 text-xs uppercase tracking-wider">{food.location}</span>
                    </div>
                  </div>
                  <h3 className="font-display text-base md:text-lg font-semibold text-text">{food.name}</h3>
                  <p className="text-text-secondary text-sm mt-1">{food.desc}</p>
                </div>
              ))}
        </div>
      </SectionReveal>

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
