"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useHeroReveal } from "@/hooks/useGsap";

interface HeroProps {
  title?: string;
  subtitle?: string;
  media?: { secureUrl: string; altText: string | null } | null;
  videoUrl?: string | null;
}

export function Hero({ title, subtitle, media, videoUrl }: HeroProps) {
  const heroRef = useHeroReveal();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const anim = el.animate([{ transform: "translateY(0)" }, { transform: "translateY(6px)" }], {
      duration: 2500, iterations: Infinity, direction: "alternate", easing: "ease-in-out",
    });
    return () => anim.cancel();
  }, []);

  const displayTitle = title?.trim() || "Hills, River, Coast. *One* City.";
  const displaySubtitle = subtitle?.trim() || "Most cities have one landscape. Chittagong has all of them.";

  return (
    <section className="ct-hero" aria-label="Hero">
      <div className="ct-hero-bg">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={media?.secureUrl || undefined}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : media?.secureUrl ? (
          <Image src={media.secureUrl} alt={media.altText || "Chittagong"} fill className="object-cover ken-burns" priority sizes="100vw" />
        ) : (
          <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" alt="Chittagong hills at dawn" fill className="object-cover ken-burns" priority sizes="100vw" />
        )}
        <div className="ct-hero-overlay" />
      </div>

      <div className="ct-hero-content" ref={heroRef}>
        <h1
          className="hero-title opacity-0"
          dangerouslySetInnerHTML={{ __html: displayTitle.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>') }}
        />
        <p className="hero-subtitle opacity-0">
          {displaySubtitle}
        </p>
        <div ref={scrollRef} className="hero-cta opacity-0">
          <span className="ct-scroll-indicator">
            Scroll into Chittagong
          </span>
        </div>
      </div>
    </section>
  );
}
