import Link from "next/link";
import Image from "next/image";

interface TrailCardProps {
  trail: {
    id: number;
    name: string;
    slug: string;
    description: string;
    photos?: string | null;
    photoAlt?: string | null;
    _count?: {
      journalPosts: number;
    };
  };
}

export function TrailCard({ trail }: TrailCardProps) {
  const coverImage = trail.photos?.split(",")[0]?.trim() || null;

  return (
    <Link href={`/trails/${trail.slug}`} className="group card">
      <div className="relative aspect-video overflow-hidden bg-background-secondary">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={trail.photoAlt || trail.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-text-muted text-sm">{trail.name}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
          {trail.name}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {trail.description.substring(0, 120)}...
        </p>
        {trail._count && trail._count.journalPosts > 0 && (
          <span className="text-xs text-text-muted mt-2 block">
            {trail._count.journalPosts}{" "}
            {trail._count.journalPosts === 1 ? "story" : "stories"}
          </span>
        )}
      </div>
    </Link>
  );
}
