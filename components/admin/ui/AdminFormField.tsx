interface AdminFormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AdminFormField({
  label,
  htmlFor,
  required,
  description,
  error,
  children,
  className = "",
}: AdminFormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium mb-1.5"
        style={{ color: "var(--admin-text-primary)", fontFamily: "var(--font-body)" }}
      >
        {label}
        {required && (
          <span className="ml-0.5" style={{ color: "var(--admin-error)" }} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {description && (
        <p className="text-xs mb-1.5" style={{ color: "var(--admin-text-muted)" }}>
          {description}
        </p>
      )}
      {children}
      {error && (
        <p className="mt-1 text-xs" style={{ color: "var(--admin-error)" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
