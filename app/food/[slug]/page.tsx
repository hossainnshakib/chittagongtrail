import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PublicLayout } from "@/components/layout";
import { Container, Button } from "@/components/ui";
import { getFoodPostBySlug, getFoodPosts } from "@/lib/data";
import {
  buildMetadata,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  getSiteUrl,
} from "@/lib/seo";

interface FoodPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: FoodPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getFoodPostBySlug(slug);

  if (!story) {
    return { title: "Food Story Not Found" };
  }

  const title = story.metaTitle || `${story.title} — Chittagong Trail`;
  const description =
    story.metaDescription ||
    (story.excerpt || story.content.replace(/<[^>]*>/g, "").substring(0, 160));

  const coverUrl = story.coverMedia?.secureUrl || null;
  const ogUrl = story.ogMedia?.secureUrl || coverUrl;

  return buildMetadata({
    title,
    description,
    path: `/food/${story.slug}`,
    image: ogUrl,
    type: "article",
    publishedTime: story.publishedAt?.toISOString(),
    modifiedTime: story.updatedAt.toISOString(),
  });
}

export async function generateStaticParams() {
  const posts = await getFoodPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function FoodDetailPage({ params }: FoodPageProps) {
  const { slug } = await params;
  const story = await getFoodPostBySlug(slug);

  if (!story) {
    notFound();
  }

  const coverUrl = story.coverMedia?.secureUrl || null;
  const coverAlt = story.coverMedia?.altText || story.title;

  const articleJsonLd = buildArticleJsonLd({
    title: story.title,
    description:
      story.metaDescription ||
      story.excerpt ||
      story.content.replace(/<[^>]*>/g, "").substring(0, 200),
    image: coverUrl,
    datePublished: story.publishedAt?.toISOString() || story.createdAt.toISOString(),
    dateModified: story.updatedAt.toISOString(),
    url: getSiteUrl(`/food/${story.slug}`),
    type: story.type,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl("/") },
    { name: "Food", url: getSiteUrl("/food") },
    { name: story.title, url: getSiteUrl(`/food/${story.slug}`) },
  ]);

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
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
          <div className="flex items-center gap-2 mb-4">
            {story.publishedAt && (
              <span className="text-dark-text/70 text-sm">
                {new Date(story.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-text">
            {story.title}
          </h1>
        </Container>
      </section>

      {/* Content */}
      <section className="section bg-background">
        <Container>
          <div className="max-w-3xl mx-auto">
            <article
              className="prose prose-lg prose-headings:font-display prose-headings:text-text prose-p:text-text-secondary prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </div>
        </Container>
      </section>

      {/* Navigation */}
      <section className="section bg-background-secondary">
        <Container>
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            <Button href="/food" variant="secondary">
              ← All Food Stories
            </Button>
            <Button href="/journal" variant="secondary">
              View Journal →
            </Button>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
