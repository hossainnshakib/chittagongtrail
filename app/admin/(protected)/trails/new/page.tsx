import TrailForm from "@/components/admin/TrailForm";

export default function NewTrailPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-[#3E2723]" style={{ fontFamily: "var(--font-body)" }}>
          New Trail
        </h1>
        <p className="mt-1 text-sm text-[#8D6E63]">Add a new trail location.</p>
      </div>
      <TrailForm mode="create" />
    </div>
  );
}
