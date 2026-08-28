interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  className = "",
  centered = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-8 ${centered ? "text-center" : ""} ${className}`}
    >
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-text mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
