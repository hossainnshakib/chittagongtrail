import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, PublicEmptyState, SectionHeading } from "@/components/ui";
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
      <section className="ct-page-header ct-cream">
        <Container>
          <div className="ct-page-heading">
            <SectionHeading
              as="h1"
              title="Trails"
              subtitle="Every place has a story. These are the trails documented through genuine exploration — the locations, the history, the culture, and the moments that make each destination extraordinary."
            />
          </div>
        </Container>
      </section>

      <section className="ct-page-body ct-warm">
        <Container>
          {trails.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trails.map((trail) => (
                <TrailCard key={trail.id} trail={trail} />
              ))}
            </div>
          ) : (
            <PublicEmptyState
              eyebrow="Trails"
              title="Trails Coming Soon"
              message="Detailed guides to Chittagong's coast, hills, heritage sites, and neighborhoods will appear here as they are published."
              headingLevel="h2"
            />
          )}
        </Container>
      </section>
    </PublicLayout>
  );
}
