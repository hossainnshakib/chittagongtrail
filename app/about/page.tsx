import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Chittagong Trail — an independent exploration and storytelling platform documenting Chittagong's places, culture, history, and people.",
};

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="section bg-background pt-32">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading
              title="About Chittagong Trail"
              subtitle="An independent platform documenting Chittagong through genuine exploration and authentic editorial voice."
            />
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="section bg-background-secondary pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-headings:font-display prose-headings:text-text prose-p:text-text-secondary">
              <h2>The Platform</h2>
              <p>
                Chittagong Trail is an independently operated exploration and
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
                Chittagong Trail is personally operated and curated. The founder
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
                locations. Chittagong Trail aims to present a comprehensive,
                responsible, and fact-aware portrait of Chittagong — one that
                serves both curious visitors and those with deeper connections
                to the region.
              </p>

              <h2>The Name</h2>
              <p>
                &quot;Chittagong Trail&quot; represents the idea that every journey
                leaves a path behind. Every walk, every discovery, every story —
                they all become part of a trail that others can follow. The name
                is also a promise: this platform will always be rooted in
                Chittagong, always focused on this incredible city and its
                surrounding regions.
              </p>
            </div>

            {/* Social Links */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-display text-xl font-semibold text-text mb-4">
                Follow the Trail
              </h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://facebook.com/chittagongtrail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-secondary transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="https://instagram.com/chittagongtrail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-secondary transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://youtube.com/@chittagongtrail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-secondary transition-colors"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
