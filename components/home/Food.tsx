import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading, Button } from "@/components/ui";
import { getLatestFoodPosts } from "@/lib/data";

export async function Food() {
  const stories = await getLatestFoodPosts(3);

  return (
    <section className="section bg-background-secondary">
      <Container>
        <SectionHeading
          title="Chittagong Food"
          subtitle="Exploring the culinary traditions, street food, and regional flavors that define Chittagong's food culture."
        />

        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/food/${story.slug}`}
                className="group card"
              >
                <div className="relative aspect-video overflow-hidden bg-background-secondary">
                  {story.coverImage ? (
                    <Image
                      src={story.coverImage}
                      alt={story.coverImageAlt || story.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-text-muted text-sm">
                        {story.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs text-text-muted">
                    {new Date(story.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-text mt-2 mb-2 group-hover:text-accent transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {story.excerpt ||
                      story.content.substring(0, 120) + "..."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg mb-4">
              Food stories are being documented. Check back soon for
              explorations of Chittagong&apos;s culinary traditions and flavors.
            </p>
          </div>
        )}

        <div className="text-center">
          <Button href="/food" variant="secondary">
            Explore Food
          </Button>
        </div>
      </Container>
    </section>
  );
}
