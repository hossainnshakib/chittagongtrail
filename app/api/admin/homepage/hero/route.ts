import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function parseYouTubeId(url: string): string | null {
  const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/];
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

export async function GET(request: NextRequest) {
  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
      include: { heroMedia: true },
    });
    if (!settings) return NextResponse.json({ heroTitle: "", heroSubtitle: "", heroMedia: null, heroVideoEnabled: false, heroVideoProvider: "NONE", heroVideoUrl: null, heroVideoOverlay: 45, heroVideoMediaId: null, heroVideoAsset: null });
    let heroVideoAsset = null as unknown as null | { id: number; secureUrl: string; format: string | null; resourceType: string };
    let heroVideoMediaId: number | null = null;
    if (settings.heroVideoProvider === "DIRECT" && settings.heroVideoUrl) {
      const asset = await prisma.mediaAsset.findFirst({ where: { secureUrl: settings.heroVideoUrl } });
      if (asset && asset.resourceType === "video") {
        heroVideoAsset = { id: asset.id, secureUrl: asset.secureUrl, format: asset.format, resourceType: asset.resourceType };
        heroVideoMediaId = asset.id;
      }
    }
    return NextResponse.json({
      heroTitle: settings.heroTitle || "",
      heroSubtitle: settings.heroSubtitle || "",
      heroMediaId: settings.heroMediaId,
      heroMedia: settings.heroMedia,
      heroVideoEnabled: settings.heroVideoEnabled,
      heroVideoProvider: settings.heroVideoProvider,
      heroVideoUrl: settings.heroVideoUrl,
      heroVideoOverlay: settings.heroVideoOverlay,
      heroVideoMediaId,
      heroVideoAsset,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load hero" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const heroTitle = typeof body.heroTitle === "string" ? body.heroTitle.trim().slice(0, 200) : "";
    const heroSubtitle = typeof body.heroSubtitle === "string" ? body.heroSubtitle.trim().slice(0, 500) : "";
    const heroMediaId = body.heroMediaId === null || body.heroMediaId === undefined || body.heroMediaId === "" ? null : Number(body.heroMediaId);
    const heroVideoEnabled = Boolean(body.heroVideoEnabled);
    const heroVideoProvider = (body.heroVideoProvider as string) || "NONE";
    let heroVideoUrl: string | null = typeof body.heroVideoUrl === "string" && body.heroVideoUrl.trim() !== "" ? body.heroVideoUrl.trim() : null;
    const heroVideoMediaIdRaw = body.heroVideoMediaId === null || body.heroVideoMediaId === undefined || body.heroVideoMediaId === "" ? null : Number(body.heroVideoMediaId);
    const heroVideoOverlay = Number.isInteger(body.heroVideoOverlay) ? Math.max(0, Math.min(100, body.heroVideoOverlay)) : 45;

    // Validate provider
    const allowedProviders = ["NONE", "YOUTUBE", "VIMEO", "DIRECT"];
    if (!allowedProviders.includes(heroVideoProvider)) {
      return NextResponse.json({ error: "Invalid video provider" }, { status: 400 });
    }

    // Poster validation: required when hero enabled, must be image
    if (heroVideoEnabled || heroTitle || heroSubtitle) {
      // poster required whenever hero enabled per spec
    }
    if (heroVideoEnabled && !heroMediaId) {
      return NextResponse.json({ error: "Poster image is required when Hero is enabled" }, { status: 400 });
    }
    if (heroMediaId !== null) {
      if (!Number.isInteger(heroMediaId) || heroMediaId <= 0) {
        return NextResponse.json({ error: "Invalid poster media ID" }, { status: 400 });
      }
      const asset = await prisma.mediaAsset.findUnique({ where: { id: heroMediaId } });
      if (!asset) return NextResponse.json({ error: "Poster media asset not found" }, { status: 400 });
      if (asset.resourceType !== "image") return NextResponse.json({ error: "Poster must be an image" }, { status: 400 });
    }

    // Video validation: video-only resource check when provider DIRECT corresponds to video asset
    // For DIRECT, require stable numeric MediaAsset ID and derive URL server-side
    const ALLOWED_VIDEO_FORMATS = ["mp4", "webm"];
    if (heroVideoEnabled && heroVideoProvider !== "NONE") {
      if (heroVideoProvider === "DIRECT") {
        if (heroVideoMediaIdRaw === null || heroVideoMediaIdRaw === undefined) {
          return NextResponse.json({ error: "DIRECT video requires a registered MediaAsset (heroVideoMediaId)" }, { status: 400 });
        }
        if (!Number.isInteger(heroVideoMediaIdRaw) || heroVideoMediaIdRaw <= 0) {
          return NextResponse.json({ error: "Invalid heroVideoMediaId" }, { status: 400 });
        }
        const videoAsset = await prisma.mediaAsset.findUnique({ where: { id: heroVideoMediaIdRaw } });
        if (!videoAsset) return NextResponse.json({ error: "Selected video asset not found" }, { status: 400 });
        if (videoAsset.resourceType !== "video") return NextResponse.json({ error: "Selected video asset must be a video" }, { status: 400 });
        if (!videoAsset.secureUrl || !videoAsset.secureUrl.startsWith("https://")) {
          return NextResponse.json({ error: "Video asset has invalid secure URL" }, { status: 400 });
        }
        if (videoAsset.secureUrl.toLowerCase().includes("javascript:") || videoAsset.secureUrl.toLowerCase().includes("data:")) {
          return NextResponse.json({ error: "Unsafe video URL" }, { status: 400 });
        }
        const fmt = (videoAsset.format || "").toLowerCase();
        if (!ALLOWED_VIDEO_FORMATS.includes(fmt)) {
          return NextResponse.json({ error: `Unsupported video format: ${videoAsset.format || "unknown"}. Allowed: mp4, webm` }, { status: 400 });
        }
        // Server-derived URL - never trust client-supplied URL metadata for DIRECT
        heroVideoUrl = videoAsset.secureUrl;
      } else {
        // YOUTUBE / VIMEO: validate HTTPS-like URL
        if (!heroVideoUrl) return NextResponse.json({ error: "Video URL is required when video is enabled" }, { status: 400 });
        if (heroVideoUrl.toLowerCase().includes("javascript:") || heroVideoUrl.toLowerCase().includes("data:")) {
          return NextResponse.json({ error: "Unsafe video URL" }, { status: 400 });
        }
        switch (heroVideoProvider) {
          case "YOUTUBE":
            if (!parseYouTubeId(heroVideoUrl)) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
            break;
          case "VIMEO":
            if (!parseVimeoId(heroVideoUrl)) return NextResponse.json({ error: "Invalid Vimeo URL" }, { status: 400 });
            break;
          default:
            break;
        }
        // Ensure arbitrary DIRECT URLs are not accepted under YOUTUBE/VIMEO path
        if (heroVideoMediaIdRaw !== null && heroVideoMediaIdRaw !== undefined) {
          // For non-DIRECT providers, mediaId should not be supplied; ignore but don't treat as video asset
        }
      }
    } else if (!heroVideoEnabled || heroVideoProvider === "NONE") {
      // When disabled or NONE, clear video URL regardless of input
      heroVideoUrl = null;
    }

    // Emphasis validation: allow lightweight *text* syntax, reject unsafe HTML
    // heroTitle should not contain angle brackets
    if (heroTitle.includes("<") || heroTitle.includes(">")) {
      return NextResponse.json({ error: "Hero title must not contain HTML" }, { status: 400 });
    }
    // heroSubtitle likewise simple text, but allow no HTML
    if (heroSubtitle.includes("<") || heroSubtitle.includes(">")) {
      // allow? spec says supporting paragraph plain text; reject HTML
      return NextResponse.json({ error: "Hero subtitle must not contain HTML" }, { status: 400 });
    }

    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        heroTitle,
        heroSubtitle,
        heroMediaId,
        heroVideoEnabled: heroVideoProvider === "NONE" ? false : heroVideoEnabled,
        heroVideoProvider: heroVideoProvider as unknown as import("@prisma/client").HeroVideoProvider,
        heroVideoUrl: heroVideoProvider === "NONE" ? null : heroVideoUrl,
        heroVideoOverlay,
      },
      create: {
        id: 1,
        siteName: "Chittagong Trail",
        heroTitle,
        heroSubtitle,
        heroMediaId,
        heroVideoEnabled: heroVideoProvider === "NONE" ? false : heroVideoEnabled,
        heroVideoProvider: heroVideoProvider as unknown as import("@prisma/client").HeroVideoProvider,
        heroVideoUrl: heroVideoProvider === "NONE" ? null : heroVideoUrl,
        heroVideoOverlay,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/homepage");
    revalidatePath("/admin/homepage/hero");

    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save hero";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
