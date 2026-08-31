import { prisma } from "@/lib/prisma";
import JournalForm from "@/components/admin/JournalForm";
import { createFoodPost, updateFoodPost } from "@/app/admin/(protected)/food/actions";

export default async function NewFoodPage() {
  const trails = await prisma.trailLocation.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div style={{ "--admin-content-max-width": "800px" } as React.CSSProperties}>
      <div className="mb-6">
        <h1
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--admin-text-primary)", fontFamily: "var(--font-body)" }}
        >
          New Food Post
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--admin-text-secondary)" }}>
          Create a new food story.
        </p>
      </div>
      <JournalForm
        trails={trails}
        mode="create"
        contentType="FOOD"
        createAction={createFoodPost}
        updateAction={updateFoodPost}
      />
    </div>
  );
}
