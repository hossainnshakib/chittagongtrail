interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  title,
  subtitle,
  className = "",
  centered = false,
  as = "h2",
}: SectionHeadingProps) {
  const Heading = as;

  return (
    <div
      className={`ct-section-heading ${centered ? "text-center" : ""} ${className}`}
    >
      <Heading className="ct-section-heading-title font-display text-3xl md:text-4xl font-semibold text-text mb-3">
        {title}
      </Heading>
      {subtitle && (
        <p className={`ct-section-heading-subtitle text-text-secondary text-lg max-w-2xl ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
