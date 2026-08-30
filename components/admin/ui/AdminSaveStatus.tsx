export type AdminSaveStatusType = "clean" | "dirty" | "saving" | "saved" | "error";

interface AdminSaveStatusProps {
  status: AdminSaveStatusType;
  className?: string;
}

const statusMessages: Record<AdminSaveStatusType, { label: string; color: string; icon: React.ReactNode }> = {
  clean: { label: "", color: "transparent", icon: null },
  dirty: { label: "Unsaved changes", color: "var(--admin-warning)", icon: null },
  saving: { label: "Saving...", color: "var(--admin-info)", icon: null },
  saved: { label: "Saved", color: "var(--admin-success)", icon: null },
  error: { label: "Save failed", color: "var(--admin-error)", icon: null },
};

export default function AdminSaveStatus({ status, className = "" }: AdminSaveStatusProps) {
  const config = statusMessages[status];

  if (status === "clean") return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}
      style={{ color: config.color }}
      role="status"
      aria-live="polite"
    >
      {status === "saving" && (
        <div
          className="w-3 h-3 border rounded-full animate-spin"
          style={{ borderColor: config.color, borderTopColor: "transparent" }}
          aria-hidden="true"
        />
      )}
      {status === "saved" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20,6 9,17 4,12" />
        </svg>
      )}
      {status === "error" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      {config.label}
    </div>
  );
}
