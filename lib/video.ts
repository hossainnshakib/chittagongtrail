export type VideoProvider = "NONE" | "YOUTUBE" | "VIMEO" | "DIRECT";

export interface ResolvedVideo {
  provider: VideoProvider;
  embedUrl: string | null;
  posterUrl: string | null;
  mimeType?: string | null;
}

const VIDEO_MIME_MAP: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
};

export function getVideoMimeType(format: string | null | undefined): string | null {
  if (!format) return null;
  const lower = format.toLowerCase();
  return VIDEO_MIME_MAP[lower] || null;
}

export const ALLOWED_VIDEO_FORMATS = ["mp4", "webm"] as const;

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

// youtube.com/embed reference for legacy detection; actual embed uses youtube-nocookie.com/embed for privacy

export function resolveVideoUrl(
  provider: VideoProvider,
  url: string | null | undefined,
  posterUrl: string | null | undefined,
  format?: string | null
): ResolvedVideo {
  if (!url || provider === "NONE") {
    return { provider: "NONE", embedUrl: null, posterUrl: posterUrl || null, mimeType: null };
  }

  switch (provider) {
    case "YOUTUBE": {
      const id = parseYouTubeId(url);
      if (!id) return { provider: "NONE", embedUrl: null, posterUrl: posterUrl || null, mimeType: null };
      const embedUrl = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&controls=0&showinfo=0&rel=0&modestbranding=1&start=0&end=0`;
      return { provider: "YOUTUBE", embedUrl, posterUrl: posterUrl || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`, mimeType: null };
    }
    case "VIMEO": {
      const id = parseVimeoId(url);
      if (!id) return { provider: "NONE", embedUrl: null, posterUrl: posterUrl || null, mimeType: null };
      const embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&playsinline=1&controls=0&background=1`;
      return { provider: "VIMEO", embedUrl, posterUrl: posterUrl || null, mimeType: null };
    }
    case "DIRECT": {
      if (!url.startsWith("https://")) return { provider: "NONE", embedUrl: null, posterUrl: posterUrl || null, mimeType: null };
      const mimeType = getVideoMimeType(format);
      return { provider: "DIRECT", embedUrl: url, posterUrl: posterUrl || null, mimeType };
    }
    default:
      return { provider: "NONE", embedUrl: null, posterUrl: posterUrl || null, mimeType: null };
  }
}
