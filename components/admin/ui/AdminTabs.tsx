"use client";

interface AdminTabsProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function AdminTabs({ tabs, activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div
      className="flex gap-0 border-b overflow-x-auto"
      style={{ borderColor: "var(--admin-border)" }}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors admin-focus-ring ${
              isActive ? "border-b-2" : ""
            }`}
            style={{
              color: isActive ? "var(--admin-text-primary)" : "var(--admin-text-muted)",
              borderColor: isActive ? "var(--admin-brand-accent)" : "transparent",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: isActive
                ? `2px solid var(--admin-brand-accent)`
                : "2px solid transparent",
              marginBottom: "-1px",
              cursor: "pointer",
            }}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full"
                style={{
                  backgroundColor: isActive
                    ? "var(--admin-brand-accent)"
                    : "var(--admin-border)",
                  color: isActive ? "#FFFFFF" : "var(--admin-text-muted)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
