import Link from "next/link";
import Image from "next/image";

interface JournalCardProps {
  story: {
    id: number;
    title: string;
    slug: string;
    publishedDate: Date;
    excerpt?: string | null;
    content: string;
    coverImage?: string | null;
    coverImageAlt?: string | null;
    trail?: {
      name: string;
      slug: string;
    } | null;
  };
}

export function JournalCard({ story }: JournalCardProps) {
  return (
    <Link href={`/journal/${story.slug}`} className="group card">
      <div className="relative aspect-video overflow-hidden bg-background-secondary">
        {story.coverImage ? (
          <Image
            src={story.coverImage}
            alt={story.coverImageAlt || story.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-text-muted text-sm">{story.title}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-text-muted">
            {new Date(story.publishedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
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
          {story.excerpt || story.content.substring(0, 120) + "..."}
        </p>
      </div>
    </Link>
  );
}
