"use client";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({ page, pageSize, total, totalPages, onPageChange, onPageSizeChange }: PaginationProps) {
  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3.5 border-t border-[var(--color-border)]">
      <p className="text-gray-500 text-xs">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-gray-500 text-xs">
          Rows per page:
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-[var(--color-black)] border border-[var(--color-border)] rounded-lg px-2 py-1 text-gray-300 text-xs focus:outline-none focus:border-[var(--color-accent)]/60"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            title="Previous page"
            className="p-1.5 rounded-lg border border-[var(--color-border)] text-gray-400 hover:text-white hover:border-[var(--color-accent)]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-gray-400 text-xs px-2 whitespace-nowrap">Page {page} of {totalPages}</span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            title="Next page"
            className="p-1.5 rounded-lg border border-[var(--color-border)] text-gray-400 hover:text-white hover:border-[var(--color-accent)]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
