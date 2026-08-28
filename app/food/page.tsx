import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, SectionHeading } from "@/components/ui";
import { JournalCard } from "@/components/journal/JournalCard";

export const metadata: Metadata = {
  title: "Food",
  description:
    "Exploring the flavors that define Chittagong's culinary identity. A personal journey through the food culture of Chittagong.",
};

// Placeholder data - will be replaced with database queries filtering JournalPost by category="food"
const placeholderFoodStories = [
  {
    id: 1,
    title: "The Art of Mezbani",
    slug: "the-art-of-mezbani",
    date: "October 20, 2025",
    excerpt: "A traditional Chittagong feast that brings families together. The preparation, the仪式, the flavors — everything about Mezbani is special.",
    image: "/images/placeholder-food.jpg",
    trail: null,
    category: "food",
  },
  {
    id: 2,
    title: "Street Food Adventures",
    slug: "street-food-adventures",
    date: "October 5, 2025",
    excerpt: "Exploring the vibrant street food culture of Chittagong. From fuchka to chotpoti, every corner has something delicious to offer.",
    image: "/images/placeholder-food.jpg",
    trail: null,
    category: "food",
  },
  {
    id: 3,
    title: "Kala Bhuna: A Dark Delight",
    slug: "kala-bhuna-dark-delight",
    date: "September 18, 2025",
    excerpt: "The rich, spicy flavors of Chittagong's signature beef curry. A dish that represents the bold culinary traditions of the region.",
    image: "/images/placeholder-food.jpg",
    trail: null,
    category: "food",
  },
  {
    id: 4,
    title: "The Shutki Experience",
    slug: "the-shutki-experience",
    date: "August 25, 2025",
    excerpt: "Dried fish, or shutki, is a staple in Chittagong cuisine. Love it or hate it, it's an essential part of the local food culture.",
    image: "/images/placeholder-food.jpg",
    trail: null,
    category: "food",
  },
];

export default function FoodPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="section bg-background pt-32">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading
              title="Chittagong Food"
              subtitle="Exploring the flavors that define Chittagong's culinary identity. A personal journey through the food culture of this incredible city."
            />
          </div>
        </Container>
      </section>

      {/* Food Stories Grid */}
      <section className="section bg-background-secondary pb-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderFoodStories.map((story) => (
              <JournalCard key={story.id} story={story} />
            ))}
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
