import Link from "next/link";
import Image from "next/image";
import { SectionReveal } from "@/components/ui";
import { getTrails } from "@/lib/data";

export async function DestinationsGrid() {
  const trails = await getTrails();
  const displayTrails = trails.slice(0, 4);

  return (
    <section className="ct-section ct-cream">
      <div className="ct-container mb-8 md:mb-12">
        <SectionReveal>
          <p className="text-text-muted text-xs uppercase tracking-[0.2em] font-medium mb-3">
            Explore Trails
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
            Pick one.
          </h2>
        </SectionReveal>
      </div>

      {displayTrails.length === 0 ? (
        <div className="ct-container">
          <SectionReveal>
            <p className="text-text-secondary text-base py-12 text-center">
              Featured trails will appear here once configured in Admin.
            </p>
          </SectionReveal>
        </div>
      ) : (
        <SectionReveal>
          <div className="ct-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {displayTrails[0] && (
                <Link
                  href={`/trails/${displayTrails[0].slug}`}
                  className="group relative overflow-hidden rounded-lg lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:min-h-[480px]"
                >
                  {displayTrails[0].coverMedia?.secureUrl ? (
                    <Image
                      src={displayTrails[0].coverMedia.secureUrl}
                      alt={displayTrails[0].coverMedia.altText || displayTrails[0].name}
                      fill
                      className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent-teal/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/70 via-dark-bg/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
                    <span className="text-dark-text/50 text-xs uppercase tracking-wider block mb-2">
                      Featured
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-dark-text mb-2">
                      {displayTrails[0].name}
                    </h3>
                    {displayTrails[0].excerpt && (
                      <p className="text-dark-text/60 text-sm md:text-base max-w-md leading-relaxed">
                        {displayTrails[0].excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-accent text-xs uppercase tracking-[0.15em] font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore trail →
                    </span>
                  </div>
                </Link>
              )}

              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                {displayTrails.slice(1).map((trail, i) => (
                  <Link
                    key={trail.slug}
                    href={`/trails/${trail.slug}`}
                    className="group relative overflow-hidden rounded-lg aspect-square"
                  >
                    {trail.coverMedia?.secureUrl ? (
                      <Image
                        src={trail.coverMedia.secureUrl}
                        alt={trail.coverMedia.altText || trail.name}
                        fill
                        className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-teal/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/70 via-dark-bg/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="ct-number text-lg text-accent block mb-1">
                        {String(i + 2).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-sm md:text-base font-semibold text-dark-text leading-tight">
                        {trail.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-accent text-[11px] uppercase tracking-[0.15em] font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      )}
    </section>
  );
}
