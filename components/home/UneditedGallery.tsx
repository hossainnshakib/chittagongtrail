import Image from "next/image";
import { SectionReveal } from "@/components/ui";
import { prisma } from "@/lib/prisma";

const demoImages = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", alt: "Hills at dawn" },
  { src: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80", alt: "River boats" },
  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", alt: "Patenga Beach" },
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", alt: "Hill tracts" },
  { src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80", alt: "Old city lanes" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", alt: "Street food" },
  { src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80", alt: "Foy's Lake" },
];

async function getGalleryImages() {
  try {
    return await prisma.homepageGallery.findMany({
      orderBy: { sortOrder: "asc" },
      include: { mediaAsset: true },
      take: 7,
    });
  } catch { return []; }
}

export async function UneditedGallery() {
  const gallery = await getGalleryImages();
  const hasContent = gallery.length > 0;

  return (
    <section className="ct-section ct-cream">
      <div className="ct-container mb-8 md:mb-10">
        <SectionReveal>
          <p className="text-text-muted text-sm mb-2">Unedited</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
            What it actually looks like
          </h2>
        </SectionReveal>
      </div>

      <SectionReveal>
        <div className="ct-gallery-grid">
          {hasContent
            ? gallery.map((item, i) => (
                <div key={item.id} className={`ct-gallery-item ${i === 0 || i === 3 ? 'ct-gallery-item-wide' : ''}`} data-image-reveal>
                  <Image src={item.mediaAsset.secureUrl} alt={item.mediaAsset.altText || `Chittagong ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                  {item.mediaAsset.altText && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-[#3E2723]/50 to-transparent">
                      <span className="text-dark-text/70 text-xs">{item.mediaAsset.altText}</span>
                    </div>
                  )}
                </div>
              ))
            : demoImages.map((img, i) => (
                <div key={i} className={`ct-gallery-item ${i === 0 || i === 3 ? 'ct-gallery-item-wide' : ''}`} data-image-reveal>
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-[#3E2723]/50 to-transparent">
                    <span className="text-dark-text/70 text-xs">{img.alt}</span>
                  </div>
                </div>
              ))}
        </div>
      </SectionReveal>
    </section>
  );
}
