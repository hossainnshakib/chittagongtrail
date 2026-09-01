import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TrailForm from "@/components/admin/TrailForm";

export default async function EditTrailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trailId = parseInt(id, 10);

  if (isNaN(trailId)) {
    notFound();
  }

  const trail = await prisma.trailLocation.findUnique({
    where: { id: trailId },
    include: {
      coverMedia: true,
      ogMedia: true,
      gallery: {
        include: { mediaAsset: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!trail) {
    notFound();
  }

  const initialCover = trail.coverMedia ? {
    id: trail.coverMedia.id,
    publicId: trail.coverMedia.publicId,
    secureUrl: trail.coverMedia.secureUrl,
    resourceType: trail.coverMedia.resourceType,
    format: trail.coverMedia.format,
    width: trail.coverMedia.width,
    height: trail.coverMedia.height,
    altText: trail.coverMedia.altText,
  } : null;

  const initialOg = trail.ogMedia ? {
    id: trail.ogMedia.id,
    publicId: trail.ogMedia.publicId,
    secureUrl: trail.ogMedia.secureUrl,
    resourceType: trail.ogMedia.resourceType,
    format: trail.ogMedia.format,
    width: trail.ogMedia.width,
    height: trail.ogMedia.height,
    altText: trail.ogMedia.altText,
  } : null;

  const initialGallery = trail.gallery.map((g) => ({
    id: g.mediaAsset.id,
    publicId: g.mediaAsset.publicId,
    secureUrl: g.mediaAsset.secureUrl,
    resourceType: g.mediaAsset.resourceType,
    format: g.mediaAsset.format,
    width: g.mediaAsset.width,
    height: g.mediaAsset.height,
    altText: g.mediaAsset.altText,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-[#3E2723]" style={{ fontFamily: "var(--font-body)" }}>
          Edit Trail
        </h1>
        <p className="mt-1 text-sm text-[#8D6E63]">
          Editing &ldquo;{trail.name}&rdquo;
        </p>
      </div>
      <TrailForm trail={trail} mode="edit" initialCover={initialCover} initialOg={initialOg} initialGallery={initialGallery} />
    </div>
  );
}
