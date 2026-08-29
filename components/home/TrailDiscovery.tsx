import Link from "next/link";
import Image from "next/image";
import { Container, Button } from "@/components/ui";
import { SectionReveal } from "@/components/ui";
import { getTrails } from "@/lib/data";

export async function TrailDiscovery() {
  const trails = await getTrails();

  if (trails.length === 0) return null;

  const featured = trails[0];
  const supporting = trails.slice(1, 5);

  const getCover = (trail: { coverMedia?: { secureUrl: string } | null; name: string }) =>
    trail.coverMedia?.secureUrl || null;

  return (
    <section className="section-warm py-16 md:py-24 lg:py-32">
      <Container>
        <SectionReveal>
          {/* Section header */}
          <div className="mb-10 md:mb-14">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-3">
              Explore
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
              Trails of Chittagong
            </h2>
          </div>
        </SectionReveal>

        {/* Featured trail — full width */}
        <SectionReveal>
          <Link
            href={`/trails/${featured.slug}`}
            className="group trail-tile block mb-4 md:mb-6"
            data-reveal
          >
            <div className="relative aspect-[16/7] md:aspect-[21/9] overflow-hidden rounded-lg">
              {getCover(featured) ? (
                <Image
                  src={getCover(featured)!}
                  alt={featured.coverMedia?.altText || featured.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A882]/30 to-[#7FB5C4]/20" />
              )}
              <div className="trail-tile-overlay rounded-lg" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
                <p className="text-dark-text/60 text-xs uppercase tracking-[0.15em] mb-2">
                  {featured.district.replace("_", " ")}
                </p>
                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-dark-text mb-2">
                  {featured.name}
                </h3>
                {(featured.excerpt || featured.description) && (
                  <p className="text-dark-text/70 text-sm md:text-base max-w-lg line-clamp-2">
                    {featured.excerpt ||
                      featured.description.replace(/<[^>]*>?/gm, "").substring(0, 150)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </SectionReveal>

        {/* Supporting trails — mosaic */}
        {supporting.length > 0 && (
          <SectionReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {supporting.map((trail) => (
                <Link
                  key={trail.id}
                  href={`/trails/${trail.slug}`}
                  className="group trail-tile"
                  data-reveal
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    {getCover(trail) ? (
                      <Image
                        src={getCover(trail)!}
                        alt={trail.coverMedia?.altText || trail.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 300px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#C9A882]/20 to-[#7FB5C4]/10" />
                    )}
                    <div className="trail-tile-overlay rounded-lg" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <h3 className="font-display text-base md:text-lg font-semibold text-dark-text leading-tight">
                        {trail.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </SectionReveal>
        )}

        {/* CTA */}
        <SectionReveal>
          <div className="mt-10 md:mt-14">
            <Button href="/trails" variant="secondary">
              Explore All Trails
            </Button>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
