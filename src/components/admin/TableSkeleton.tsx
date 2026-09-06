interface TableSkeletonProps {
  rows?: number;
  /** Number of plain filler bar columns, in addition to the leading avatar+text column. */
  columns?: number;
  /** Shows a thumbnail/avatar + two-line text block as the first cell (name + email/subtitle). */
  showAvatar?: boolean;
  /** Shows two action-button placeholders at the end of each row. */
  showActions?: boolean;
}

// A generic shimmering placeholder that stands in for a table's rows while
// data loads — shaped like the tables used across the admin panel (leading
// thumbnail/name cell, a few text columns, trailing action buttons) so the
// layout doesn't jump once real rows arrive.
export default function TableSkeleton({
  rows = 5,
  columns = 3,
  showAvatar = true,
  showActions = true,
}: TableSkeletonProps) {
  return (
    <div className="animate-pulse divide-y divide-[var(--color-border)]">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-6 px-5 py-4">
          {showAvatar && (
            <div className="flex items-center gap-3 w-44 shrink-0">
              <div className="w-10 h-8 rounded-lg bg-gray-700/40 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="h-3 w-4/5 rounded bg-gray-700/40" />
                <div className="h-2.5 w-3/5 rounded bg-gray-700/25" />
              </div>
            </div>
          )}
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className="h-3 flex-1 rounded bg-gray-700/30" />
          ))}
          {showActions && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-16 h-7 rounded-lg bg-gray-700/30" />
              <div className="w-7 h-7 rounded-lg bg-gray-700/30" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
