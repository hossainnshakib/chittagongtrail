"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui";
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
    if (scrollIndicator) {
      const animation = scrollIndicator.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(10px)" }],
        {
          duration: 1500,
          iterations: Infinity,
          direction: "alternate",
          easing: "ease-in-out",
        }
      );

      return () => animation.cancel();
    }
  }, []);

  const displayTitle = title && title.trim() !== "" ? title : siteName;
  const displaySubtitle =
    subtitle && subtitle.trim() !== ""
      ? subtitle
      : "A personal journal of touring Chittagong — places I visit, stories I find, and everything in between.";
  const bgImageUrl = media?.secureUrl || "/images/chittagongtrail_logo.png";
  const bgImageAlt = media?.altText || siteName;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImageUrl}
          alt={bgImageAlt}
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/70 via-dark-bg/50 to-dark-bg/80" />
      </div>

      {/* Content */}
      <Container className="relative z-10 text-center">
        <div ref={heroRef} className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="hero-title mb-8">
            <Image
              src="/images/chittagongtrail_logo.png"
              alt={siteName}
              width={200}
              height={200}
              className="mx-auto h-32 md:h-40 w-auto"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="hero-title font-display text-5xl md:text-6xl lg:text-7xl font-bold text-dark-text mb-6">
            {displayTitle}
          </h1>

          {/* Tagline */}
          <p className="hero-subtitle text-xl md:text-2xl text-dark-text/80 max-w-2xl mx-auto mb-8">
            {displaySubtitle}
          </p>

          {/* Scroll Indicator */}
          <div ref={scrollRef} className="hero-cta mt-12">
            <svg
              className="w-6 h-6 mx-auto text-dark-text/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
