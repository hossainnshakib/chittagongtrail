import { prisma } from "./prisma";

export interface MediaValidationResult {
  valid: boolean;
  error?: string;
}

export async function validateMediaId(
  id: unknown,
  fieldName: string
): Promise<MediaValidationResult> {
  if (id === null || id === undefined || id === "") {
    return { valid: true };
  }

  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return { valid: false, error: `${fieldName} must be a positive integer` };
  }

  const asset = await prisma.mediaAsset.findUnique({
    where: { id: numId },
    select: { id: true, resourceType: true },
  });

  if (!asset) {
    return { valid: false, error: `${fieldName} references a nonexistent media asset` };
  }

  return { valid: true };
}

export async function validateImageMediaId(
  id: unknown,
  fieldName: string
): Promise<MediaValidationResult & { assetId?: number }> {
  if (id === null || id === undefined || id === "") {
    return { valid: true };
  }

  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return { valid: false, error: `${fieldName} must be a positive integer` };
  }

  const asset = await prisma.mediaAsset.findUnique({
    where: { id: numId },
    select: { id: true, resourceType: true },
  });

  if (!asset) {
    return { valid: false, error: `${fieldName} references a nonexistent media asset` };
  }

  if (asset.resourceType !== "image") {
    return { valid: false, error: `${fieldName} must be an image, but received ${asset.resourceType}` };
  }

  return { valid: true, assetId: numId };
}

export async function validateGalleryIds(
  ids: unknown,
  fieldName: string
): Promise<MediaValidationResult & { validIds?: number[] }> {
  if (ids === null || ids === undefined || ids === "") {
    return { valid: true, validIds: [] };
  }

  const raw = String(ids);
  if (raw.trim() === "") {
    return { valid: true, validIds: [] };
  }

  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const validIds: number[] = [];
  const seen = new Set<number>();

  for (const part of parts) {
    const numId = Number(part);
    if (!Number.isInteger(numId) || numId <= 0) {
      return { valid: false, error: `${fieldName} contains invalid ID: ${part}` };
    }

    if (seen.has(numId)) {
      return { valid: false, error: `${fieldName} contains duplicate ID: ${numId}` };
    }
    seen.add(numId);

    const asset = await prisma.mediaAsset.findUnique({
      where: { id: numId },
      select: { id: true, resourceType: true },
    });

    if (!asset) {
      return { valid: false, error: `${fieldName} references nonexistent media asset ID: ${numId}` };
    }

    if (asset.resourceType !== "image") {
      return { valid: false, error: `${fieldName} must contain only images, but asset ${numId} is ${asset.resourceType}` };
    }

    validIds.push(numId);
  }

  return { valid: true, validIds };
}

export async function validateAllMediaIds(data: {
  coverMediaId?: unknown;
  ogMediaId?: unknown;
  galleryIds?: unknown;
}): Promise<MediaValidationResult & { validCoverId?: number | null; validOgId?: number | null; validGalleryIds?: number[] }> {
  const coverResult = await validateImageMediaId(data.coverMediaId, "Cover image");
  if (!coverResult.valid) {
    return { valid: false, error: coverResult.error };
  }

  const ogResult = await validateImageMediaId(data.ogMediaId, "OG image");
  if (!ogResult.valid) {
    return { valid: false, error: ogResult.error };
  }

  const galleryResult = await validateGalleryIds(data.galleryIds, "Gallery");
  if (!galleryResult.valid) {
    return { valid: false, error: galleryResult.error };
  }

  return {
    valid: true,
    validCoverId: coverResult.assetId ?? null,
    validOgId: ogResult.assetId ?? null,
    validGalleryIds: galleryResult.validIds ?? [],
  };
}
