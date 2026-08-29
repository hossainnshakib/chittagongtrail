import Link from "next/link";
import Image from "next/image";
import { Container, SectionReveal } from "@/components/ui";
import { getTrails } from "@/lib/data";

export async function DestinationsGrid() {
  const trails = await getTrails();

  if (trails.length === 0) return null;

  return (
    <section className="section-cream py-16 md:py-24 lg:py-32">
      <Container>
        <SectionReveal>
          <div className="mb-10 md:mb-14">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-3">
              {trails.length} places, one city
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
              Pick one.
            </h2>
          </div>
        </SectionReveal>

        <SectionReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {trails.slice(0, 12).map((trail) => {
              const coverUrl = trail.coverMedia?.secureUrl || null;
              const coverAlt = trail.coverMedia?.altText || trail.name;
              const excerpt =
                trail.excerpt ||
                trail.description.replace(/<[^>]*>?/gm, "").substring(0, 80);

              return (
                <Link
                  key={trail.id}
                  href={`/trails/${trail.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-lg block"
                >
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={coverAlt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C9A882]/30 to-[#7FB5C4]/20 group-hover:from-[#C9A882]/40 group-hover:to-[#7FB5C4]/30 transition-all duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/80 via-[#3E2723]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="font-display text-base md:text-lg font-semibold text-dark-text mb-1">
                      {trail.name}
                    </h3>
                    <p className="text-dark-text/60 text-xs md:text-sm line-clamp-1">
                      {excerpt}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
