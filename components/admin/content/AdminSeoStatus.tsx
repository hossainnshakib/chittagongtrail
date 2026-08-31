export type AdminSeoReadinessStatus = "ready" | "needs-attention" | "incomplete";

const config: Record<AdminSeoReadinessStatus, { label: string; color: string; bg: string }> = {
  ready: { label: "Ready", color: "#065F46", bg: "#D1FAE5" },
  "needs-attention": { label: "Needs attention", color: "#92400E", bg: "#FEF3C7" },
  incomplete: { label: "Incomplete", color: "#991B1B", bg: "#FEE2E2" },
};

export default function AdminSeoStatus({
  status,
  missingFields,
  className = "",
}: {
  status: AdminSeoReadinessStatus;
  missingFields?: string[];
  className?: string;
}) {
  const c = config[status] || config.incomplete;
  const tooltip = missingFields?.length ? `Missing: ${missingFields.join(", ")}` : undefined;

  return (
    <span
      className={`admin-content-seo-badge ${className}`}
      style={{ backgroundColor: c.bg, color: c.color }}
      role="status"
      title={tooltip}
      aria-label={`SEO readiness: ${c.label}${tooltip ? ` — ${tooltip}` : ""}`}
    >
      <span className="sr-only">SEO: </span>
      {c.label}
    </span>
  );
}
