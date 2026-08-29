import Link from "next/link";
import Image from "next/image";
import { SectionReveal } from "@/components/ui";
import { getTrails } from "@/lib/data";

const demoTrails = [
  { name: "Batali Hill", slug: "batali-hill", excerpt: "The green heart of Chittagong — dawn walks above the city.", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { name: "Karnaphuli River", slug: "karnaphuli-river", excerpt: "The river that built Chittagong. Boats, bridges, ghats.", img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80" },
  { name: "Patenga Beach", slug: "patenga-beach", excerpt: "Where the Bay of Bengal meets the river mouth.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
  { name: "Chittagong Hill Tracts", slug: "hill-tracts", excerpt: "Rolling green hills, indigenous villages, untouched trails.", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80" },
  { name: "Colonial Architecture", slug: "colonial-architecture", excerpt: "British-era buildings in the old quarters of the city.", img: "https://images.unsplash.com/photo-1555952494-efd681c7e3f9?w=600&q=80" },
  { name: "Shutki Market", slug: "shutki-market", excerpt: "Chittagong's fiercest flavours — dried fish, fermented and bold.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80" },
  { name: "Foy's Lake", slug: "foys-lake", excerpt: "A lake in the hills — boating, hiking, quiet afternoons.", img: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80" },
  { name: "Chittagong Port", slug: "chittagong-port", excerpt: "The busiest port in Bangladesh — where the city's trade flows.", img: "https://images.unsplash.com/photo-1494564605686-2e931f77a8e2?w=600&q=80" },
  { name: "Hazari Lane", slug: "hazari-lane", excerpt: "The Hindu quarter — temples, colours, old Chittagong life.", img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&q=80" },
];

export async function DestinationsGrid() {
  const trails = await getTrails();
  const displayTrails = trails.length > 0
    ? trails.slice(0, 12).map((t) => ({
        name: t.name,
        slug: t.slug,
        excerpt: t.excerpt || t.description.replace(/<[^>]*>?/gm, "").substring(0, 80),
        coverUrl: t.coverMedia?.secureUrl || null,
        altText: t.coverMedia?.altText || t.name,
      }))
    : demoTrails.map((t) => ({
        name: t.name,
        slug: t.slug,
        excerpt: t.excerpt,
        coverUrl: t.img,
        altText: t.name,
      }));

  return (
    <section className="ct-section ct-cream">
      <div className="ct-container mb-8 md:mb-10">
        <SectionReveal>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
            Pick one.
          </h2>
        </SectionReveal>
      </div>

      <SectionReveal>
        <div className="ct-destinations">
          {displayTrails.map((trail) => (
            <Link key={trail.slug} href={`/trails/${trail.slug}`} className="ct-dest-card">
              {trail.coverUrl ? (
                <Image src={trail.coverUrl} alt={trail.altText} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A882]/30 to-[#7FB5C4]/20" />
              )}
              <div className="ct-dest-card-overlay">
                <h3 className="ct-dest-card-name">{trail.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
