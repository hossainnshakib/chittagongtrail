import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/layout";
import { Container, Button } from "@/components/ui";

// Placeholder data - will be replaced with database queries
const placeholderTrails: Record<string, { name: string; description: string; location: string; coordinates: { lat: number; lng: number }; images: string[] }> = {
  "patenga-beach": {
    name: "Patenga Beach",
    description:
      "Patenga Beach is where the Karnaphuli River meets the Bay of Bengal. It's one of the most popular beaches in Chittagong, offering a unique blend of river and sea landscapes.",
    location: "Patenga, Chittagong",
    coordinates: { lat: 22.2389, lng: 91.7833 },
    images: ["/images/placeholder-trail.jpg"],
  },
  "foys-lake": {
    name: "Foy's Lake",
    description:
      "Foy's Lake is a man-made lake in Chittagong, Bangladesh. It was created in 1924 by damming the Foy's Lake area. The lake is surrounded by hills and is a popular recreational area.",
    location: "Foy's Lake, Chittagong",
    coordinates: { lat: 22.3569, lng: 91.7933 },
    images: ["/images/placeholder-trail.jpg"],
  },
  "batali-hill": {
    name: "Batali Hill",
    description:
      "Batali Hill is the highest point in Chittagong city, offering panoramic views of the city, the Bay of Bengal, and the surrounding hills.",
    location: "Batali Hill, Chittagong",
    coordinates: { lat: 22.3344, lng: 91.8167 },
    images: ["/images/placeholder-trail.jpg"],
  },
  "karnaphuli-river": {
    name: "Karnaphuli River",
    description:
      "The Karnaphuli River is the principal river of Chittagong. It flows through the city and is an important waterway for transportation and trade.",
    location: "Karnaphuli, Chittagong",
    coordinates: { lat: 22.2167, lng: 91.7833 },
    images: ["/images/placeholder-trail.jpg"],
  },
  chandanaish: {
    name: "Chandanaish",
    description:
      "Chandanaish is an upazila of Chittagong District. It is known for its beautiful hills, rivers, and rural landscapes.",
    location: "Chandanaish, Chittagong",
    coordinates: { lat: 22.2333, lng: 92.0167 },
    images: ["/images/placeholder-trail.jpg"],
  },
  hathazari: {
    name: "Hathazari",
    description:
      "Hathazari is an upazila of Chittagong District. It is known for its ancient temples, green hills, and rural charm.",
    location: "Hathazari, Chittagong",
    coordinates: { lat: 22.4333, lng: 91.7833 },
    images: ["/images/placeholder-trail.jpg"],
  },
};

interface TrailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TrailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trail = placeholderTrails[slug];

  if (!trail) {
    return { title: "Trail Not Found" };
  }

  return {
    title: trail.name,
    description: trail.description,
  };
}

export default async function TrailPage({ params }: TrailPageProps) {
  const { slug } = await params;
  const trail = placeholderTrails[slug];

  if (!trail) {
    notFound();
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
        <Container className="relative z-10 pb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-text mb-4">
            {trail.name}
          </h1>
          <p className="text-dark-text/80 text-lg">{trail.location}</p>
        </Container>
      </section>

      {/* Content */}
      <section className="section bg-background">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <p className="text-text-secondary text-lg leading-relaxed">
                  {trail.description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Location Info */}
                <div className="card p-6">
                  <h3 className="font-display text-lg font-semibold text-text mb-4">
                    Location Information
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-text-muted">Location</dt>
                      <dd className="text-text">{trail.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-text-muted">Coordinates</dt>
                      <dd className="text-text">
                        {trail.coordinates.lat}, {trail.coordinates.lng}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Related Stories */}
                <div className="card p-6">
                  <h3 className="font-display text-lg font-semibold text-text mb-4">
                    Related Stories
                  </h3>
                  <p className="text-text-secondary text-sm">
                    No stories yet for this location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="section bg-dark-bg">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-dark-text mb-6">
            Location
          </h2>
          <div className="aspect-[16/9] rounded-lg overflow-hidden bg-dark-bg/50 border border-dark-text/20">
            <div className="h-full flex items-center justify-center">
              <p className="text-dark-text/60">Map integration coming soon</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Navigation */}
      <section className="section bg-background">
        <Container>
          <div className="flex justify-between items-center">
            <Button href="/trails" variant="secondary">
              ← All Trails
            </Button>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
