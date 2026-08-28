import Link from "next/link";
import Image from "next/image";
import { MediaAsset } from "@prisma/client";

interface TrailCardProps {
  trail: {
    id: number;
    name: string;
    slug: string;
    excerpt?: string | null;
    description: string;
    coverMedia?: MediaAsset | null;
    _count?: {
      journalPosts: number;
    };
  };
}

export function TrailCard({ trail }: TrailCardProps) {
  const coverUrl = trail.coverMedia?.secureUrl || null;
  const coverAlt = trail.coverMedia?.altText || trail.name;

  return (
    <Link href={`/trails/${trail.slug}`} className="group card">
      <div className="relative aspect-video overflow-hidden bg-background-secondary">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={coverAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F5E6D3]">
            <span className="text-[#5D4037] text-sm font-medium">{trail.name}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
          {trail.name}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {trail.excerpt || trail.description.replace(/<[^>]*>?/gm, "").substring(0, 120)}...
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
