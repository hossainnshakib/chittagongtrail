"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { journalSchema } from "@/lib/validation";
import { validateImageMediaId } from "@/lib/media-validation";
import { ContentStatus, JournalType } from "@prisma/client";

export interface JournalActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
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

  const coverResult = await validateImageMediaId(raw.coverMediaId, "Cover image");
  if (!coverResult.valid) {
    return { success: false, error: coverResult.error };
  }

  const ogResult = await validateImageMediaId(raw.ogMediaId, "OG image");
  if (!ogResult.valid) {
    return { success: false, error: ogResult.error };
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

    const coverId = coverResult.assetId ?? null;
    const ogId = ogResult.assetId ?? coverId;

    await prisma.journalPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        type: JournalType.STORY,
        status: data.status as ContentStatus,
        publishedAt,
        isFeatured: data.isFeatured,
        featuredOrder: data.featuredOrder ?? null,
        coverMediaId: coverId,
        ogMediaId: ogId,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        trailId: data.trailId ?? null,
      },
    });

    revalidatePath("/admin/journal");
    revalidatePath("/journal");
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

  const coverResult = await validateImageMediaId(raw.coverMediaId, "Cover image");
  if (!coverResult.valid) {
    return { success: false, error: coverResult.error };
  }

  const ogResult = await validateImageMediaId(raw.ogMediaId, "OG image");
  if (!ogResult.valid) {
    return { success: false, error: ogResult.error };
  }

  const data = parsed.data;

  try {
    const existing = await prisma.journalPost.findUnique({
      where: { id },
    });
    if (!existing || existing.type !== JournalType.STORY) {
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

    const coverId = coverResult.assetId ?? null;
    const ogId = ogResult.assetId ?? coverId;

    await prisma.journalPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        type: JournalType.STORY,
        status: data.status as ContentStatus,
        publishedAt,
        isFeatured: data.isFeatured,
        featuredOrder: data.featuredOrder ?? null,
        coverMediaId: coverId,
        ogMediaId: ogId,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        trailId: data.trailId ?? null,
      },
    });

    revalidatePath("/admin/journal");
    revalidatePath(`/admin/journal/${id}/edit`);
    revalidatePath("/journal");
    revalidatePath(`/journal/${data.slug}`);
    if (existing.slug !== data.slug) {
      revalidatePath(`/journal/${existing.slug}`);
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
    if (!post || post.type !== JournalType.STORY) {
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
