import Link from "next/link";
import Image from "next/image";
import { MediaAsset, JournalType } from "@prisma/client";

interface JournalCardProps {
  story: {
    id: number;
    title: string;
    slug: string;
    publishedAt?: Date | null;
    excerpt?: string | null;
    content: string;
    type: JournalType;
    coverMedia?: MediaAsset | null;
    trail?: {
      name: string;
      slug: string;
    } | null;
  };
}

export function JournalCard({ story }: JournalCardProps) {
  const coverUrl = story.coverMedia?.secureUrl || null;
  const coverAlt = story.coverMedia?.altText || story.title;
  const basePath = story.type === JournalType.FOOD ? "/food" : "/journal";

  return (
    <Link href={`${basePath}/${story.slug}`} className="group card">
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
            <span className="text-[#5D4037] text-sm font-medium">{story.title}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          {story.publishedAt && (
            <span className="text-xs text-text-muted">
              {new Date(story.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          {story.trail && (
            <>
              <span className="text-text-muted">·</span>
              <span className="text-xs text-accent">{story.trail.name}</span>
            </>
          )}
        </div>
        <h3 className="font-display text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
          {story.title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {story.excerpt || story.content.replace(/<[^>]*>?/gm, "").substring(0, 120) + "..."}
        </p>
      </div>
    </Link>
  );
}
