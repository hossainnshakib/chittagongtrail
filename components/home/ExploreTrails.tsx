import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading, Button } from "@/components/ui";

// Placeholder data - will be replaced with database queries
const placeholderTrails = [
  {
    id: 1,
    name: "Patenga Beach",
    slug: "patenga-beach",
    description: "Where the Karnaphuli meets the Bay of Bengal",
    image: "/images/placeholder-trail.jpg",
  },
  {
    id: 2,
    name: "Foy's Lake",
    slug: "foys-lake",
    description: "A serene escape in the heart of Chittagong",
    image: "/images/placeholder-trail.jpg",
  },
  {
    id: 3,
    name: "Batali Hill",
    slug: "batali-hill",
    description: "The highest point in Chittagong city",
    image: "/images/placeholder-trail.jpg",
  },
];

export function ExploreTrails() {
  return (
    <section className="section bg-background-secondary">
      <Container>
        <SectionHeading
          title="Explore the Trails"
          subtitle="Discover the places that make Chittagong extraordinary."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {placeholderTrails.map((trail) => (
            <Link
              key={trail.id}
              href={`/trails/${trail.slug}`}
              className="group card"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={trail.image}
                  alt={trail.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
                  {trail.name}
                </h3>
                <p className="text-text-secondary text-sm">{trail.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button href="/trails" variant="secondary">
            View All Trails
          </Button>
        </div>
      </Container>
    </section>
  );
}
