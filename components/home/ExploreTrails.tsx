import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading, Button } from "@/components/ui";
import { getTrails } from "@/lib/data";

export async function ExploreTrails() {
  const trails = await getTrails();

  function getCoverImage(trail: { photos?: string | null }) {
    return trail.photos?.split(",")[0]?.trim() || null;
  }

  return (
    <section className="section bg-background-secondary">
      <Container>
        <SectionHeading
          title="Explore the Trails"
          subtitle="Discover the places that make Chittagong extraordinary — from coastal shores to misty hills, ancient temples to bustling markets."
        />

        {trails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {trails.slice(0, 6).map((trail) => {
              const cover = getCoverImage(trail);
              return (
                <Link
                  key={trail.id}
                  href={`/trails/${trail.slug}`}
                  className="group card"
                >
                  <div className="relative aspect-video overflow-hidden bg-background-secondary">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={trail.photoAlt || trail.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-text-muted text-sm">
                          {trail.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
                      {trail.name}
                    </h3>
                    <p className="text-text-secondary text-sm line-clamp-2">
                      {trail.description.substring(0, 120)}...
                    </p>
                    {trail._count.journalPosts > 0 && (
                      <span className="text-xs text-text-muted mt-2 block">
                        {trail._count.journalPosts}{" "}
                        {trail._count.journalPosts === 1 ? "story" : "stories"}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg mb-4">
              Trails are being documented. Check back soon for explorations of
              Chittagong&apos;s remarkable places.
            </p>
          </div>
        )}

        <div className="text-center">
          <Button href="/trails" variant="secondary">
            View All Trails
          </Button>
        </div>
      </Container>
    </section>
  );
}
