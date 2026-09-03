import Image from "next/image";
import { SectionReveal } from "@/components/ui";

interface GalleryItem {
  id: number;
  sortOrder: number;
  mediaAsset: {
    id: number;
    secureUrl: string;
    altText: string | null;
  };
}

interface UneditedGalleryProps {
  galleryItems?: GalleryItem[];
}

export async function UneditedGallery({ galleryItems }: UneditedGalleryProps) {
  const gallery = galleryItems && galleryItems.length > 0 ? galleryItems : [];

  return (
    <section className="ct-section ct-cream">
      <div className="ct-container mb-8 md:mb-10">
        <SectionReveal>
          <p className="text-text-muted text-xs uppercase tracking-[0.2em] font-medium mb-3">
            Gallery
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
            What it actually looks like
          </h2>
        </SectionReveal>
      </div>

      {gallery.length === 0 ? (
        <div className="ct-container">
          <SectionReveal>
            <p className="text-text-secondary text-base py-12 text-center">
              Gallery images will appear here once curated in Admin (Gallery).
            </p>
          </SectionReveal>
        </div>
      ) : (
        <SectionReveal>
          <div className="ct-gallery-grid">
            {gallery.map((item, i) => (
              <div
                key={item.id}
                className={`ct-gallery-item ${i === 0 || i === 3 ? "ct-gallery-item-wide" : ""}`}
              >
                <Image
                  src={item.mediaAsset.secureUrl}
                  alt={item.mediaAsset.altText || `Chittagong ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {item.mediaAsset.altText && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-dark-bg/50 to-transparent">
                    <span className="text-dark-text/70 text-xs">
                      {item.mediaAsset.altText}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionReveal>
      )}
    </section>
  );
}
