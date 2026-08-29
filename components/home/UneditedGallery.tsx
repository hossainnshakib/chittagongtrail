import Image from "next/image";
import { Container, SectionReveal } from "@/components/ui";
import { prisma } from "@/lib/prisma";

async function getGalleryImages() {
  try {
    const images = await prisma.homepageGallery.findMany({
      orderBy: { sortOrder: "asc" },
      include: { mediaAsset: true },
      take: 7,
    });
    return images;
  } catch {
    return [];
  }
}

export async function UneditedGallery() {
  const gallery = await getGalleryImages();

  if (gallery.length === 0) return null;

  return (
    <section className="section-cream py-16 md:py-24 lg:py-32">
      <Container>
        <SectionReveal>
          <div className="mb-10 md:mb-14">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-3">
              Unedited
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
              What it actually looks like
            </h2>
          </div>
        </SectionReveal>
      </Container>

      {/* Mixed aspect ratio gallery */}
      <SectionReveal>
        <div className="px-4 md:px-[max(1.5rem,calc((100vw-1200px)/2+2rem))]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[250px]">
            {gallery.map((item, index) => {
              const isLarge = index === 0 || index === 3;
              return (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-lg ${
                    isLarge ? "col-span-2 row-span-2" : ""
                  }`}
                  data-image-reveal
                >
                  <Image
                    src={item.mediaAsset.secureUrl}
                    alt={item.mediaAsset.altText || `Chittagong moment ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {item.mediaAsset.altText && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-[#3E2723]/60 to-transparent">
                      <span className="text-dark-text/80 text-xs">
                        {item.mediaAsset.altText}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
