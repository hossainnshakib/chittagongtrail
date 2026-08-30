export type AdminStatus = "draft" | "published" | "archived";

interface AdminStatusBadgeProps {
  status: AdminStatus;
  className?: string;
}

const statusConfig: Record<AdminStatus, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "#92400E", bg: "#FEF3C7" },
  published: { label: "Published", color: "#065F46", bg: "#D1FAE5" },
  archived: { label: "Archived", color: "#374151", bg: "#F3F4F6" },
};

export default function AdminStatusBadge({ status, className = "" }: AdminStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${className}`}
      style={{ backgroundColor: config.bg, color: config.color }}
      role="status"
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ backgroundColor: config.color }}
        aria-hidden="true"
      />
      <span className="sr-only">Status: </span>
      {config.label}
    </span>
  );
}
