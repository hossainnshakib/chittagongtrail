import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, SectionHeading } from "@/components/ui";
import { JournalCard } from "@/components/journal/JournalCard";
import { getJournalPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Stories, observations, and discoveries from across Chittagong — places, culture, history, food, and the experiences that shape this city.",
};

export default async function JournalPage() {
  const stories = await getJournalPosts();

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="section bg-background pt-32">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading
              title="Journal"
              subtitle="Stories, observations, and discoveries from across Chittagong — places, culture, history, food, and the experiences that shape this extraordinary city."
            />
          </div>
        </Container>
      </section>

      {/* Stories Grid */}
      <section className="section bg-background-secondary pb-16">
        <Container>
          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <JournalCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="font-display text-2xl font-semibold text-text mb-4">
                Stories Coming Soon
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                The journal is being prepared with stories about
                Chittagong&apos;s places, culture, history, and people. Check
                back soon for explorations of this extraordinary city.
              </p>
            </div>
          )}
        </Container>
      </section>
    </PublicLayout>
  );
}
