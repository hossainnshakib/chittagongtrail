"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { useHeroReveal } from "@/hooks/useGsap";
import { resolveVideoUrl, getVideoMimeType, type VideoProvider } from "@/lib/video";

interface HeroProps {
  title?: string;
  subtitle?: string;
  media?: { secureUrl: string; altText: string | null; width?: number | null; height?: number | null; format?: string | null; resourceType?: string | null } | null;
  videoEnabled?: boolean;
  videoProvider?: VideoProvider;
  videoUrl?: string | null;
  videoFormat?: string | null;
  videoOverlay?: number;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80";

function usePrefersReducedMotion() {
  const subscribe = useCallback((cb: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  const getSnapshot = useCallback(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const getServerSnapshot = useCallback(() => true, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function DirectVideoLayer({
  src,
  posterSrc,
  mimeType,
  reducedMotion,
  heroSectionRef,
}: {
  src: string;
  posterSrc: string;
  mimeType: string | null;
  reducedMotion: boolean;
  heroSectionRef: React.RefObject<HTMLElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [directReady, setDirectReady] = useState(false);
  const [directError, setDirectError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion || directError) return;

    const onCanPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          setDirectError(true);
        });
      }
    };
    const onPlaying = () => setDirectReady(true);
    const onError = () => setDirectError(true);
    const onAbort = () => setDirectError(true);
    const onStalled = () => {
      // keep poster visible
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);
    video.addEventListener("abort", onAbort);
    video.addEventListener("stalled", onStalled);

    if (video.readyState >= 3) {
      onCanPlay();
    }

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
      video.removeEventListener("abort", onAbort);
      video.removeEventListener("stalled", onStalled);
    };
  }, [reducedMotion, directError]);

  useEffect(() => {
    const video = videoRef.current;
    const section = heroSectionRef.current;
    if (!video || !section || reducedMotion || directError) return;
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
  }, [directReady, directError, reducedMotion, heroSectionRef]);

  if (reducedMotion || directError) return null;

  return (
    <>
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
        {mimeType ? <source src={src} type={mimeType} /> : <source src={src} />}
      </video>
      <span data-testid="hero-direct-state" data-ready={directReady ? "true" : "false"} data-error={directError ? "true" : "false"} className="sr-only" aria-hidden="true" />
    </>
  );
}

function IframeVideoLayer({
  src,
  posterAlt,
}: {
  src: string;
  posterAlt: string;
}) {
  const [iframeReady, setIframeReady] = useState(false);
  const handleIframeLoad = useCallback(() => setIframeReady(true), []);
  return (
    <iframe
      src={src}
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
  );
}

export function Hero({
  title,
  subtitle,
  media,
  videoEnabled = false,
  videoProvider = "NONE",
  videoUrl,
  videoFormat,
  videoOverlay = 45,
}: HeroProps) {
  const heroRef = useHeroReveal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  const reducedMotion = usePrefersReducedMotion();

  const posterSrc = media?.secureUrl || FALLBACK_IMAGE;
  const posterAlt = media?.altText || "Chittagong landscape";

  const derivedMime = videoFormat ? getVideoMimeType(videoFormat) : null;
  const inferredMime = !derivedMime && videoProvider === "DIRECT" && videoUrl ? getVideoMimeType(videoUrl.split(".").pop()?.split("?")[0] || null) : null;
  const effectiveFormat = videoFormat || (videoUrl ? videoUrl.split(".").pop()?.split("?")[0] || null : null);
  const resolved = resolveVideoUrl(
    videoEnabled ? videoProvider : "NONE",
    videoUrl,
    posterSrc,
    effectiveFormat
  );

  const isDirectVideo = resolved.provider === "DIRECT" && !!resolved.embedUrl;
  const isIframeVideo =
    (resolved.provider === "YOUTUBE" || resolved.provider === "VIMEO") && !!resolved.embedUrl;

  const showDirectVideo = !reducedMotion && isDirectVideo;
  const showIframe = !reducedMotion && isIframeVideo;

  const showKenBurns = reducedMotion || !videoEnabled || resolved.provider === "NONE";

  const gradientStrength = Math.max(0.65, Math.min(100, videoOverlay) / 100);

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

  const posterImgAlt = posterAlt;
  const mimeForSource = resolved.mimeType || derivedMime || inferredMime;
  const embedKey = `${resolved.provider}:${resolved.embedUrl ?? ""}:${effectiveFormat ?? ""}`;

  return (
    <section className="ct-hero" aria-label="Hero" ref={heroSectionRef as React.RefObject<HTMLElement>}>
      <div
        className="ct-hero-bg"
        style={{ overflow: "hidden" }}
        aria-hidden="true"
      >
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

        {showDirectVideo && (
          <DirectVideoLayer
            key={embedKey}
            src={resolved.embedUrl!}
            posterSrc={posterSrc}
            mimeType={mimeForSource}
            reducedMotion={reducedMotion}
            heroSectionRef={heroSectionRef}
          />
        )}

        {showIframe && (
          <IframeVideoLayer key={embedKey} src={resolved.embedUrl!} posterAlt={posterAlt} />
        )}

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
        <div className="mb-6 flex flex-wrap gap-3">
          <span className="inline-block rounded-full border border-[rgba(253,245,230,0.5)] bg-[rgba(44,26,18,0.42)] px-4 py-1.5 font-[var(--font-body)] text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[color:var(--color-dark-text)] backdrop-blur-sm">
            Chittagong, in every direction
          </span>
          <span className="inline-block rounded-full border border-[rgba(201,168,130,0.55)] bg-[rgba(44,26,18,0.42)] px-4 py-1.5 font-[var(--font-body)] text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#E3C79F]">
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

      <div data-testid="hero-motion" data-reduced={reducedMotion ? "true" : "false"} className="sr-only" aria-hidden="true" />
    </section>
  );
}
