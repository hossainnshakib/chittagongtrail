import Link from "next/link";

interface AdminButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export default function AdminButton({
  children,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled,
  loading,
  className = "",
  onClick,
  ariaLabel,
}: AdminButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors admin-focus-ring disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs min-h-[32px]",
    md: "px-4 py-2 text-sm min-h-[40px]",
    lg: "px-5 py-2.5 text-sm min-h-[44px]",
  };

  const variantColors: Record<string, { bg: string; text: string; border: string; hoverBg: string }> = {
    primary: {
      bg: "var(--admin-brand-accent)",
      text: "#FFFFFF",
      border: "transparent",
      hoverBg: "var(--admin-brand-hover)",
    },
    secondary: {
      bg: "var(--admin-surface)",
      text: "var(--admin-text-primary)",
      border: "var(--admin-border)",
      hoverBg: "var(--admin-bg)",
    },
    ghost: {
      bg: "transparent",
      text: "var(--admin-text-secondary)",
      border: "transparent",
      hoverBg: "rgba(0,0,0,0.04)",
    },
    danger: {
      bg: "#DC2626",
      text: "#FFFFFF",
      border: "transparent",
      hoverBg: "#B91C1C",
    },
  };

  const colors = variantColors[variant];

  const style: React.CSSProperties = {
    backgroundColor: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    fontFamily: "var(--font-body)",
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${className}`;

  const content = (
    <>
      {loading && (
        <div
          className="w-4 h-4 border-2 rounded-full animate-spin"
          style={{ borderColor: colors.text, borderTopColor: "transparent" }}
          aria-hidden="true"
        />
      )}
      {children}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={combinedClassName}
        style={style}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClassName}
      style={style}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
