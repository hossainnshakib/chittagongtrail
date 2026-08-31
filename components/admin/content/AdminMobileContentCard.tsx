import Link from "next/link";
import Image from "next/image";

export default function AdminMobileContentCard({
  title,
  slug,
  status,
  typeLabel,
  typeColor,
  coverUrl,
  metaInfo,
  updatedAt,
  seoStatus,
  actions,
}: {
  title: string;
  slug: string;
  status: string;
  typeLabel?: string;
  typeColor?: string;
  coverUrl: string | null;
  metaInfo?: string;
  updatedAt: Date;
  seoStatus?: React.ReactNode;
  actions: Array<{ label: string; href: string }>;
}) {
  const statusClass =
    status === "PUBLISHED"
      ? "admin-content-status-published"
      : status === "ARCHIVED"
      ? "admin-content-status-archived"
      : "admin-content-status-draft";

  return (
    <article className="admin-content-card" aria-label={title}>
      <div className="admin-content-card-header">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            width={44}
            height={44}
            className="admin-content-card-thumb"
            style={{ objectFit: "cover" }}
            sizes="44px"
          />
        ) : (
          <div className="admin-content-card-thumb admin-content-card-thumb-empty" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className="admin-content-card-info">
          <h3 className="admin-content-card-title">{title}</h3>
          <p className="admin-content-card-slug">/{slug}</p>
        </div>
        <span className={`admin-content-status-badge ${statusClass}`}>
          <span className="sr-only">Status: </span>
          {status}
        </span>
      </div>
      <div className="admin-content-card-meta">
        {typeLabel && typeColor && (
          <span className="admin-content-type-badge" style={{ backgroundColor: typeColor }}>
            {typeLabel}
          </span>
        )}
        {metaInfo && <span className="admin-content-card-meta-text">{metaInfo}</span>}
        {seoStatus}
        <span className="admin-content-card-date">
          {updatedAt.toLocaleDateString()}
        </span>
      </div>
      <div className="admin-content-card-actions">
        {actions.map((a) => (
          <Link key={a.href} href={a.href} className="admin-content-card-action">
            {a.label}
          </Link>
        ))}
      </div>
    </article>
  );
}
