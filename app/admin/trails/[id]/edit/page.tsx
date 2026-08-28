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
  });

  if (!trail) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-2">
          Edit Trail
        </h1>
        <p className="text-[#8D6E63]">
          Editing &ldquo;{trail.name}&rdquo;
        </p>
      </div>
      <TrailForm trail={trail} mode="edit" />
    </div>
  );
}
