import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, SectionHeading } from "@/components/ui";
import { JournalCard } from "@/components/journal/JournalCard";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Stories, observations, and discoveries from the trail. Personal accounts of exploring Chittagong.",
};

// Placeholder data - will be replaced with database queries
const placeholderStories = [
  {
    id: 1,
    title: "Winter Evening at Patenga",
    slug: "winter-evening-at-patenga",
    date: "December 15, 2025",
    excerpt: "The sun sets over the Bay of Bengal, painting the sky in hues of orange and purple. I stand at the edge of the shore, watching the day end in spectacular fashion.",
    image: "/images/placeholder-journal.jpg",
    trail: "Patenga Beach",
    category: "story",
  },
  {
    id: 2,
    title: "Walking Through Old Chittagong",
    slug: "walking-through-old-chittagong",
    date: "November 28, 2025",
    excerpt: "Every street in the old quarter tells a story of centuries past. The colonial architecture, the narrow lanes, the ancient temples — all whispering tales of history.",
    image: "/images/placeholder-journal.jpg",
    trail: "Old Chittagong",
    category: "story",
  },
  {
    id: 3,
    title: "Morning at Foy's Lake",
    slug: "morning-at-foys-lake",
    date: "November 10, 2025",
    excerpt: "The quiet hours before the city awakens, when the lake belongs to the birds and the mist hangs low over the water.",
    image: "/images/placeholder-journal.jpg",
    trail: "Foy's Lake",
    category: "story",
  },
  {
    id: 4,
    title: "The Art of Mezbani",
    slug: "the-art-of-mezbani",
    date: "October 20, 2025",
    excerpt: "A traditional Chittagong feast that brings families together. The preparation, the仪式, the flavors — everything about Mezbani is special.",
    image: "/images/placeholder-food.jpg",
    trail: null,
    category: "food",
  },
  {
    id: 5,
    title: "Street Food Adventures",
    slug: "street-food-adventures",
    date: "October 5, 2025",
    excerpt: "Exploring the vibrant street food culture of Chittagong. From fuchka to chotpoti, every corner has something delicious to offer.",
    image: "/images/placeholder-food.jpg",
    trail: null,
    category: "food",
  },
];

export default function JournalPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="section bg-background pt-32">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading
              title="Journal"
              subtitle="Stories, observations, and discoveries from the trail. Every walk, every conversation, every moment worth remembering."
            />
          </div>
        </Container>
      </section>

      {/* Stories Grid */}
      <section className="section bg-background-secondary pb-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderStories.map((story) => (
              <JournalCard key={story.id} story={story} />
            ))}
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
