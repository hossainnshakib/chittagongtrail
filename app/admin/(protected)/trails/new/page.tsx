import TrailForm from "@/components/admin/TrailForm";

export default function NewTrailPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-2">
          New Trail
        </h1>
        <p className="text-[#8D6E63]">Add a new trail location.</p>
      </div>
      <TrailForm mode="create" />
    </div>
  );
}
