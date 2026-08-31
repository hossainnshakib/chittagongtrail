import Link from "next/link";

export default function AdminPagination({
  page,
  totalPages,
  total,
  buildPageUrl,
}: {
  page: number;
  totalPages: number;
  total: number;
  buildPageUrl: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="admin-content-pagination" aria-label="Pagination">
      <div className="admin-content-pagination-info">
        Page {page} of {totalPages} · {total} total
      </div>
      <div className="admin-content-pagination-controls">
        {page > 1 ? (
          <Link
            href={buildPageUrl(page - 1)}
            className="admin-content-pagination-btn"
            aria-label="Go to previous page"
          >
            Previous
          </Link>
        ) : (
          <span className="admin-content-pagination-btn admin-content-pagination-btn-disabled" aria-disabled="true">
            Previous
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={buildPageUrl(page + 1)}
            className="admin-content-pagination-btn"
            aria-label="Go to next page"
          >
            Next
          </Link>
        ) : (
          <span className="admin-content-pagination-btn admin-content-pagination-btn-disabled" aria-disabled="true">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
