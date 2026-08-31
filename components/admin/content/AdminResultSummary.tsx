export default function AdminResultSummary({
  total,
  page,
  totalPages,
  label = "results",
}: {
  total: number;
  page: number;
  totalPages: number;
  label?: string;
}) {
  return (
    <p className="admin-content-result-summary" aria-live="polite">
      {total === 0 ? (
        `No ${label} found`
      ) : (
        <>
          <span className="admin-content-result-count">{total}</span> {label} · Page {page} of {totalPages}
        </>
      )}
    </p>
  );
}
