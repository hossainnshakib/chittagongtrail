"use client";

import AdminNavItem from "./AdminNavItem";
import { adminNavigation, adminUtilityItems } from "../navigation";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      <div
        className="admin-mobile-backdrop"
        data-open={isOpen ? "true" : undefined}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="admin-sidebar"
        data-open={isOpen ? "true" : undefined}
        aria-label="Admin navigation"
      >
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1614" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6l-6 6-4-4-6 6" />
            </svg>
          </div>
          <span className="admin-sidebar-logo-text">Chittagong Trail</span>
        </div>

        <nav className="admin-sidebar-nav" role="navigation">
          {adminNavigation.map((group) => (
            <div key={group.label || "main"} className="admin-nav-group">
              {group.label && (
                <div className="admin-nav-group-label">{group.label}</div>
              )}
              {group.items.map((item) => (
                <AdminNavItem
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  disabled={item.disabled}
                  tooltip={item.tooltip}
                  onClick={onClose}
                />
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          {adminUtilityItems.map((item) => (
            <AdminNavItem
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.icon}
              onClick={onClose}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
