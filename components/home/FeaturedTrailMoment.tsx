"use client";

import Link from "next/link";
import Image from "next/image";
import { useParallax } from "@/hooks/useGsap";

interface Trail {
  id: number;
  name: string;
  slug: string;
  excerpt?: string | null;
  description: string;
  coverMedia?: {
    secureUrl: string;
    altText: string | null;
  } | null;
}

interface FeaturedTrailMomentProps {
  trail: Trail | null;
}

export function FeaturedTrailMoment({ trail }: FeaturedTrailMomentProps) {
  const parallaxRef = useParallax(0.3);

  if (!trail) return null;

  const coverUrl = trail.coverMedia?.secureUrl || null;
  const coverAlt = trail.coverMedia?.altText || trail.name;
  const excerpt =
    trail.excerpt ||
    trail.description.replace(/<[^>]*>?/gm, "").substring(0, 200);

  return (
    <section className="relative h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Full-bleed image with parallax */}
      <div ref={parallaxRef} className="absolute inset-0">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={coverAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3E2723] via-[#5D4037] to-[#4A3728]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/90 via-[#3E2723]/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-2xl">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-3">
              Featured Trail
            </p>
            <Link href={`/trails/${trail.slug}`} className="group inline-block">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-dark-text mb-4 group-hover:text-accent transition-colors duration-300">
                {trail.name}
              </h2>
            </Link>
            {excerpt && (
              <p className="text-dark-text/70 text-base md:text-lg max-w-lg leading-relaxed mb-6">
                {excerpt}
              </p>
            )}
            <Link
              href={`/trails/${trail.slug}`}
              className="inline-flex items-center gap-2 text-accent text-sm uppercase tracking-[0.15em] font-medium hover:text-accent-secondary transition-colors duration-200"
            >
              Explore this trail
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
