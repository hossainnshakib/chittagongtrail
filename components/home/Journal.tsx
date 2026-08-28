import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading, Button } from "@/components/ui";
import { getLatestJournalPosts } from "@/lib/data";

export async function Journal() {
  const stories = await getLatestJournalPosts(3);

  return (
    <section className="section bg-background">
      <Container>
        <SectionHeading
          title="Journal"
          subtitle="Stories, observations, and discoveries from across Chittagong — places, culture, history, and the experiences that shape this city."
        />

        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/journal/${story.slug}`}
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-text-muted">
                      {new Date(story.publishedDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                    {story.trail && (
                      <>
                        <span className="text-text-muted">·</span>
                        <span className="text-xs text-accent">
                          {story.trail.name}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
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
              Stories are being gathered. Check back soon for explorations of
              Chittagong&apos;s places, culture, and people.
            </p>
          </div>
        )}

        <div className="text-center">
          <Button href="/journal" variant="secondary">
            View Journal
          </Button>
        </div>
      </Container>
    </section>
  );
}
