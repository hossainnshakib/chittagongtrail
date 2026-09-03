"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { useHeroReveal } from "@/hooks/useGsap";
import { resolveVideoUrl, type VideoProvider } from "@/lib/video";

interface HeroProps {
  title?: string;
  subtitle?: string;
  media?: { secureUrl: string; altText: string | null; width?: number | null; height?: number | null; format?: string | null; resourceType?: string | null } | null;
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  const [directReady, setDirectReady] = useState(false);
  const [directError, setDirectError] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const posterSrc = media?.secureUrl || FALLBACK_IMAGE;
  const posterAlt = media?.altText || "Chittagong landscape";

  const resolved = resolveVideoUrl(
    videoEnabled ? videoProvider : "NONE",
    videoUrl,
    posterSrc
  );

  const isDirectVideo = resolved.provider === "DIRECT" && !!resolved.embedUrl;
  const isIframeVideo =
    (resolved.provider === "YOUTUBE" || resolved.provider === "VIMEO") && !!resolved.embedUrl;

  const showDirectVideo = !reducedMotion && isDirectVideo && !directError;
  const showIframe = !reducedMotion && isIframeVideo && !directError;

  // Ken Burns only when no video will play
  const showKenBurns = reducedMotion || !videoEnabled || resolved.provider === "NONE" || directError;

  const handleIframeLoad = useCallback(() => setIframeReady(true), []);

  const gradientStrength = Math.max(0, Math.min(100, videoOverlay)) / 100;

  // Scroll indicator animation
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

  // Direct video event handling: wait for playing/canplay to reveal
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showDirectVideo) return;

    const onCanPlay = () => {
      // autoplay may still fail; attempt play and wait for playing
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // autoplay blocked - keep poster
          setDirectError(true);
        });
      }
    };
    const onPlaying = () => setDirectReady(true);
    const onError = () => setDirectError(true);

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);

    // Some browsers need explicit play attempt
    if (video.readyState >= 3) {
      onCanPlay();
    }

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
    };
  }, [showDirectVideo]);

  // Pause when not visible (performance-safe)
  useEffect(() => {
    const video = videoRef.current;
    const section = heroSectionRef.current;
    if (!video || !section || !showDirectVideo) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (video.paused && directReady && !directError && !reducedMotion) {
              video.play().catch(() => setDirectError(true));
            }
          } else {
            if (!video.paused) video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [showDirectVideo, directReady, directError, reducedMotion]);

  // Reset ready/error when provider/url changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset for new media source
    setDirectReady(false);
    setDirectError(false);
    setIframeReady(false);
  }, [resolved.embedUrl, resolved.provider]);

  const displayTitle =
    title?.trim() || "Five Districts.\nHills to the Sea.\n*One Chittagong.*";
  const displaySubtitle =
    subtitle?.trim() ||
    "From the cloud-piercing peaks of the Chittagong Hill Tracts to the golden sands of Cox's Bazar — five districts, one unbroken trail.";

  // Poster alt strategy: if media has altText use it, else fallback; video is decorative so aria-hidden
  const posterImgAlt = posterAlt;

  return (
    <section className="ct-hero" aria-label="Hero" ref={heroSectionRef as React.RefObject<HTMLElement>}>
      {/* Edge-to-edge media wrapper: covers full hero without black bars */}
      <div
        className="ct-hero-bg"
        style={{ overflow: "hidden" }}
        aria-hidden="true"
      >
        {/* Poster image: always present, first paint, covers container */}
        <Image
          src={posterSrc}
          alt={posterImgAlt}
          fill
          className={showKenBurns ? "ken-burns" : ""}
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            width: "100%",
            height: "100%",
          }}
        />

        {/* Direct Cloudinary video: decorative, covers container, crossfade only after playing */}
        {showDirectVideo && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            poster={posterSrc}
            // Ensure video covers container exactly
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              opacity: directReady ? 1 : 0,
              transition: directReady ? "opacity 700ms ease" : "none",
              pointerEvents: "none",
            }}
          >
            <source src={resolved.embedUrl!} type="video/mp4" />
          </video>
        )}

        {/* YouTube / Vimeo iframe: only when external explicitly chosen; truthful branding limitation note handled in CMS */}
        {showIframe && (
          <iframe
            src={resolved.embedUrl!}
            title={posterAlt + " background video"}
            allow="autoplay; encrypted-media; picture-in-picture"
            aria-hidden="true"
            tabIndex={-1}
            onLoad={handleIframeLoad}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              objectFit: "cover",
              opacity: iframeReady ? 1 : 0,
              transition: "opacity 700ms ease",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Dark gradient overlay: stable independent of selected media for contrast */}
        <div
          className="absolute inset-0 z-[1]"
          aria-hidden="true"
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

      {/* Reduced-motion notice for testing hooks: data attribute reflects behavior */}
      <div data-testid="hero-motion" data-reduced={reducedMotion ? "true" : "false"} className="sr-only" aria-hidden="true" />
    </section>
  );
}
