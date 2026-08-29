import { Container } from "@/components/ui";
import Image from "next/image";

interface SeasonalMoodProps {
  eyebrow?: string;
  title?: string;
  content?: string | null;
  media?: {
    secureUrl: string;
    altText: string | null;
  } | null;
}

export function SeasonalMood({ eyebrow, title, content, media }: SeasonalMoodProps) {
  if (
    (!eyebrow || eyebrow.trim() === "") &&
    (!title || title.trim() === "") &&
    (!content || content.trim() === "") &&
    !media
  ) {
    return null; // Hidden state when seasonal mood has no configured content
  }

  const displayEyebrow = eyebrow && eyebrow.trim() !== "" ? eyebrow : "Editorial";
  const displayTitle = title && title.trim() !== "" ? title : "The Monsoon Whispers";
  
  const displayContent =
    content && content.trim() !== "" ? (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    ) : (
      <div className="space-y-4 text-text-secondary text-lg">
        <p>
          When the rains come to Chittagong, the city transforms. The hills
          turn emerald green, the rivers swell with purpose, and there&apos;s a
          certain magic in the air that makes every walk an adventure.
        </p>
        <p>
          This is when I find myself reaching for my camera most often — not
          to capture perfection, but to document the beautiful chaos of a
          city embracing the monsoon.
        </p>
      </div>
    );

  return (
    <section className="section bg-background relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#FDF5E6] border border-[#E8DCC8]">
            {media ? (
              <Image
                src={media.secureUrl}
                alt={media.altText || displayTitle}
                fill
                className="object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-teal/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-text-muted text-lg">Seasonal Image Placeholder</span>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              {displayEyebrow}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text mt-2 mb-6">
              {displayTitle}
            </h2>
            {displayContent}
          </div>
        </div>
      </Container>
    </section>
  );
}
