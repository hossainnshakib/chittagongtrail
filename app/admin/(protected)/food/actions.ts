"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { journalSchema } from "@/lib/validation";
import { ContentStatus, JournalType } from "@prisma/client";

export interface FoodActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
}

export async function createFoodPost(
  _prevState: FoodActionResult,
  formData: FormData
): Promise<FoodActionResult> {
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
        type: JournalType.FOOD,
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

    revalidatePath("/admin/food");
    revalidatePath("/food");
  } catch (error) {
    console.error("[admin:food:create]", error);
    return { success: false, error: "Failed to create food post" };
  }

  redirect("/admin/food");
}

export async function updateFoodPost(
  id: number,
  _prevState: FoodActionResult,
  formData: FormData
): Promise<FoodActionResult> {
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

  const data = parsed.data;

  try {
    const existing = await prisma.journalPost.findUnique({
      where: { id },
    });
    if (!existing || existing.type !== JournalType.FOOD) {
      return { success: false, error: "Food post not found" };
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
        type: JournalType.FOOD,
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

    revalidatePath("/admin/food");
    revalidatePath(`/admin/food/${id}/edit`);
    revalidatePath("/food");
    revalidatePath(`/food/${data.slug}`);
    if (existing.slug !== data.slug) {
      revalidatePath(`/food/${existing.slug}`);
    }
  } catch (error) {
    console.error("[admin:food:update]", error);
    return { success: false, error: "Failed to update food post" };
  }

  redirect("/admin/food");
}
