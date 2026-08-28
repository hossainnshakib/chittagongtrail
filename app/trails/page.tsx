import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, SectionHeading } from "@/components/ui";
import { TrailCard } from "@/components/trails/TrailCard";
import { getTrails } from "@/lib/data";
import { buildPageMetadata, getSiteUrl, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(
  "Trails — Explore Places in Chittagong",
  "Discover the places that make Chittagong extraordinary — coastal shores, misty hills, ancient temples, bustling markets, and hidden gems across the region.",
  "/trails"
);

export default async function TrailsPage() {
  const trails = await getTrails();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl("/") },
    { name: "Trails", url: getSiteUrl("/trails") },
  ]);

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero Section */}
      <section className="section bg-background pt-32">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading
              title="Trails"
              subtitle="Every place has a story. These are the trails documented through genuine exploration — the locations, the history, the culture, and the moments that make each destination extraordinary."
            />
          </div>
        </Container>
      </section>

      {/* Trails Grid */}
      <section className="section bg-background-secondary pb-16">
        <Container>
          {trails.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trails.map((trail) => (
                <TrailCard key={trail.id} trail={trail} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="font-display text-2xl font-semibold text-text mb-4">
                Trails Coming Soon
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Chittagong&apos;s remarkable places are being explored and
                documented. Check back soon for detailed guides to the
                region&apos;s coastal shores, misty hills, ancient heritage sites,
                and hidden gems.
              </p>
            </div>
          )}
        </Container>
      </section>
    </PublicLayout>
  );
}
