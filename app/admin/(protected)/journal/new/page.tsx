import { prisma } from "@/lib/prisma";
import JournalForm from "@/components/admin/JournalForm";
import { createJournalPost, updateJournalPost } from "@/app/admin/(protected)/journal/actions";

export default async function NewJournalPage() {
  const trails = await prisma.trailLocation.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-2">
          New Story
        </h1>
        <p className="text-[#8D6E63]">Create a new story.</p>
      </div>
      <JournalForm
        trails={trails}
        mode="create"
        contentType="STORY"
        createAction={createJournalPost}
        updateAction={updateJournalPost}
      />
    </div>
  );
}
