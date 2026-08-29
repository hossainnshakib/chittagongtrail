import Image from "next/image";
import { SectionReveal } from "@/components/ui";
import { prisma } from "@/lib/prisma";

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
  if (gallery.length === 0) return null;

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
          {gallery.map((item, i) => (
            <div key={item.id} className={`ct-gallery-item ${i === 0 || i === 3 ? 'ct-gallery-item-wide' : ''}`} data-image-reveal>
              <Image src={item.mediaAsset.secureUrl} alt={item.mediaAsset.altText || `Chittagong ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              {item.mediaAsset.altText && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-[#3E2723]/50 to-transparent">
                  <span className="text-dark-text/70 text-xs">{item.mediaAsset.altText}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
