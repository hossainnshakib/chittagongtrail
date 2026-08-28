import { Container } from "@/components/ui";

export function SeasonalMood() {
  return (
    <section className="section bg-background relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-teal/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-text-muted text-lg">
                Seasonal Image Placeholder
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Editorial
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text mt-2 mb-6">
              The Monsoon Whispers
            </h2>
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
          </div>
        </div>
      </Container>
    </section>
  );
}
