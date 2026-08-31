import Link from "next/link";

export interface AdminRowAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
}

export default function AdminRowActions({ actions }: { actions: AdminRowAction[] }) {
  return (
    <div className="admin-content-row-actions" role="group" aria-label="Row actions">
      {actions.map((action, i) => {
        if (action.href && !action.disabled) {
          return (
            <Link
              key={i}
              href={action.href}
              className={`admin-content-row-action admin-content-row-action-${action.variant || "default"}`}
              aria-label={action.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {action.label}
            </Link>
          );
        }
        return (
          <button
            key={i}
            type="button"
            className={`admin-content-row-action admin-content-row-action-${action.variant || "default"}`}
            onClick={action.onClick}
            disabled={action.disabled}
            aria-label={action.label}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
