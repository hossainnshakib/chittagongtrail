import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, SectionHeading } from "@/components/ui";
import { buildPageMetadata, getSiteUrl, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/settings-service";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return buildPageMetadata(
    `About — ${settings.siteName}`,
    `About ${settings.siteName} — an independent exploration and storytelling platform documenting Chittagong's places, culture, history, and people.`,
    "/about"
  );
}

export default async function AboutPage() {
  const settings = await getPublicSiteSettings();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl("/") },
    { name: "About", url: getSiteUrl("/about") },
  ]);

  const socialLinks = [
    settings.socialFacebook && { name: "Facebook", href: settings.socialFacebook },
    settings.socialInstagram && { name: "Instagram", href: settings.socialInstagram },
    settings.socialYouTube && { name: "YouTube", href: settings.socialYouTube },
    settings.socialX && { name: "X / Twitter", href: settings.socialX },
    settings.socialThreads && { name: "Threads", href: settings.socialThreads },
    settings.socialLinkedIn && { name: "LinkedIn", href: settings.socialLinkedIn },
    settings.socialTikTok && { name: "TikTok", href: settings.socialTikTok },
  ].filter(Boolean) as Array<{ name: string; href: string }>;

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
              title={`About ${settings.siteName}`}
              subtitle="An independent platform documenting Chittagong through genuine exploration and authentic editorial voice."
            />
          </div>
        </Container>
      </section>

      <section className="ct-page-body ct-warm">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-headings:font-display prose-headings:text-text prose-p:text-text-secondary">
              <h2>The Platform</h2>
              <p>
                {settings.siteName} is an independently operated exploration and
                storytelling platform focused on presenting Chittagong in its
                full geographic, cultural, historical, natural, culinary, and
                human context. The platform documents places, stories, food,
                culture, history, landscapes, and people across Chittagong —
                from the hills to the coast, from ancient heritage to modern
                urban life.
              </p>
              <p>
                The project is guided by genuine exploration and careful
                observation, offering visitors meaningful, accurate, and broadly
                useful knowledge about the regions, communities, and traditions
                being documented.
              </p>

              <h2>The Approach</h2>
              <p>
                {settings.siteName} is personally operated and curated. The founder
                explores, documents, and narrates the platform, providing an
                authentic human perspective. This personal approach gives the
                website its editorial voice while keeping the focus firmly on
                Chittagong itself.
              </p>
              <p>
                The editorial principle is simple: the founder is the explorer,
                narrator, and curator. Chittagong is the central subject. Every
                trail, every story, every observation is presented to illuminate
                what makes this city and its surroundings extraordinary.
              </p>

              <h2>What Gets Documented</h2>
              <p>
                The platform covers the full breadth of Chittagong&apos;s character:
                city and urban life, towns and rural areas, rivers and coast,
                hills and natural landscapes, trails and destinations, food and
                culinary traditions, history and heritage, culture and language,
                communities and people, local experiences and observations,
                familiar and lesser-known places, and the changing seasons that
                shape this region.
              </p>
              <p>
                Coverage is not limited to personal preference or familiar
                locations. {settings.siteName} aims to present a comprehensive,
                responsible, and fact-aware portrait of Chittagong — one that
                serves both curious visitors and those with deeper connections
                to the region.
              </p>

              <h2>The Name</h2>
              <p>
                &quot;{settings.siteName}&quot; represents the idea that every journey
                leaves a path behind. Every walk, every discovery, every story —
                they all become part of a trail that others can follow. The name
                is also a promise: this platform will always be rooted in
                Chittagong, always focused on this incredible city and its
                surrounding regions.
              </p>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-display text-xl font-semibold text-text mb-4">
                  Follow the Trail
                </h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-secondary transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
