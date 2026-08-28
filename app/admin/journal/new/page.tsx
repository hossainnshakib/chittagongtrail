import { prisma } from "@/lib/prisma";
import JournalForm from "@/components/admin/JournalForm";

export default async function NewJournalPage() {
  const trails = await prisma.trailLocation.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-2">
          New Journal Post
        </h1>
        <p className="text-[#8D6E63]">Create a new journal post or food story.</p>
      </div>
      <JournalForm trails={trails} mode="create" />
    </div>
  );
}
