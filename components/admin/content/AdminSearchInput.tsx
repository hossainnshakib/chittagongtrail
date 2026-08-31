export default function AdminSearchInput({
  name = "search",
  defaultValue = "",
  placeholder = "Search...",
}: {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="admin-content-search"
      aria-label={placeholder}
    />
  );
}
