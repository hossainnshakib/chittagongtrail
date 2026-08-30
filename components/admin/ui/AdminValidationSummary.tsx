interface AdminValidationSummaryProps {
  errors: string[];
  className?: string;
}

export default function AdminValidationSummary({ errors, className = "" }: AdminValidationSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div
      className={`rounded-lg border p-4 ${className}`}
      style={{
        backgroundColor: "#FEF2F2",
        borderColor: "#FECACA",
      }}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#DC2626"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <h3
            className="text-sm font-medium"
            style={{ color: "#991B1B", fontFamily: "var(--font-body)" }}
          >
            Please fix {errors.length} {errors.length === 1 ? "error" : "errors"}
          </h3>
          <ul className="mt-1.5 text-sm list-disc list-inside" style={{ color: "#B91C1C" }}>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
