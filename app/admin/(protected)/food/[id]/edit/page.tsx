import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FoodJournalForm from "@/components/admin/FoodJournalForm";
import { JournalType } from "@prisma/client";

export default async function EditFoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    notFound();
  }

  const [post, trails] = await Promise.all([
    prisma.journalPost.findUnique({ where: { id: postId } }),
    prisma.trailLocation.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!post || post.type !== JournalType.FOOD) {
    notFound();
  }

  return (
    <div style={{ "--admin-content-max-width": "800px" } as React.CSSProperties}>
      <div className="mb-6">
        <h1
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--admin-text-primary)", fontFamily: "var(--font-body)" }}
        >
          Edit Food Post
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--admin-text-secondary)" }}>
          Editing &ldquo;{post.title}&rdquo;
        </p>
      </div>
      <FoodJournalForm post={post} trails={trails} mode="edit" />
    </div>
  );
}
