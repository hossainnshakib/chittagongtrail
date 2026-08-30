interface AdminSectionCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function AdminSectionCard({
  title,
  description,
  children,
  className = "",
  noPadding = false,
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
      {(title || description) && (
        <div
          className={noPadding ? "px-6 pt-5 pb-2" : "px-6 pt-5 pb-0"}
          style={{ borderBottom: title ? "none" : undefined }}
        >
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
      )}
      <div className={noPadding ? "" : "p-6"}>{children}</div>
    </section>
  );
}
