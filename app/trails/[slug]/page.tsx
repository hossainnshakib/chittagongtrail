import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "@/components/layout";
import { Container, Button } from "@/components/ui";
import { getTrailBySlug, getTrails } from "@/lib/data";

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

  return {
    title: trail.metaTitle || trail.name,
    description:
      trail.metaDescription ||
      trail.description.substring(0, 160),
  };
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

  const coverImage = trail.photos?.split(",")[0]?.trim() || null;

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={trail.photoAlt || trail.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-background-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
        <Container className="relative z-10 pb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-text mb-4">
            {trail.name}
          </h1>
        </Container>
      </section>

      {/* Content */}
      <section className="section bg-background">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-line">
                  {trail.description}
                </p>
              </div>

              {/* Photos */}
              {trail.photos && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-semibold text-text mb-6">
                    Photos
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {trail.photos.split(",").map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden bg-background-secondary"
                      >
                        <Image
                          src={photo.trim()}
                          alt={`${trail.name} photo ${index + 1}`}
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
