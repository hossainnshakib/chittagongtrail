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
  const variantClass = `admin-btn-${variant}`;
  const sizeClass = `admin-btn-${size}`;
  const loadingClass = loading ? "admin-btn-loading" : "";

  const combinedClassName = `admin-btn ${variantClass} ${sizeClass} ${loadingClass} ${className}`.trim();

  const content = (
    <>
      {loading && (
        <span className="sr-only" aria-live="polite">Loading...</span>
      )}
      {children}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={combinedClassName}
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
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
