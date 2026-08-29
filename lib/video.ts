export type VideoProvider = "NONE" | "YOUTUBE" | "VIMEO" | "DIRECT";

export interface ResolvedVideo {
  provider: VideoProvider;
  embedUrl: string | null;
  posterUrl: string | null;
}

function parseYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function parseVimeoId(url: string): string | null {
  const m = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  return m ? m[1] : null;
}

export function resolveVideoUrl(
  provider: VideoProvider,
  url: string | null | undefined,
  posterUrl: string | null | undefined
): ResolvedVideo {
  if (!url || provider === "NONE") {
    return { provider: "NONE", embedUrl: null, posterUrl: posterUrl || null };
  }

  switch (provider) {
    case "YOUTUBE": {
      const id = parseYouTubeId(url);
      if (!id) return { provider: "NONE", embedUrl: null, posterUrl: posterUrl || null };
      const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&controls=0&showinfo=0&rel=0&modestbranding=1&start=0&end=0`;
      return { provider: "YOUTUBE", embedUrl, posterUrl: posterUrl || `https://img.youtube.com/vi/${id}/maxresdefault.jpg` };
    }
    case "VIMEO": {
      const id = parseVimeoId(url);
      if (!id) return { provider: "NONE", embedUrl: null, posterUrl: posterUrl || null };
      const embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&playsinline=1&controls=0&background=1`;
      return { provider: "VIMEO", embedUrl, posterUrl: posterUrl || null };
    }
    case "DIRECT": {
      if (!url.startsWith("https://")) return { provider: "NONE", embedUrl: null, posterUrl: posterUrl || null };
      return { provider: "DIRECT", embedUrl: url, posterUrl: posterUrl || null };
    }
    default:
      return { provider: "NONE", embedUrl: null, posterUrl: posterUrl || null };
  }
}
