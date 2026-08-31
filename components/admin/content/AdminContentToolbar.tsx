export default function AdminContentToolbar({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form method="GET" className={`admin-content-toolbar ${className}`}>
      {children}
    </form>
  );
}
