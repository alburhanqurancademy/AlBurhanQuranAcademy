import TableSkeleton from "@/components/admin/TableSkeleton";

// Next.js renders this automatically (inside the existing admin layout, so
// the sidebar/top bar stay put) while the Dashboard's async Server Component
// fetches its stats and today's activity — no client-side loading state needed.
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="animate-pulse">
        <div className="h-7 w-40 rounded bg-gray-700/40" />
        <div className="h-4 w-80 rounded bg-gray-700/25 mt-2.5" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-gray-700/40 shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="h-6 w-12 rounded bg-gray-700/40" />
              <div className="h-2.5 w-20 rounded bg-gray-700/25" />
              <div className="h-2.5 w-16 rounded bg-gray-700/20" />
            </div>
          </div>
        ))}
      </div>

      {/* Today's Enrollments */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-40 rounded bg-gray-700/40" />
            <div className="h-2.5 w-28 rounded bg-gray-700/20" />
          </div>
          <div className="h-3 w-14 rounded bg-gray-700/25" />
        </div>
        <TableSkeleton rows={4} columns={3} showActions={false} />
      </div>

      {/* Today's Trial Requests */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-44 rounded bg-gray-700/40" />
            <div className="h-2.5 w-28 rounded bg-gray-700/20" />
          </div>
          <div className="h-3 w-14 rounded bg-gray-700/25" />
        </div>
        <TableSkeleton rows={4} columns={3} showActions={false} />
      </div>
    </div>
  );
}
