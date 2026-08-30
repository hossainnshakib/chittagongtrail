interface AdminDistrictBadgeProps {
  district: string;
  className?: string;
}

export default function AdminDistrictBadge({ district, className = "" }: AdminDistrictBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${className}`}
      style={{
        backgroundColor: "var(--admin-surface)",
        color: "var(--admin-text-secondary)",
        border: "1px solid var(--admin-border)",
      }}
    >
      {district}
    </span>
  );
}
