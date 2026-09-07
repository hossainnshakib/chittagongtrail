import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, PublicEmptyState, SectionHeading } from "@/components/ui";
import { JournalCard } from "@/components/journal/JournalCard";
import { getJournalPosts } from "@/lib/data";
import { buildPublicPageMetadata, getSiteUrl, buildBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { getPublicPageSeo } from "@/lib/public-content";

export async function generateMetadata(): Promise<Metadata> {
  return buildPublicPageMetadata("journal");
}

export default async function JournalPage() {
  const [stories, page] = await Promise.all([getJournalPosts(), getPublicPageSeo("journal")]);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl("/") },
    { name: "Journal", url: getSiteUrl("/journal") },
  ]);

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <section className="ct-page-header ct-cream">
        <Container>
          <div className="ct-page-heading">
            <SectionHeading
              as="h1"
              title={page.visibleTitle}
              subtitle={page.visibleDescription}
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
              eyebrow="Journal"
              title="Stories Coming Soon"
              message="Field notes, essays, and local stories from across Chittagong will appear here as they are published."
              headingLevel="h2"
            />
          )}
        </Container>
      </section>
    </PublicLayout>
  );
}
