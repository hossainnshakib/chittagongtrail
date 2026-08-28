import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "@/components/layout";
import { Container } from "@/components/ui";
import { getTrailPreviewById } from "@/lib/trail-service";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

interface TrailPreviewPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TrailPreviewPageProps): Promise<Metadata> {
  await requireAdmin();
  const { id } = await params;
  const trail = await getTrailPreviewById(parseInt(id, 10));

  if (!trail) {
    return { title: "Trail Preview Not Found" };
  }

  return buildMetadata({
    title: `[PREVIEW ${trail.status}] ${trail.metaTitle || trail.name} — Chittagong Trail`,
    description: trail.metaDescription || trail.excerpt || "Admin Trail Preview",
    path: `/admin/trails/${trail.id}/preview`,
  });
}

export default async function TrailPreviewPage({ params }: TrailPreviewPageProps) {
  await requireAdmin();
  const { id } = await params;
  const trail = await getTrailPreviewById(parseInt(id, 10));

  if (!trail) {
    notFound();
  }

  const coverUrl = trail.coverMedia?.secureUrl || null;
  const coverAlt = trail.coverMedia?.altText || trail.name;

  return (
    <PublicLayout>
      {/* Admin Preview Notification Banner */}
      <div className="bg-[#5D4037] text-white py-3 px-4 text-center text-sm font-medium sticky top-0 z-50 flex items-center justify-center gap-4 shadow-md">
        <span>
          ⚠️ ADMIN PREVIEW MODE — Status: <strong className="underline">{trail.status}</strong>
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/trails/${trail.id}/edit`}
            className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] px-3 py-1 rounded text-xs transition-colors"
          >
            Edit Trail
          </Link>
          <Link
            href="/admin/trails"
            className="bg-[#8D6E63] hover:bg-[#A1887F] text-white px-3 py-1 rounded text-xs transition-colors"
          >
            Back to Admin
          </Link>
        </div>
      </div>

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
            <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded">
              {trail.status}
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
            <div className="lg:col-span-2">
              <div
                className="prose prose-lg max-w-none text-text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: trail.description }}
              />

              {/* Gallery */}
              {trail.gallery && trail.gallery.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-semibold text-text mb-6">
                    Gallery ({trail.gallery.length})
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
                <div className="card p-6">
                  <h3 className="font-display text-lg font-semibold text-text mb-4">
                    Preview Details
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-text-muted">Status</dt>
                      <dd className="text-text font-medium">{trail.status}</dd>
                    </div>
                    <div>
                      <dt className="text-text-muted">Slug</dt>
                      <dd className="text-text font-mono">/{trail.slug}</dd>
                    </div>
                    <div>
                      <dt className="text-text-muted">District</dt>
                      <dd className="text-text font-medium">{trail.district}</dd>
                    </div>
                    {trail.latitude && trail.longitude && (
                      <div>
                        <dt className="text-text-muted">Coordinates</dt>
                        <dd className="text-text font-mono">
                          {trail.latitude}, {trail.longitude}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
