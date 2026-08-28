"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export interface TrailActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function validateTrailForm(formData: FormData): {
  valid: boolean;
  errors: Record<string, string>;
  data: Record<string, string | number | null>;
} {
  const errors: Record<string, string> = {};

  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");
  const photoAlt = String(formData.get("photoAlt") || "").trim();
  const metaTitle = String(formData.get("metaTitle") || "").trim();
  const metaDescription = String(formData.get("metaDescription") || "").trim();
  const ogImage = String(formData.get("ogImage") || "").trim();
  const photos = String(formData.get("photos") || "").trim();

  if (!name) errors.name = "Name is required";
  if (!slug) errors.slug = "Slug is required";
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.slug = "Slug must be URL-safe (lowercase letters, numbers, hyphens)";
  }
  if (!description) errors.description = "Description is required";

  const lat = latitude ? parseFloat(String(latitude)) : null;
  const lng = longitude ? parseFloat(String(longitude)) : null;

  if (latitude !== null && latitude !== "") {
    if (isNaN(lat!) || lat! < -90 || lat! > 90) {
      errors.latitude = "Latitude must be between -90 and 90";
    }
  }
  if (longitude !== null && longitude !== "") {
    if (isNaN(lng!) || lng! < -180 || lng! > 180) {
      errors.longitude = "Longitude must be between -180 and 180";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: {
      name,
      slug,
      description,
      latitude: lat,
      longitude: lng,
      photos: photos || null,
      photoAlt: photoAlt || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      ogImage: ogImage || null,
    },
  };
}

export async function createTrail(
  _prevState: TrailActionResult,
  formData: FormData
): Promise<TrailActionResult> {
  await requireAdmin();

  const { valid, errors, data } = validateTrailForm(formData);
  if (!valid) {
    return { success: false, errors };
  }

  try {
    const existing = await prisma.trailLocation.findUnique({
      where: { slug: data.slug as string },
    });
    if (existing) {
      return {
        success: false,
        errors: { slug: "A trail with this slug already exists" },
      };
    }

    await prisma.trailLocation.create({
      data: {
        name: data.name as string,
        slug: data.slug as string,
        description: data.description as string,
        latitude: data.latitude as number | null,
        longitude: data.longitude as number | null,
        photos: data.photos as string | null,
        photoAlt: data.photoAlt as string | null,
        metaTitle: data.metaTitle as string | null,
        metaDescription: data.metaDescription as string | null,
        ogImage: data.ogImage as string | null,
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

  const { valid, errors, data } = validateTrailForm(formData);
  if (!valid) {
    return { success: false, errors };
  }

  try {
    const existing = await prisma.trailLocation.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, error: "Trail not found" };
    }

    if (existing.slug !== data.slug) {
      const slugTaken = await prisma.trailLocation.findUnique({
        where: { slug: data.slug as string },
      });
      if (slugTaken) {
        return {
          success: false,
          errors: { slug: "A trail with this slug already exists" },
        };
      }
    }

    await prisma.trailLocation.update({
      where: { id },
      data: {
        name: data.name as string,
        slug: data.slug as string,
        description: data.description as string,
        latitude: data.latitude as number | null,
        longitude: data.longitude as number | null,
        photos: data.photos as string | null,
        photoAlt: data.photoAlt as string | null,
        metaTitle: data.metaTitle as string | null,
        metaDescription: data.metaDescription as string | null,
        ogImage: data.ogImage as string | null,
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

export async function generateSlug(name: string): Promise<string> {
  return slugify(name);
}
