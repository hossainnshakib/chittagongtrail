interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--admin-text-primary)", fontFamily: "var(--font-body)" }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm" style={{ color: "var(--admin-text-secondary)" }}>
              {description}
            </p>
          )}
        </div>
        {(primaryAction || secondaryAction || children) && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {secondaryAction}
            {primaryAction}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
