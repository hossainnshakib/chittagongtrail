import Image from "next/image";
import { SectionReveal } from "@/components/ui";
import { prisma } from "@/lib/prisma";

const demoImages = [
  { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80", alt: "Misty valley" },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80", alt: "Forest trail" },
  { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", alt: "Lake sunset" },
  { src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80", alt: "Green fields" },
  { src: "https://images.unsplash.com/photo-1518173946687-a4276951d1e1?w=800&q=80", alt: "Mountain road" },
  { src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80", alt: "Pine forest" },
  { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", alt: "River bend" },
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
