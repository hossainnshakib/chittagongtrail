import Image from "next/image";
import { Container, SectionReveal } from "@/components/ui";
import { prisma } from "@/lib/prisma";

async function getGalleryImages() {
  try {
    const images = await prisma.homepageGallery.findMany({
      orderBy: { sortOrder: "asc" },
      include: { mediaAsset: true },
      take: 4,
    });
    return images;
  } catch {
    return [];
  }
}

export async function VisualInterlude() {
  const gallery = await getGalleryImages();

  if (gallery.length === 0) return null;

  return (
    <section className="section-cream py-12 md:py-16 lg:py-20">
      <Container>
        <SectionReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {gallery.map((item, index) => {
              const isPortrait = item.mediaAsset.height && item.mediaAsset.width
                ? item.mediaAsset.height > item.mediaAsset.width
                : index % 3 === 1;

              return (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-lg ${
                    isPortrait ? "aspect-[3/4]" : "aspect-square md:aspect-[4/3]"
                  }`}
                  data-image-reveal
                >
                  <Image
                    src={item.mediaAsset.secureUrl}
                    alt={item.mediaAsset.altText || `Chittagong moment ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                </div>
              );
            })}
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
