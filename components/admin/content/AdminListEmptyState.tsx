export default function AdminListEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-content-empty" role="status">
      <svg className="admin-content-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
      </svg>
      <h3 className="admin-content-empty-title">{title}</h3>
      {description && <p className="admin-content-empty-desc">{description}</p>}
      {action && <div className="admin-content-empty-action">{action}</div>}
    </div>
  );
}
