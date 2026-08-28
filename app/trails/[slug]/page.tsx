import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "@/components/layout";
import { Container, Button } from "@/components/ui";
import { getTrailBySlug, getTrails } from "@/lib/data";
import {
  buildMetadata,
  buildTouristAttractionJsonLd,
  buildBreadcrumbJsonLd,
  getSiteUrl,
} from "@/lib/seo";

interface TrailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TrailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trail = await getTrailBySlug(slug);

  if (!trail) {
    return { title: "Trail Not Found" };
  }

  const title = trail.metaTitle || `${trail.name} — Chittagong Trail`;
  const description =
    trail.metaDescription ||
    trail.excerpt ||
    trail.description.replace(/<[^>]*>/g, "").substring(0, 160);

  const ogUrl = trail.ogMedia?.secureUrl || trail.coverMedia?.secureUrl || null;

  return buildMetadata({
    title,
    description,
    path: `/trails/${trail.slug}`,
    image: ogUrl,
    type: "article",
  });
}

export async function generateStaticParams() {
  const trails = await getTrails();
  return trails.map((trail) => ({
    slug: trail.slug,
  }));
}

export default async function TrailPage({ params }: TrailPageProps) {
  const { slug } = await params;
  const trail = await getTrailBySlug(slug);

  if (!trail) {
    notFound();
  }

  const coverUrl = trail.coverMedia?.secureUrl || null;
  const coverAlt = trail.coverMedia?.altText || trail.name;

  const trailJsonLd = buildTouristAttractionJsonLd({
    name: trail.name,
    description: trail.excerpt || trail.description.replace(/<[^>]*>/g, "").substring(0, 300),
    url: getSiteUrl(`/trails/${trail.slug}`),
    image: coverUrl,
    latitude: trail.latitude,
    longitude: trail.longitude,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl("/") },
    { name: "Trails", url: getSiteUrl("/trails") },
    { name: trail.name, url: getSiteUrl(`/trails/${trail.slug}`) },
  ]);

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trailJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={coverAlt}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#F5E6D3]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
        <Container className="relative z-10 pb-8">
          <div className="flex gap-2 mb-2">
            <span className="text-xs bg-[#7FB5C4] text-white px-2 py-1 rounded">
              {trail.district}
            </span>
            {trail.terrainType && (
              <span className="text-xs bg-[#C9A882] text-white px-2 py-1 rounded">
                {trail.terrainType}
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-text mb-2">
            {trail.name}
          </h1>
          {trail.administrativeArea && (
            <p className="text-dark-text/80 text-sm">
              {trail.administrativeArea}{trail.localArea ? ` · ${trail.localArea}` : ""}
            </p>
          )}
        </Container>
      </section>

      {/* Content */}
      <section className="section bg-background">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div
                className="prose prose-lg max-w-none text-text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: trail.description }}
              />

              {/* Gallery */}
              {trail.gallery && trail.gallery.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-semibold text-text mb-6">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {trail.gallery.map((item, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden bg-background-secondary"
                      >
                        <Image
                          src={item.mediaAsset.secureUrl}
                          alt={item.mediaAsset.altText || `${trail.name} gallery ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                      <dt className="text-sm text-text-muted">District</dt>
                      <dd className="text-text font-medium">{trail.district}</dd>
                    </div>
                    {trail.administrativeArea && (
                      <div>
                        <dt className="text-sm text-text-muted">Administrative Area</dt>
                        <dd className="text-text">{trail.administrativeArea}</dd>
                      </div>
                    )}
                    {trail.localArea && (
                      <div>
                        <dt className="text-sm text-text-muted">Local Area</dt>
                        <dd className="text-text">{trail.localArea}</dd>
                      </div>
                    )}
                    {trail.terrainType && (
                      <div>
                        <dt className="text-sm text-text-muted">Terrain Type</dt>
                        <dd className="text-text">{trail.terrainType}</dd>
                      </div>
                    )}
                    {trail.latitude && trail.longitude && (
                      <div>
                        <dt className="text-sm text-text-muted">Coordinates</dt>
                        <dd className="text-text">
                          {trail.latitude.toFixed(4)},{" "}
                          {trail.longitude.toFixed(4)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Related Stories */}
                <div className="card p-6">
                  <h3 className="font-display text-lg font-semibold text-text mb-4">
                    Related Stories
                  </h3>
                  {trail.journalPosts.length > 0 ? (
                    <ul className="space-y-3">
                      {trail.journalPosts.map((post) => (
                        <li key={post.id}>
                          <Link
                            href={`/journal/${post.slug}`}
                            className="text-accent hover:text-accent-secondary transition-colors text-sm"
                          >
                            {post.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-text-secondary text-sm">
                      Stories about this location are being documented.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Navigation */}
      <section className="section bg-background-secondary">
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
