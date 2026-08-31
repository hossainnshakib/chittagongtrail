export interface AdminFilterOption {
  value: string;
  label: string;
}

export default function AdminFilterGroup({
  name,
  label,
  options,
  defaultValue = "ALL",
}: {
  name: string;
  label: string;
  options: AdminFilterOption[];
  defaultValue?: string;
}) {
  return (
    <div className="admin-content-filter">
      <label htmlFor={`filter-${name}`} className="admin-content-filter-label">
        {label}
      </label>
      <select
        id={`filter-${name}`}
        name={name}
        defaultValue={defaultValue}
        className="admin-content-filter-select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
