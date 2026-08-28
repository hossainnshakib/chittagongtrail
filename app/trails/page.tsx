import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, SectionHeading } from "@/components/ui";
import { TrailCard } from "@/components/trails/TrailCard";

export const metadata: Metadata = {
  title: "Trails",
  description:
    "Discover the places that make Chittagong extraordinary. A personal exploration of trails, locations, and hidden gems.",
};

// Placeholder data - will be replaced with database queries
const placeholderTrails = [
  {
    id: 1,
    name: "Patenga Beach",
    slug: "patenga-beach",
    description: "Where the Karnaphuli meets the Bay of Bengal",
    image: "/images/placeholder-trail.jpg",
    journalCount: 3,
  },
  {
    id: 2,
    name: "Foy's Lake",
    slug: "foys-lake",
    description: "A serene escape in the heart of Chittagong",
    image: "/images/placeholder-trail.jpg",
    journalCount: 2,
  },
  {
    id: 3,
    name: "Batali Hill",
    slug: "batali-hill",
    description: "The highest point in Chittagong city",
    image: "/images/placeholder-trail.jpg",
    journalCount: 1,
  },
  {
    id: 4,
    name: "Karnaphuli River",
    slug: "karnaphuli-river",
    description: "The lifeline of Chittagong",
    image: "/images/placeholder-trail.jpg",
    journalCount: 4,
  },
  {
    id: 5,
    name: "Chandanaish",
    slug: "chandanaish",
    description: "Where hills meet the river",
    image: "/images/placeholder-trail.jpg",
    journalCount: 2,
  },
  {
    id: 6,
    name: "Hathazari",
    slug: "hathazari",
    description: "Ancient temples and green hills",
    image: "/images/placeholder-trail.jpg",
    journalCount: 1,
  },
];

export default function TrailsPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="section bg-background pt-32">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading
              title="Trails"
              subtitle="Every place has a story. These are the trails I've walked, the locations I've discovered, and the places that keep calling me back."
            />
          </div>
        </Container>
      </section>

      {/* Trails Grid */}
      <section className="section bg-background-secondary pb-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderTrails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
