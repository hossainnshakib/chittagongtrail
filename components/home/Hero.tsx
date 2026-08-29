"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { useHeroReveal } from "@/hooks/useGsap";
import { resolveVideoUrl, type VideoProvider } from "@/lib/video";

interface HeroProps {
  title?: string;
  subtitle?: string;
  media?: { secureUrl: string; altText: string | null } | null;
  videoEnabled?: boolean;
  videoProvider?: VideoProvider;
  videoUrl?: string | null;
  videoOverlay?: number;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80";

function usePrefersReducedMotion() {
  const subscribe = (cb: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
  const getSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getServerSnapshot = () => true;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function Hero({
  title,
  subtitle,
  media,
  videoEnabled = false,
  videoProvider = "NONE",
  videoUrl,
  videoOverlay = 45,
}: HeroProps) {
  const heroRef = useHeroReveal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [iframeReady, setIframeReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const posterSrc = media?.secureUrl || FALLBACK_IMAGE;
  const posterAlt = media?.altText || "Chittagong";

  const resolved = resolveVideoUrl(
    videoEnabled ? videoProvider : "NONE",
    videoUrl,
    posterSrc
  );

  const showIframe =
    !reducedMotion &&
    (resolved.provider === "YOUTUBE" || resolved.provider === "VIMEO") &&
    resolved.embedUrl;

  const showDirectVideo =
    !reducedMotion && resolved.provider === "DIRECT" && resolved.embedUrl;

  const showKenBurns = reducedMotion || !videoEnabled || resolved.provider === "NONE";

  const handleIframeLoad = useCallback(() => setIframeReady(true), []);

  const gradientStrength = Math.max(0, Math.min(100, videoOverlay)) / 100;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || reducedMotion) return;
    const anim = el.animate(
      [
        { transform: "translateY(0)", opacity: 1 },
        { transform: "translateY(6px)", opacity: 0.4 },
      ],
      {
        duration: 2500,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      }
    );
    return () => anim.cancel();
  }, [reducedMotion]);

  const displayTitle =
    title?.trim() || "Five Districts.\nHills to the Sea.\n*One Chittagong.*";
  const displaySubtitle =
    subtitle?.trim() ||
    "From the cloud-piercing peaks of the Chittagong Hill Tracts to the golden sands of Cox's Bazar — five districts, one unbroken trail.";

  return (
    <section className="ct-hero" aria-label="Hero">
      <div className="ct-hero-bg">
        {/* Poster image (always present) */}
        <Image
          src={posterSrc}
          alt={posterAlt}
          fill
          className={`object-cover ${showKenBurns ? "ken-burns" : ""}`}
          priority
          sizes="100vw"
        />

        {/* YouTube / Vimeo iframe */}
        {showIframe && (
          <iframe
            ref={iframeRef}
            src={resolved.embedUrl!}
            title={posterAlt}
            allow="autoplay; encrypted-media; picture-in-picture"
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
              iframeReady ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleIframeLoad}
            style={{ border: "none" }}
          />
        )}

        {/* Direct video */}
        {showDirectVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={posterSrc}
          >
            <source src={resolved.embedUrl!} type="video/mp4" />
          </video>
        )}

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `linear-gradient(
              to top,
              rgba(62,39,35,${0.9 * gradientStrength}) 0%,
              rgba(62,39,35,${0.5 * gradientStrength}) 25%,
              rgba(62,39,35,${0.15 * gradientStrength}) 55%,
              rgba(62,39,35,${0.05 * gradientStrength}) 100%
            )`,
          }}
        />
      </div>

      <div className="ct-hero-content" ref={heroRef}>
        {/* Editorial eyebrow pills */}
        <div className="mb-6 flex flex-wrap gap-3">
          <span className="inline-block rounded-full border border-[color:var(--color-dark-text)]/20 bg-[color:var(--color-dark-text)]/5 px-4 py-1.5 font-[var(--font-body)] text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[color:var(--color-dark-text)]/70 backdrop-blur-sm">
            Chittagong, in every direction
          </span>
          <span className="inline-block rounded-full border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/10 px-4 py-1.5 font-[var(--font-body)] text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
            Five districts · One trail
          </span>
        </div>

        <h1
          className="hero-title opacity-0"
          dangerouslySetInnerHTML={{
            __html: displayTitle
              .replace(/\n/g, "<br />")
              .replace(/\*(.*?)\*/g, '<em class="italic font-normal">$1</em>'),
          }}
        />

        <p className="hero-subtitle opacity-0">{displaySubtitle}</p>

        <div ref={scrollRef} className="hero-cta opacity-0">
          <span className="ct-scroll-indicator">
            Scroll to explore Chittagong
          </span>
        </div>
      </div>
    </section>
  );
}
