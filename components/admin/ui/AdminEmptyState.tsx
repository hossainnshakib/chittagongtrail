interface AdminEmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export default function AdminEmptyState({ title, description, action, icon }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4" style={{ color: "var(--admin-text-muted)" }}>
          {icon}
        </div>
      )}
      <h3
        className="text-sm font-medium"
        style={{ color: "var(--admin-text-primary)", fontFamily: "var(--font-body)" }}
      >
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm max-w-sm" style={{ color: "var(--admin-text-muted)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
