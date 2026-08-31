import Image from "next/image";

export default function AdminMediaThumbnail({
  url,
  alt,
  size = 40,
}: {
  url: string | null;
  alt?: string;
  size?: number;
}) {
  if (!url) {
    return (
      <div
        className="admin-content-thumbnail admin-content-thumbnail-placeholder"
        style={{ width: size, height: size }}
        aria-label="No image"
        role="img"
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt || ""}
      width={size}
      height={size}
      className="admin-content-thumbnail"
      style={{ objectFit: "cover" }}
      sizes={`${size}px`}
    />
  );
}
