"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export interface JournalActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
}

function validateJournalForm(formData: FormData): {
  valid: boolean;
  errors: Record<string, string>;
  data: Record<string, string | number | null>;
} {
  const errors: Record<string, string> = {};

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const category = String(formData.get("category") || "story").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const coverImageAlt = String(formData.get("coverImageAlt") || "").trim();
  const metaTitle = String(formData.get("metaTitle") || "").trim();
  const metaDescription = String(formData.get("metaDescription") || "").trim();
  const ogImage = String(formData.get("ogImage") || "").trim();
  const trailId = formData.get("trailId");
  const publishedDate = String(formData.get("publishedDate") || "").trim();

  if (!title) errors.title = "Title is required";
  if (!slug) errors.slug = "Slug is required";
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.slug = "Slug must be URL-safe (lowercase letters, numbers, hyphens)";
  }
  if (!content) errors.content = "Content is required";

  const validCategories = ["story", "food"];
  if (!validCategories.includes(category)) {
    errors.category = "Category must be 'story' or 'food'";
  }

  const trailIdNum = trailId ? parseInt(String(trailId), 10) : null;
  if (trailId && (isNaN(trailIdNum!) || trailIdNum! <= 0)) {
    errors.trailId = "Invalid trail selection";
  }

  let publishedDateObj: Date | null = null;
  if (publishedDate) {
    publishedDateObj = new Date(publishedDate);
    if (isNaN(publishedDateObj.getTime())) {
      errors.publishedDate = "Invalid date format";
      publishedDateObj = null;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: {
      title,
      slug,
      content,
      category,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      coverImageAlt: coverImageAlt || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      ogImage: ogImage || null,
      trailId: trailIdNum,
      publishedDate: publishedDateObj?.toISOString() || null,
    },
  };
}

export async function createJournalPost(
  _prevState: JournalActionResult,
  formData: FormData
): Promise<JournalActionResult> {
  await requireAdmin();

  const { valid, errors, data } = validateJournalForm(formData);
  if (!valid) {
    return { success: false, errors };
  }

  try {
    const existing = await prisma.journalPost.findUnique({
      where: { slug: data.slug as string },
    });
    if (existing) {
      return {
        success: false,
        errors: { slug: "A post with this slug already exists" },
      };
    }

    await prisma.journalPost.create({
      data: {
        title: data.title as string,
        slug: data.slug as string,
        content: data.content as string,
        category: data.category as string,
        excerpt: data.excerpt as string | null,
        coverImage: data.coverImage as string | null,
        coverImageAlt: data.coverImageAlt as string | null,
        metaTitle: data.metaTitle as string | null,
        metaDescription: data.metaDescription as string | null,
        ogImage: data.ogImage as string | null,
        trailId: data.trailId as number | null,
        publishedDate: data.publishedDate
          ? new Date(data.publishedDate as string)
          : new Date(),
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

  const { valid, errors, data } = validateJournalForm(formData);
  if (!valid) {
    return { success: false, errors };
  }

  try {
    const existing = await prisma.journalPost.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, error: "Journal post not found" };
    }

    if (existing.slug !== data.slug) {
      const slugTaken = await prisma.journalPost.findUnique({
        where: { slug: data.slug as string },
      });
      if (slugTaken) {
        return {
          success: false,
          errors: { slug: "A post with this slug already exists" },
        };
      }
    }

    await prisma.journalPost.update({
      where: { id },
      data: {
        title: data.title as string,
        slug: data.slug as string,
        content: data.content as string,
        category: data.category as string,
        excerpt: data.excerpt as string | null,
        coverImage: data.coverImage as string | null,
        coverImageAlt: data.coverImageAlt as string | null,
        metaTitle: data.metaTitle as string | null,
        metaDescription: data.metaDescription as string | null,
        ogImage: data.ogImage as string | null,
        trailId: data.trailId as number | null,
        publishedDate: data.publishedDate
          ? new Date(data.publishedDate as string)
          : existing.publishedDate,
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

export async function deleteJournalPost(
  id: number
): Promise<JournalActionResult> {
  await requireAdmin();

  try {
    const post = await prisma.journalPost.findUnique({
      where: { id },
    });

    if (!post) {
      return { success: false, error: "Journal post not found" };
    }

    await prisma.journalPost.delete({ where: { id } });

    revalidatePath("/admin/journal");
    revalidatePath("/journal");
    revalidatePath(`/journal/${post.slug}`);
    revalidatePath("/food");
    revalidatePath(`/food/${post.slug}`);
  } catch (error) {
    console.error("[admin:journal:delete]", error);
    return { success: false, error: "Failed to delete journal post" };
  }

  return { success: true };
}

export async function getTrailsForSelect() {
  return prisma.trailLocation.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
