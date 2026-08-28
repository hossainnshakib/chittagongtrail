import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading, Button } from "@/components/ui";

// Placeholder data - will be replaced with database queries
const placeholderFoodStories = [
  {
    id: 1,
    title: "The Art of Mezbani",
    slug: "the-art-of-mezbani",
    date: "October 20, 2025",
    excerpt: "A traditional Chittagong feast that brings families together.",
    image: "/images/placeholder-food.jpg",
  },
  {
    id: 2,
    title: "Street Food Adventures",
    slug: "street-food-adventures",
    date: "October 5, 2025",
    excerpt: "Exploring the vibrant street food culture of Chittagong.",
    image: "/images/placeholder-food.jpg",
  },
  {
    id: 3,
    title: "Kala Bhuna: A Dark Delight",
    slug: "kala-bhuna-dark-delight",
    date: "September 18, 2025",
    excerpt: "The rich, spicy flavors of Chittagong's signature beef curry.",
    image: "/images/placeholder-food.jpg",
  },
];

export function Food() {
  return (
    <section className="section bg-background-secondary">
      <Container>
        <SectionHeading
          title="Chittagong Food"
          subtitle="Exploring the flavors that define Chittagong's culinary identity."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {placeholderFoodStories.map((story) => (
            <Link
              key={story.id}
              href={`/food/${story.slug}`}
              className="group card"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="text-xs text-text-muted">{story.date}</span>
                <h3 className="font-display text-xl font-semibold text-text mt-2 mb-2 group-hover:text-accent transition-colors">
                  {story.title}
                </h3>
                <p className="text-text-secondary text-sm line-clamp-2">
                  {story.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button href="/food" variant="secondary">
            Explore Food
          </Button>
        </div>
      </Container>
    </section>
  );
}
