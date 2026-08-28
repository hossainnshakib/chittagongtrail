import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PublicLayout } from "@/components/layout";
import { Container, Button } from "@/components/ui";
import { getFoodPostBySlug, getFoodPosts } from "@/lib/data";

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

  return {
    title: story.metaTitle || story.title,
    description:
      story.metaDescription ||
      (story.excerpt || story.content.replace(/<[^>]*>/g, "").substring(0, 160)),
  };
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

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        {story.coverImage ? (
          <Image
            src={story.coverImage}
            alt={story.coverImageAlt || story.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-background-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
        <Container className="relative z-10 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-dark-text/70 text-sm">
              {new Date(story.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
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
          <div className="flex justify-between items-center">
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
