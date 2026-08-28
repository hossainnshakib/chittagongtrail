"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { trailSchema, journalSchema } from "@/lib/validation";
import { ContentStatus, JournalType, District, TerrainType, PlaceType } from "@prisma/client";

export interface TrailActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
}

export interface JournalActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
}

export async function createTrail(
  _prevState: TrailActionResult,
  formData: FormData
): Promise<TrailActionResult> {
  await requireAdmin();

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    description: formData.get("description"),
    district: formData.get("district"),
    administrativeArea: formData.get("administrativeArea"),
    localArea: formData.get("localArea"),
    terrainType: formData.get("terrainType") || null,
    latitude: formData.get("latitude") !== "" ? formData.get("latitude") : null,
    longitude: formData.get("longitude") !== "" ? formData.get("longitude") : null,
    status: formData.get("status") || "DRAFT",
    publishedAt: formData.get("publishedAt") ? new Date(formData.get("publishedAt") as string) : null,
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    featuredOrder: formData.get("featuredOrder") !== "" ? formData.get("featuredOrder") : null,
    coverMediaId: formData.get("coverMediaId") !== "" ? formData.get("coverMediaId") : null,
    ogMediaId: formData.get("ogMediaId") !== "" ? formData.get("ogMediaId") : null,
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    placeType: formData.get("placeType") || "PLACE",
  };

  const parsed = trailSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const err of parsed.error.issues) {
      const field = err.path.join(".");
      errors[field] = err.message;
    }
    return { success: false, errors };
  }

  const data = parsed.data;

  try {
    const existing = await prisma.trailLocation.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return {
        success: false,
        errors: { slug: "A trail with this slug already exists" },
      };
    }

    let publishedAt = data.publishedAt;
    if (data.status === ContentStatus.PUBLISHED && !publishedAt) {
      publishedAt = new Date();
    }

    await prisma.trailLocation.create({
      data: {
        name: data.name,
        slug: data.slug,
        excerpt: data.excerpt,
        description: data.description,
        district: data.district as District,
        administrativeArea: data.administrativeArea,
        localArea: data.localArea,
        terrainType: data.terrainType ? (data.terrainType as TerrainType) : null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        status: data.status as ContentStatus,
        publishedAt,
        isFeatured: data.isFeatured,
        featuredOrder: data.featuredOrder ?? null,
        coverMediaId: data.coverMediaId ?? null,
        ogMediaId: data.ogMediaId ?? null,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        placeType: data.placeType as PlaceType,
      },
    });

    revalidatePath("/admin/trails");
    revalidatePath("/trails");
  } catch (error) {
    console.error("[admin:trails:create]", error);
    return { success: false, error: "Failed to create trail" };
  }

  redirect("/admin/trails");
}

export async function updateTrail(
  id: number,
  _prevState: TrailActionResult,
  formData: FormData
): Promise<TrailActionResult> {
  await requireAdmin();

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    description: formData.get("description"),
    district: formData.get("district"),
    administrativeArea: formData.get("administrativeArea"),
    localArea: formData.get("localArea"),
    terrainType: formData.get("terrainType") || null,
    latitude: formData.get("latitude") !== "" ? formData.get("latitude") : null,
    longitude: formData.get("longitude") !== "" ? formData.get("longitude") : null,
    status: formData.get("status") || "DRAFT",
    publishedAt: formData.get("publishedAt") ? new Date(formData.get("publishedAt") as string) : null,
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    featuredOrder: formData.get("featuredOrder") !== "" ? formData.get("featuredOrder") : null,
    coverMediaId: formData.get("coverMediaId") !== "" ? formData.get("coverMediaId") : null,
    ogMediaId: formData.get("ogMediaId") !== "" ? formData.get("ogMediaId") : null,
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    placeType: formData.get("placeType") || "PLACE",
  };

  const parsed = trailSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const err of parsed.error.issues) {
      const field = err.path.join(".");
      errors[field] = err.message;
    }
    return { success: false, errors };
  }

  const data = parsed.data;

  try {
    const existing = await prisma.trailLocation.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, error: "Trail not found" };
    }

    if (existing.slug !== data.slug) {
      const slugTaken = await prisma.trailLocation.findUnique({
        where: { slug: data.slug },
      });
      if (slugTaken) {
        return {
          success: false,
          errors: { slug: "A trail with this slug already exists" },
        };
      }
    }

    let publishedAt = data.publishedAt;
    if (data.status === ContentStatus.PUBLISHED && !publishedAt) {
      publishedAt = existing.publishedAt || new Date();
    }

    await prisma.trailLocation.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        excerpt: data.excerpt,
        description: data.description,
        district: data.district as District,
        administrativeArea: data.administrativeArea,
        localArea: data.localArea,
        terrainType: data.terrainType ? (data.terrainType as TerrainType) : null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        status: data.status as ContentStatus,
        publishedAt,
        isFeatured: data.isFeatured,
        featuredOrder: data.featuredOrder ?? null,
        coverMediaId: data.coverMediaId ?? null,
        ogMediaId: data.ogMediaId ?? null,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        placeType: data.placeType as PlaceType,
      },
    });

    revalidatePath("/admin/trails");
    revalidatePath(`/admin/trails/${id}/edit`);
    revalidatePath("/trails");
    revalidatePath(`/trails/${data.slug}`);
    if (existing.slug !== data.slug) {
      revalidatePath(`/trails/${existing.slug}`);
    }
  } catch (error) {
    console.error("[admin:trails:update]", error);
    return { success: false, error: "Failed to update trail" };
  }

  redirect("/admin/trails");
}

export async function deleteTrail(id: number): Promise<TrailActionResult> {
  await requireAdmin();

  try {
    const trail = await prisma.trailLocation.findUnique({
      where: { id },
      include: { _count: { select: { journalPosts: true } } },
    });

    if (!trail) {
      return { success: false, error: "Trail not found" };
    }

    if (trail._count.journalPosts > 0) {
      return {
        success: false,
        error: `Cannot delete trail with ${trail._count.journalPosts} related journal post(s). Remove the relationships first.`,
      };
    }

    await prisma.trailLocation.delete({ where: { id } });

    revalidatePath("/admin/trails");
    revalidatePath("/trails");
  } catch (error) {
    console.error("[admin:trails:delete]", error);
    return { success: false, error: "Failed to delete trail" };
  }

  return { success: true };
}

export async function createJournalPost(
  _prevState: JournalActionResult,
  formData: FormData
): Promise<JournalActionResult> {
  await requireAdmin();

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    type: formData.get("type") || "STORY",
    status: formData.get("status") || "DRAFT",
    publishedAt: formData.get("publishedAt") ? new Date(formData.get("publishedAt") as string) : null,
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    featuredOrder: formData.get("featuredOrder") !== "" ? formData.get("featuredOrder") : null,
    coverMediaId: formData.get("coverMediaId") !== "" ? formData.get("coverMediaId") : null,
    ogMediaId: formData.get("ogMediaId") !== "" ? formData.get("ogMediaId") : null,
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    trailId: formData.get("trailId") !== "" ? formData.get("trailId") : null,
  };

  const parsed = journalSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const err of parsed.error.issues) {
      const field = err.path.join(".");
      errors[field] = err.message;
    }
    return { success: false, errors };
  }

  const data = parsed.data;

  try {
    const existing = await prisma.journalPost.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return {
        success: false,
        errors: { slug: "A post with this slug already exists" },
      };
    }

    let publishedAt = data.publishedAt;
    if (data.status === ContentStatus.PUBLISHED && !publishedAt) {
      publishedAt = new Date();
    }

    await prisma.journalPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        type: data.type as JournalType,
        status: data.status as ContentStatus,
        publishedAt,
        isFeatured: data.isFeatured,
        featuredOrder: data.featuredOrder ?? null,
        coverMediaId: data.coverMediaId ?? null,
        ogMediaId: data.ogMediaId ?? null,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        trailId: data.trailId ?? null,
      },
    });

    revalidatePath("/admin/journal");
    revalidatePath("/journal");
    revalidatePath("/food");
  } catch (error) {
    console.error("[admin:journal:create]", error);
    return { success: false, error: "Failed to create journal post" };
  }

  redirect("/admin/journal");
}

export async function updateJournalPost(
  id: number,
  _prevState: JournalActionResult,
  formData: FormData
): Promise<JournalActionResult> {
  await requireAdmin();

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    type: formData.get("type") || "STORY",
    status: formData.get("status") || "DRAFT",
    publishedAt: formData.get("publishedAt") ? new Date(formData.get("publishedAt") as string) : null,
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    featuredOrder: formData.get("featuredOrder") !== "" ? formData.get("featuredOrder") : null,
    coverMediaId: formData.get("coverMediaId") !== "" ? formData.get("coverMediaId") : null,
    ogMediaId: formData.get("ogMediaId") !== "" ? formData.get("ogMediaId") : null,
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    trailId: formData.get("trailId") !== "" ? formData.get("trailId") : null,
  };

  const parsed = journalSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const err of parsed.error.issues) {
      const field = err.path.join(".");
      errors[field] = err.message;
    }
    return { success: false, errors };
  }

  const data = parsed.data;

  try {
    const existing = await prisma.journalPost.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, error: "Journal post not found" };
    }

    if (existing.slug !== data.slug) {
      const slugTaken = await prisma.journalPost.findUnique({
        where: { slug: data.slug },
      });
      if (slugTaken) {
        return {
          success: false,
          errors: { slug: "A post with this slug already exists" },
        };
      }
    }

    let publishedAt = data.publishedAt;
    if (data.status === ContentStatus.PUBLISHED && !publishedAt) {
      publishedAt = existing.publishedAt || new Date();
    }

    await prisma.journalPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        type: data.type as JournalType,
        status: data.status as ContentStatus,
        publishedAt,
        isFeatured: data.isFeatured,
        featuredOrder: data.featuredOrder ?? null,
        coverMediaId: data.coverMediaId ?? null,
        ogMediaId: data.ogMediaId ?? null,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        trailId: data.trailId ?? null,
      },
    });

    revalidatePath("/admin/journal");
    revalidatePath(`/admin/journal/${id}/edit`);
    revalidatePath("/journal");
    revalidatePath(`/journal/${data.slug}`);
    revalidatePath("/food");
    revalidatePath(`/food/${data.slug}`);
    if (existing.slug !== data.slug) {
      revalidatePath(`/journal/${existing.slug}`);
      revalidatePath(`/food/${existing.slug}`);
    }
  } catch (error) {
    console.error("[admin:journal:update]", error);
    return { success: false, error: "Failed to update journal post" };
  }

  redirect("/admin/journal");
}

export async function deleteJournalPost(id: number): Promise<JournalActionResult> {
  await requireAdmin();

  try {
    const post = await prisma.journalPost.findUnique({ where: { id } });
    if (!post) {
      return { success: false, error: "Journal post not found" };
    }

    await prisma.journalPost.delete({ where: { id } });

    revalidatePath("/admin/journal");
    revalidatePath("/journal");
    revalidatePath("/food");
  } catch (error) {
    console.error("[admin:journal:delete]", error);
    return { success: false, error: "Failed to delete journal post" };
  }

  return { success: true };
}

export async function generateSlug(name: string): Promise<string> {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
