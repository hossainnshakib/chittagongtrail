import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "@/components/layout";
import { Container } from "@/components/ui";
import { getJournalPreviewById } from "@/lib/journal-service";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

interface FoodPreviewPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: FoodPreviewPageProps): Promise<Metadata> {
  await requireAdmin();
  const { id } = await params;
  const post = await getJournalPreviewById(parseInt(id, 10));

  if (!post || post.type !== "FOOD") {
    return { title: "Food Preview Not Found" };
  }

  return buildMetadata({
    title: `[PREVIEW ${post.status}] ${post.metaTitle || post.title} — Chittagong Trail`,
    description: post.metaDescription || post.excerpt || "Admin Food Preview",
    path: `/food/${post.slug}`,
  });
}

export default async function FoodPreviewPage({ params }: FoodPreviewPageProps) {
  await requireAdmin();
  const { id } = await params;
  const post = await getJournalPreviewById(parseInt(id, 10));

  if (!post || post.type !== "FOOD") {
    notFound();
  }

  const coverUrl = post.coverMedia?.secureUrl || null;
  const coverAlt = post.coverMedia?.altText || post.title;
  const publicPath = `/food/${post.slug}`;

  return (
    <PublicLayout>
      {/* Admin Preview Notification Banner */}
      <div className="bg-[#5D4037] text-white py-3 px-4 text-center text-sm font-medium sticky top-0 z-50 flex items-center justify-center gap-4 shadow-md">
        <span>
          ⚠️ ADMIN PREVIEW MODE — Type: <strong className="underline">FOOD</strong> | Status: <strong className="underline">{post.status}</strong> | Canonical: <code className="bg-black/20 px-1 py-0.5 rounded">{publicPath}</code>
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/food/${post.id}/edit`}
            className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] px-3 py-1 rounded text-xs transition-colors"
          >
            Edit Food Post
          </Link>
          <Link
            href="/admin/food"
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
              FOOD
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
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-dark-text/90 max-w-2xl">{post.excerpt}</p>
          )}
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <Container className="max-w-3xl">
          <div
            className="prose prose-lg max-w-none text-[#5D4037] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Container>
      </section>
    </PublicLayout>
  );
}
