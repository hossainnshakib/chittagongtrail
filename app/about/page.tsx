import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Chittagong Trail — a personal journal documenting one person's journeys through Chittagong, Bangladesh.",
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
              subtitle="Why this journal exists and the person behind the trail."
            />
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="section bg-background-secondary pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-headings:font-display prose-headings:text-text prose-p:text-text-secondary">
              <h2>Why This Journal Exists</h2>
              <p>
                Chittagong Trail exists because I believe this city deserves to
                be documented with care, honesty, and genuine appreciation for
                what makes it special. Too often, Chittagong is overlooked or
                misunderstood. This journal is my attempt to change that.
              </p>
              <p>
                Every trail I walk, every corner I turn, every conversation I
                have — it all becomes part of this ongoing story about a city
                that continues to surprise me. I wanted a place to share these
                discoveries, not as a tourism board or a government website, but
                as one person&apos;s genuine exploration of a place I love.
              </p>

              <h2>What Gets Documented</h2>
              <p>
                This journal covers the places I visit, the stories I find, the
                food I taste, the people I meet, and the experiences that shape
                my understanding of Chittagong. It&apos;s not about checking off
                tourist attractions — it&apos;s about genuine discovery.
              </p>
              <p>
                I document the famous landmarks, yes, but also the hidden gems,
                the everyday moments, and the things that make Chittagong
                uniquely itself. The monsoon rains, the winter mornings, the
                river at sunset, the street food at midnight — these are the
                stories I want to tell.
              </p>

              <h2>The Philosophy</h2>
              <p>
                Chittagong Trail is personal. It&apos;s one person&apos;s perspective, one
                person&apos;s journey. I don&apos;t claim to be an expert or a
                professional travel writer. I&apos;m just someone who loves this city
                and wants to share what I discover.
              </p>
              <p>
                The journal is meant to feel like a conversation with a friend
                who happens to know Chittagong well. It&apos;s warm, genuine, and
                always honest. If something is beautiful, I&apos;ll say so. If
                something is challenging, I&apos;ll mention that too. This is real
                exploration, not a marketing brochure.
              </p>

              <h2>The Name</h2>
              <p>
                &quot;Chittagong Trail&quot; represents the idea that every journey leaves
                a path behind. Every walk I take, every place I discover, every
                story I find — it all becomes part of a trail that others can
                follow. The name is also a promise: this journal will always be
                rooted in Chittagong, always focused on this incredible city.
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
