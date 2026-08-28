import Link from "next/link";
import Image from "next/image";

interface TrailCardProps {
  trail: {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    journalCount?: number;
  };
}

export function TrailCard({ trail }: TrailCardProps) {
  return (
    <Link href={`/trails/${trail.slug}`} className="group card">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={trail.image}
          alt={trail.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
          {trail.name}
        </h3>
        <p className="text-text-secondary text-sm mb-3">{trail.description}</p>
        {trail.journalCount !== undefined && trail.journalCount > 0 && (
          <span className="text-xs text-text-muted">
            {trail.journalCount} {trail.journalCount === 1 ? "story" : "stories"}
          </span>
        )}
      </div>
    </Link>
  );
}
