import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JournalType } from "@prisma/client";
import JournalForm from "@/components/admin/JournalForm";
import { createJournalPost, updateJournalPost } from "@/app/admin/(protected)/journal/actions";

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
    prisma.journalPost.findUnique({
      where: { id: postId, type: JournalType.STORY },
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
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-2">
          Edit Story
        </h1>
        <p className="text-[#8D6E63]">
          Editing &ldquo;{post.title}&rdquo;
        </p>
      </div>
      <JournalForm
        post={post}
        trails={trails}
        mode="edit"
        contentType="STORY"
        createAction={createJournalPost}
        updateAction={updateJournalPost}
        initialCover={initialCover}
        initialOg={initialOg}
      />
    </div>
  );
}
