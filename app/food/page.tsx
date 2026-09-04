import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, PublicEmptyState, SectionHeading } from "@/components/ui";
import { JournalCard } from "@/components/journal/JournalCard";
import { getFoodPosts } from "@/lib/data";
import { buildPageMetadata, getSiteUrl, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(
  "Food — Chittagong's Culinary Traditions",
  "Exploring Chittagong's culinary traditions, street food, regional flavors, and the food culture that defines this extraordinary city.",
  "/food"
);

export default async function FoodPage() {
  const stories = await getFoodPosts();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl("/") },
    { name: "Food", url: getSiteUrl("/food") },
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
              title="Chittagong Food"
              subtitle="Exploring the culinary traditions, street food, regional flavors, and food culture that define Chittagong's extraordinary gastronomic landscape."
            />
          </div>
        </Container>
      </section>

      <section className="ct-page-body ct-warm">
        <Container>
          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <JournalCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <PublicEmptyState
              eyebrow="Food"
              title="Food Stories Coming Soon"
              message="Stories about Chittagong's street food, regional flavors, and culinary traditions will appear here as they are published."
              headingLevel="h2"
            />
          )}
        </Container>
      </section>
    </PublicLayout>
  );
}
