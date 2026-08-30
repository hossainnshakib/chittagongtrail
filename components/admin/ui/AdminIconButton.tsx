interface AdminIconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "ghost" | "bordered";
  size?: "sm" | "md";
}

export default function AdminIconButton({
  icon,
  label,
  onClick,
  disabled,
  className = "",
  variant = "ghost",
  size = "md",
}: AdminIconButtonProps) {
  const sizeStyles: Record<string, string> = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    ghost: {
      backgroundColor: "transparent",
      border: "none",
      color: "var(--admin-text-secondary)",
    },
    bordered: {
      backgroundColor: "var(--admin-surface)",
      border: "1px solid var(--admin-border)",
      color: "var(--admin-text-secondary)",
    },
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md transition-colors admin-focus-ring ${sizeStyles[size]} ${className}`}
      style={{
        ...variantStyles[variant],
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      type="button"
    >
      {icon}
    </button>
  );
}
