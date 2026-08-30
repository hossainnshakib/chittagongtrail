interface AdminStickyActionBarProps {
  children: React.ReactNode;
  visible?: boolean;
  className?: string;
}

export default function AdminStickyActionBar({
  children,
  visible = true,
  className = "",
}: AdminStickyActionBarProps) {
  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-10 border-t ${className}`}
      style={{
        backgroundColor: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.06)",
        marginLeft: "var(--admin-sidebar-width)",
      }}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-3 max-w-[var(--admin-content-width)]">
        {children}
      </div>
      <style>{`
        @media (max-width: 1023px) {
          .admin-sticky-bar { margin-left: 0 !important; }
        }
        @media (min-width: 1024px) and (max-width: 1439px) {
          .admin-sticky-bar { margin-left: var(--admin-sidebar-collapsed-width) !important; }
        }
      `}</style>
    </div>
  );
}
