import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JournalType } from "@prisma/client";
import JournalForm from "@/components/admin/JournalForm";
import { createFoodPost, updateFoodPost } from "@/app/admin/(protected)/food/actions";

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
    prisma.journalPost.findUnique({
      where: { id: postId, type: JournalType.FOOD },
      include: { coverMedia: true, ogMedia: true },
    }),
    prisma.trailLocation.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!post) {
    notFound();
  }

  const initialCover = post.coverMedia ? {
    id: post.coverMedia.id,
    publicId: post.coverMedia.publicId,
    secureUrl: post.coverMedia.secureUrl,
    resourceType: post.coverMedia.resourceType,
    format: post.coverMedia.format,
    width: post.coverMedia.width,
    height: post.coverMedia.height,
    altText: post.coverMedia.altText,
  } : null;

  const initialOg = post.ogMedia ? {
    id: post.ogMedia.id,
    publicId: post.ogMedia.publicId,
    secureUrl: post.ogMedia.secureUrl,
    resourceType: post.ogMedia.resourceType,
    format: post.ogMedia.format,
    width: post.ogMedia.width,
    height: post.ogMedia.height,
    altText: post.ogMedia.altText,
  } : null;

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
      <JournalForm
        post={post}
        trails={trails}
        mode="edit"
        contentType="FOOD"
        createAction={createFoodPost}
        updateAction={updateFoodPost}
        initialCover={initialCover}
        initialOg={initialOg}
      />
    </div>
  );
}
