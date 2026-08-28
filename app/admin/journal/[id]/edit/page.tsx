import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JournalForm from "@/components/admin/JournalForm";

export default async function EditJournalPage({
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

  if (!post) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-2">
          Edit Journal Post
        </h1>
        <p className="text-[#8D6E63]">
          Editing &ldquo;{post.title}&rdquo;
        </p>
      </div>
      <JournalForm post={post} trails={trails} mode="edit" />
    </div>
  );
}
