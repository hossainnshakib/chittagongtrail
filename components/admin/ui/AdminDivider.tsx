interface AdminDividerProps {
  className?: string;
  vertical?: boolean;
}

export default function AdminDivider({ className = "", vertical = false }: AdminDividerProps) {
  if (vertical) {
    return (
      <div
        className={`w-px h-5 ${className}`}
        style={{ backgroundColor: "var(--admin-border)" }}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  return (
    <hr
      className={`border-0 h-px ${className}`}
      style={{ backgroundColor: "var(--admin-border)" }}
      role="separator"
    />
  );
}
