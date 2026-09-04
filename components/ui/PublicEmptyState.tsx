type PublicEmptyStateTone = "light" | "dark";
type PublicEmptyStateAlign = "left" | "center";
type PublicEmptyStateHeading = "h2" | "h3";

interface PublicEmptyStateProps {
  eyebrow?: string;
  title: string;
  message: string;
  tone?: PublicEmptyStateTone;
  align?: PublicEmptyStateAlign;
  headingLevel?: PublicEmptyStateHeading;
  className?: string;
}

export function PublicEmptyState({
  eyebrow,
  title,
  message,
  tone = "light",
  align = "center",
  headingLevel = "h3",
  className = "",
}: PublicEmptyStateProps) {
  const Heading = headingLevel;

  return (
    <div
      className={`ct-empty-state ${tone === "dark" ? "ct-empty-state-dark" : ""} ${className}`}
      data-public-empty-state="compact"
      data-align={align}
    >
      {eyebrow ? <p className="ct-empty-state-eyebrow">{eyebrow}</p> : null}
      <Heading className="ct-empty-state-title">{title}</Heading>
      <p className="ct-empty-state-copy">{message}</p>
    </div>
  );
}
