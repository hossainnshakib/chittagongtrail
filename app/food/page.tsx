import { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { Container, SectionHeading } from "@/components/ui";
import { JournalCard } from "@/components/journal/JournalCard";
import { getFoodPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Food",
  description:
    "Exploring Chittagong's culinary traditions, street food, regional flavors, and the food culture that defines this extraordinary city.",
};

export default async function FoodPage() {
  const stories = await getFoodPosts();

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="section bg-background pt-32">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading
              title="Chittagong Food"
              subtitle="Exploring the culinary traditions, street food, regional flavors, and food culture that define Chittagong's extraordinary gastronomic landscape."
            />
          </div>
        </Container>
      </section>

      {/* Food Stories Grid */}
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
                Food Stories Coming Soon
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Chittagong&apos;s rich culinary traditions are being documented.
                Check back soon for explorations of street food, regional
                flavors, and the food culture that defines this extraordinary
                city.
              </p>
            </div>
          )}
        </Container>
      </section>
    </PublicLayout>
  );
}
