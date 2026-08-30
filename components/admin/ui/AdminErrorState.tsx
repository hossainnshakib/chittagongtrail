interface AdminErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export default function AdminErrorState({
  title = "Something went wrong",
  message,
  retry,
}: AdminErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: "#FEE2E2" }}
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h3
        className="text-sm font-medium"
        style={{ color: "var(--admin-text-primary)", fontFamily: "var(--font-body)" }}
      >
        {title}
      </h3>
      <p className="mt-1 text-sm max-w-sm" style={{ color: "var(--admin-text-muted)" }}>
        {message}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="mt-4 px-4 py-2 text-sm font-medium rounded-md transition-colors admin-focus-ring"
          style={{
            backgroundColor: "var(--admin-surface)",
            color: "var(--admin-text-primary)",
            border: "1px solid var(--admin-border)",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
