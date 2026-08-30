"use client";

import Link from "next/link";
import AdminBreadcrumbs from "./AdminBreadcrumbs";

interface AdminTopbarProps {
  onMenuToggle: () => void;
}

export default function AdminTopbar({ onMenuToggle }: AdminTopbarProps) {
  return (
    <header className="admin-topbar" role="banner">
      <div className="admin-topbar-left">
        <button
          className="admin-hamburger admin-focus-ring"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <AdminBreadcrumbs />
      </div>
      <div className="admin-topbar-right">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-focus-ring inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
          style={{
            color: "var(--admin-text-secondary)",
            border: "1px solid var(--admin-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--admin-brand-accent)";
            e.currentTarget.style.color = "var(--admin-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--admin-border)";
            e.currentTarget.style.color = "var(--admin-text-secondary)";
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15,3 21,3 21,9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span className="hidden sm:inline">View Site</span>
        </Link>
      </div>
    </header>
  );
}
