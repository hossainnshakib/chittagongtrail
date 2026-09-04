import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { validateSameOrigin } from "@/lib/csrf";
import { CLOUDINARY_CLOUD_NAME, ALLOWED_UPLOAD_FOLDERS } from "@/lib/cloudinary";

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
      include: { heroMedia: true, heroVideoMedia: true },
    });
    if (!settings) return NextResponse.json({ heroTitle: "", heroSubtitle: "", heroMedia: null, heroVideoEnabled: false, heroVideoProvider: "NONE", heroVideoUrl: null, heroVideoOverlay: 45, heroVideoMediaId: null, heroVideoAsset: null });
    let heroVideoAsset: { id: number; secureUrl: string; format: string | null; resourceType: string; publicId: string; width: number | null; height: number | null; duration?: number | null } | null = null;
    let heroVideoMediaId: number | null = null;
    let heroVideoUrl: string | null = settings.heroVideoUrl || null;
    if (settings.heroVideoProvider === "DIRECT" && settings.heroVideoMedia) {
      // Durable FK relation is source of truth; derive URL/format from MediaAsset
      if (settings.heroVideoMedia.resourceType === "video") {
        heroVideoAsset = {
          id: settings.heroVideoMedia.id,
          secureUrl: settings.heroVideoMedia.secureUrl,
          format: settings.heroVideoMedia.format,
          resourceType: settings.heroVideoMedia.resourceType,
          publicId: (settings.heroVideoMedia as unknown as { publicId: string }).publicId,
          width: (settings.heroVideoMedia as unknown as { width: number | null }).width ?? null,
          height: (settings.heroVideoMedia as unknown as { height: number | null }).height ?? null,
        };
        heroVideoMediaId = settings.heroVideoMedia.id;
        heroVideoUrl = settings.heroVideoMedia.secureUrl;
      } else {
        heroVideoMediaId = null;
        heroVideoAsset = null;
        heroVideoUrl = null;
      }
    } else if (settings.heroVideoProvider === "DIRECT" && settings.heroVideoMediaId) {
      // Relation missing but FK present (should not happen after SetNull); fallback safely to poster only
      heroVideoMediaId = null;
      heroVideoAsset = null;
      heroVideoUrl = null;
    } else if (settings.heroVideoProvider === "DIRECT" && !settings.heroVideoMediaId) {
      // No FK: legacy pre-migration DIRECT URL without FK — do not perform findFirst by secureUrl as primary; render poster only safely
      // Compatibility comment: legacy URL fallback may remain temporarily only for unmatched pre-migration DIRECT records, but we prefer FK.
      heroVideoMediaId = null;
      heroVideoAsset = null;
      heroVideoUrl = null;
    } else if (settings.heroVideoProvider === "YOUTUBE" || settings.heroVideoProvider === "VIMEO") {
      heroVideoMediaId = null;
      heroVideoAsset = null;
      heroVideoUrl = settings.heroVideoUrl || null;
    } else {
      heroVideoMediaId = null;
      heroVideoAsset = null;
      heroVideoUrl = null;
    }
    // Include heroVideoMediaId FK explicitly for editor initialization
    if (settings.heroVideoMediaId && settings.heroVideoProvider === "DIRECT" && settings.heroVideoMedia) {
      heroVideoMediaId = settings.heroVideoMediaId;
    }
    return NextResponse.json({
      heroTitle: settings.heroTitle || "",
      heroSubtitle: settings.heroSubtitle || "",
      heroMediaId: settings.heroMediaId,
      heroMedia: settings.heroMedia,
      heroVideoEnabled: settings.heroVideoEnabled,
      heroVideoProvider: settings.heroVideoProvider,
      heroVideoUrl,
      heroVideoOverlay: settings.heroVideoOverlay,
      heroVideoMediaId,
      heroVideoAsset,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load hero" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const csrfErr = validateSameOrigin(request);
  if (csrfErr) return csrfErr;

  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const heroTitle = typeof body.heroTitle === "string" ? body.heroTitle.trim().slice(0, 200) : "";
    const heroSubtitle = typeof body.heroSubtitle === "string" ? body.heroSubtitle.trim().slice(0, 500) : "";
    const heroMediaId = body.heroMediaId === null || body.heroMediaId === undefined || body.heroMediaId === "" ? null : Number(body.heroMediaId);
    let heroVideoEnabled = Boolean(body.heroVideoEnabled);
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

    // Video validation: server-authoritative FK relation
    const ALLOWED_VIDEO_FORMATS = ["mp4", "webm"];
    let heroVideoMediaId: number | null = null;
    // Normalize for NONE or disabled: clear both FK and URL, provider -> NONE
    if (!heroVideoEnabled || heroVideoProvider === "NONE") {
      heroVideoEnabled = false;
      // heroVideoProvider will be normalized to NONE in persist
      heroVideoUrl = null;
      heroVideoMediaId = null;
    } else if (heroVideoProvider === "DIRECT") {
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
      try {
        const u = new URL(videoAsset.secureUrl);
        if (u.hostname !== "res.cloudinary.com") {
          return NextResponse.json({ error: "DIRECT video must be a Cloudinary URL" }, { status: 400 });
        }
        if (CLOUDINARY_CLOUD_NAME && !u.pathname.includes(CLOUDINARY_CLOUD_NAME)) {
          return NextResponse.json({ error: "Video asset does not belong to configured Cloudinary account" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "Video asset has invalid secure URL" }, { status: 400 });
      }
      const hasValidNamespace = (ALLOWED_UPLOAD_FOLDERS as readonly string[]).some((ns) => videoAsset.publicId.startsWith(ns));
      if (!hasValidNamespace) {
        return NextResponse.json({ error: "Video asset does not belong to approved namespace" }, { status: 400 });
      }
      const fmt = (videoAsset.format || "").toLowerCase();
      if (!ALLOWED_VIDEO_FORMATS.includes(fmt)) {
        return NextResponse.json({ error: `Unsupported video format: ${videoAsset.format || "unknown"}. Allowed: mp4, webm` }, { status: 400 });
      }
      // Server-derived URL - never trust client-supplied secureUrl, format, publicId or resourceType for DIRECT
      heroVideoUrl = videoAsset.secureUrl;
      heroVideoMediaId = videoAsset.id;
    } else if (heroVideoProvider === "YOUTUBE" || heroVideoProvider === "VIMEO") {
      // For YOUTUBE/VIMEO, heroVideoMediaId must be null
      heroVideoMediaId = null;
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

    // Determine normalized provider for persistence
    const normalizedProvider = (!heroVideoEnabled || heroVideoProvider === "NONE") ? "NONE" : heroVideoProvider;
    const normalizedEnabled = normalizedProvider === "NONE" ? false : heroVideoEnabled;
    const persistedHeroVideoUrl = normalizedProvider === "NONE" ? null : heroVideoUrl;
    const persistedHeroVideoMediaId = normalizedProvider === "DIRECT" ? heroVideoMediaId : null;

    // Use transaction if multiple dependent writes are performed (FK + URL derivation is atomic via single upsert, but wrap for safety)
    await prisma.$transaction(async (tx) => {
      await tx.siteSettings.upsert({
        where: { id: 1 },
        update: {
          heroTitle,
          heroSubtitle,
          heroMediaId,
          heroVideoEnabled: normalizedEnabled,
          heroVideoProvider: normalizedProvider as unknown as import("@prisma/client").HeroVideoProvider,
          heroVideoUrl: persistedHeroVideoUrl,
          heroVideoMediaId: persistedHeroVideoMediaId,
          heroVideoOverlay,
        },
        create: {
          id: 1,
          siteName: "Chittagong Trail",
          heroTitle,
          heroSubtitle,
          heroMediaId,
          heroVideoEnabled: normalizedEnabled,
          heroVideoProvider: normalizedProvider as unknown as import("@prisma/client").HeroVideoProvider,
          heroVideoUrl: persistedHeroVideoUrl,
          heroVideoMediaId: persistedHeroVideoMediaId,
          heroVideoOverlay,
        },
      });
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
