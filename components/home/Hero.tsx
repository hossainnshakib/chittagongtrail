"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useHeroReveal } from "@/hooks/useGsap";

interface HeroProps {
  title?: string;
  subtitle?: string;
  media?: {
    secureUrl: string;
    altText: string | null;
  } | null;
  siteName?: string;
}

export function Hero({ title, subtitle, media, siteName = "Chittagong Trail" }: HeroProps) {
  const heroRef = useHeroReveal();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollIndicator = scrollRef.current;
    if (!scrollIndicator) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const animation = scrollIndicator.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(8px)" }],
      {
        duration: 2000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      }
    );

    return () => animation.cancel();
  }, []);

  const displayTitle = title && title.trim() !== "" ? title : "Chittagong Trail";
  const displaySubtitle =
    subtitle && subtitle.trim() !== ""
      ? subtitle
      : "A curated exploration of Chittagong — places, stories, food, and landscapes.";
  const bgImageUrl = media?.secureUrl || null;
  const bgImageAlt = media?.altText || "Chittagong landscape";

  return (
    <section className="hero-section" aria-label="Hero">
      {/* Background Image */}
      <div className="hero-bg">
        {bgImageUrl ? (
          <Image
            src={bgImageUrl}
            alt={bgImageAlt}
            fill
            className="object-cover ken-burns"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3E2723] via-[#5D4037] to-[#4A3728]" />
        )}
        <div className="hero-overlay" />
      </div>

      {/* Content */}
      <div className="hero-content">
        <div ref={heroRef} className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Brand wordmark */}
            <div className="hero-brand mb-6 md:mb-8 opacity-0">
              <Image
                src="/images/chittagongtrail-wordmark.png"
                alt={siteName}
                width={280}
                height={75}
                className="h-10 md:h-12 w-auto"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="hero-title font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-dark-text leading-[1.1] mb-4 md:mb-6 opacity-0">
              {displayTitle}
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-lg md:text-xl lg:text-2xl text-dark-text/70 max-w-xl leading-relaxed mb-8 md:mb-12 opacity-0">
              {displaySubtitle}
            </p>

            {/* Scroll Indicator */}
            <div ref={scrollRef} className="hero-cta opacity-0">
              <div className="flex items-center gap-3 text-dark-text/50">
                <div className="w-px h-12 bg-dark-text/30" />
                <span className="text-xs uppercase tracking-[0.2em] font-body">Scroll to explore</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
