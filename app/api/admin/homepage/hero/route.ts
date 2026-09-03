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
    if (!settings) return NextResponse.json({ heroTitle: "", heroSubtitle: "", heroMedia: null, heroVideoEnabled: false, heroVideoProvider: "NONE", heroVideoUrl: null, heroVideoOverlay: 45 });
    return NextResponse.json({
      heroTitle: settings.heroTitle || "",
      heroSubtitle: settings.heroSubtitle || "",
      heroMediaId: settings.heroMediaId,
      heroMedia: settings.heroMedia,
      heroVideoEnabled: settings.heroVideoEnabled,
      heroVideoProvider: settings.heroVideoProvider,
      heroVideoUrl: settings.heroVideoUrl,
      heroVideoOverlay: settings.heroVideoOverlay,
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
    const heroVideoUrl = typeof body.heroVideoUrl === "string" && body.heroVideoUrl.trim() !== "" ? body.heroVideoUrl.trim() : null;
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
    if (heroVideoEnabled && heroVideoProvider !== "NONE") {
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
        case "DIRECT":
          if (!heroVideoUrl.startsWith("https://")) return NextResponse.json({ error: "Direct video URL must be HTTPS" }, { status: 400 });
          // Optionally validate Cloudinary video asset exists
          const videoAsset = await prisma.mediaAsset.findFirst({ where: { secureUrl: heroVideoUrl } });
          if (videoAsset) {
            if (videoAsset.resourceType !== "video") return NextResponse.json({ error: "Selected video asset must be a video" }, { status: 400 });
          } else {
            // Allow non-DB HTTPS URL but still enforce https
          }
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
