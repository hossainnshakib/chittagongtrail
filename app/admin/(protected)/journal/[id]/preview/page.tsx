import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "@/components/layout";
import { Container } from "@/components/ui";
import { getJournalPreviewById } from "@/lib/journal-service";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

interface JournalPreviewPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: JournalPreviewPageProps): Promise<Metadata> {
  await requireAdmin();
  const { id } = await params;
  const post = await getJournalPreviewById(parseInt(id, 10));

  if (!post) {
    return { title: "Journal Preview Not Found" };
  }

  return buildMetadata({
    title: `[PREVIEW ${post.status}] ${post.metaTitle || post.title} — Chittagong Trail`,
    description: post.metaDescription || post.excerpt || "Admin Journal Preview",
    path: `/admin/journal/${post.id}/preview`,
  });
}

export default async function JournalPreviewPage({ params }: JournalPreviewPageProps) {
  await requireAdmin();
  const { id } = await params;
  const post = await getJournalPreviewById(parseInt(id, 10));

  if (!post) {
    notFound();
  }

  const coverUrl = post.coverMedia?.secureUrl || null;
  const coverAlt = post.coverMedia?.altText || post.title;
  const publicRoute = post.type === "FOOD" ? `/food/${post.slug}` : `/journal/${post.slug}`;

  return (
    <PublicLayout>
      {/* Admin Preview Notification Banner */}
      <div className="bg-[#5D4037] text-white py-3 px-4 text-center text-sm font-medium sticky top-0 z-50 flex items-center justify-center gap-4 shadow-md">
        <span>
          ⚠️ ADMIN PREVIEW MODE — Type: <strong className="underline">{post.type}</strong> | Status: <strong className="underline">{post.status}</strong>
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/journal/${post.id}/edit`}
            className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] px-3 py-1 rounded text-xs transition-colors"
          >
            Edit Post
          </Link>
          <Link
            href="/admin/journal"
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
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-[#7FB5C4] text-white px-2 py-1 rounded">
              {post.type}
            </span>
            <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded">
              {post.status}
            </span>
            {post.publishedAt && (
              <span className="text-dark-text/70 text-sm">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {post.trail && (
              <>
                <span className="text-dark-text/50">·</span>
                <Link
                  href={`/admin/trails/${post.trail.id}/preview`}
                  className="text-dark-accent text-sm hover:text-dark-text transition-colors"
                >
                  {post.trail.name}
                </Link>
              </>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-text">
            {post.title}
          </h1>
        </Container>
      </section>

      {/* Content */}
      <section className="section bg-background">
        <Container>
          <div className="max-w-3xl mx-auto">
            <article
              className="prose prose-lg prose-headings:font-display prose-headings:text-text prose-p:text-text-secondary prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </Container>
      </section>

      {/* Navigation */}
      <section className="section bg-background-secondary">
        <Container>
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            <Link
              href="/admin/journal"
              className="text-[#5D4037] hover:text-[#C9A882] font-medium text-sm"
            >
              ← Back to Journal Administration
            </Link>
            <span className="text-xs text-[#8D6E63] font-mono">
              Public Route (when published): {publicRoute}
            </span>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
