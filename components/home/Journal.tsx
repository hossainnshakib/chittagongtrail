import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading, Button } from "@/components/ui";

// Placeholder data - will be replaced with database queries
const placeholderStories = [
  {
    id: 1,
    title: "Winter Evening at Patenga",
    slug: "winter-evening-at-patenga",
    date: "December 15, 2025",
    excerpt: "The sun sets over the Bay of Bengal, painting the sky in hues of orange and purple.",
    image: "/images/placeholder-journal.jpg",
    trail: "Patenga Beach",
  },
  {
    id: 2,
    title: "Walking Through Old Chittagong",
    slug: "walking-through-old-chittagong",
    date: "November 28, 2025",
    excerpt: "Every street in the old quarter tells a story of centuries past.",
    image: "/images/placeholder-journal.jpg",
    trail: "Old Chittagong",
  },
  {
    id: 3,
    title: "Morning at Foy's Lake",
    slug: "morning-at-foys-lake",
    date: "November 10, 2025",
    excerpt: "The quiet hours before the city awakens, when the lake belongs to the birds.",
    image: "/images/placeholder-journal.jpg",
    trail: "Foy's Lake",
  },
];

export function Journal() {
  return (
    <section className="section bg-background">
      <Container>
        <SectionHeading
          title="Journal"
          subtitle="Stories, observations, and discoveries from the trail."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {placeholderStories.map((story) => (
            <Link
              key={story.id}
              href={`/journal/${story.slug}`}
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-text-muted">{story.date}</span>
                  {story.trail && (
                    <>
                      <span className="text-text-muted">·</span>
                      <span className="text-xs text-accent">{story.trail}</span>
                    </>
                  )}
                </div>
                <h3 className="font-display text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
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
          <Button href="/journal" variant="secondary">
            View Journal
          </Button>
        </div>
      </Container>
    </section>
  );
}
