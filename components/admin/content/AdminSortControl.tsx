export interface AdminSortOption {
  value: string;
  label: string;
}

export default function AdminSortControl({
  sortBy,
  sortOrder,
  options,
  nameSortBy = "sortBy",
  nameSortOrder = "sortOrder",
}: {
  sortBy: string;
  sortOrder: string;
  options: AdminSortOption[];
  nameSortBy?: string;
  nameSortOrder?: string;
}) {
  return (
    <div className="admin-content-sort">
      <label className="admin-content-sort-label">Sort:</label>
      <select
        name={nameSortBy}
        defaultValue={sortBy}
        className="admin-content-sort-select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        name={nameSortOrder}
        defaultValue={sortOrder}
        className="admin-content-sort-select admin-content-sort-select-sm"
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
}
