interface AdminSectionCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  action?: React.ReactNode;
}

export default function AdminSectionCard({
  title,
  description,
  children,
  className = "",
  noPadding = false,
  action,
}: AdminSectionCardProps) {
  return (
    <section
      className={`rounded-lg border ${className}`}
      style={{
        backgroundColor: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
        boxShadow: "var(--admin-shadow)",
      }}
    >
      {(title || description || action) && (
        <div
          className={noPadding ? "px-6 pt-5 pb-2 flex items-start justify-between gap-4" : "px-6 pt-5 pb-0 flex items-start justify-between gap-4"}
          style={{ borderBottom: title ? "none" : undefined }}
        >
          <div className="flex-1 min-w-0">
            {title && (
              <h2
                className="text-sm font-semibold"
                style={{ color: "var(--admin-text-primary)", fontFamily: "var(--font-body)" }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-xs" style={{ color: "var(--admin-text-muted)" }}>
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-6"}>{children}</div>
    </section>
  );
}
