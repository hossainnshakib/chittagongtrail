interface AdminLoadingStateProps {
  message?: string;
}

export default function AdminLoadingState({ message = "Loading..." }: AdminLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        className="w-8 h-8 border-2 rounded-full animate-spin mb-3"
        style={{
          borderColor: "var(--admin-border)",
          borderTopColor: "var(--admin-brand-accent)",
        }}
        aria-hidden="true"
      />
      <p className="text-sm" style={{ color: "var(--admin-text-muted)" }} role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
