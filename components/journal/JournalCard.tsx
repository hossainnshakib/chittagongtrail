import Link from "next/link";
import Image from "next/image";

interface JournalCardProps {
  story: {
    id: number;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    image: string;
    trail?: string | null;
    category?: string;
  };
}

export function JournalCard({ story }: JournalCardProps) {
  return (
    <Link href={`/journal/${story.slug}`} className="group card">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={story.image}
          alt={story.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-text-muted">{story.date}</span>
          {story.trail && (
            <>
              <span className="text-text-muted">·</span>
              <span className="text-xs text-accent">{story.trail}</span>
            </>
          )}
        </div>
        <h3 className="font-display text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
          {story.title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {story.excerpt}
        </p>
      </div>
    </Link>
  );
}
