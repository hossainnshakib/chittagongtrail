import { Container, SectionHeading } from "@/components/ui";

// Placeholder data - will be replaced with actual gallery images
const placeholderImages = [
  { id: 1, location: "Patenga Beach", aspect: "landscape" },
  { id: 2, location: "Batali Hill", aspect: "portrait" },
  { id: 3, location: "Karnaphuli River", aspect: "landscape" },
  { id: 4, location: "Foy's Lake", aspect: "square" },
  { id: 5, location: "Old Chittagong", aspect: "landscape" },
  { id: 6, location: "Chandanaish", aspect: "portrait" },
];

export function UneditedGallery() {
  return (
    <section className="section bg-background">
      <Container>
        <SectionHeading
          title="Unedited"
          subtitle="Moments captured as they happened."
          centered
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {placeholderImages.map((image) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-lg bg-background-secondary ${
                image.aspect === "portrait"
                  ? "aspect-[3/4]"
                  : image.aspect === "square"
                  ? "aspect-square"
                  : "aspect-video"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-text-muted text-sm">{image.location}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
