export type AdminContentType = "trail" | "story" | "food";

interface AdminContentTypeBadgeProps {
  type: AdminContentType;
  className?: string;
}

const typeConfig: Record<AdminContentType, { label: string; color: string; bg: string }> = {
  trail: { label: "Trail", color: "#155E75", bg: "#CFFAFE" },
  story: { label: "Story", color: "#1E40AF", bg: "#DBEAFE" },
  food: { label: "Food", color: "#9A3412", bg: "#FFEDD5" },
};

export default function AdminContentTypeBadge({ type, className = "" }: AdminContentTypeBadgeProps) {
  const config = typeConfig[type] || typeConfig.story;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${className}`}
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <span className="sr-only">Type: </span>
      {config.label}
    </span>
  );
}
