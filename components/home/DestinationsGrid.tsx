import Link from "next/link";
import Image from "next/image";
import { SectionReveal } from "@/components/ui";
import { getTrails } from "@/lib/data";

export async function DestinationsGrid() {
  const trails = await getTrails();

  if (trails.length === 0) return null;

  return (
    <section className="ct-section ct-cream">
      <div className="ct-container mb-8 md:mb-10">
        <SectionReveal>
          <p className="text-text-muted text-sm mb-2">{trails.length} places, one city</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
            Pick one.
          </h2>
        </SectionReveal>
      </div>

      <SectionReveal>
        <div className="ct-destinations">
          {trails.slice(0, 12).map((trail) => {
            const coverUrl = trail.coverMedia?.secureUrl || null;
            const excerpt = trail.excerpt || trail.description.replace(/<[^>]*>?/gm, "").substring(0, 80);
            return (
              <Link key={trail.id} href={`/trails/${trail.slug}`} className="ct-dest-card">
                {coverUrl ? (
                  <Image src={coverUrl} alt={trail.coverMedia?.altText || trail.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A882]/30 to-[#7FB5C4]/20" />
                )}
                <div className="ct-dest-card-overlay">
                  <h3 className="ct-dest-card-name">{trail.name}</h3>
                  <p className="ct-dest-card-desc">{excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </SectionReveal>
    </section>
  );
}
