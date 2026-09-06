export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;
export const DEFAULT_PAGE_SIZE = 5;

export interface PageParams {
  page: number;
  pageSize: number;
  skip: number;
}

// Parses `page`/`pageSize` from a request's search params. Returns null when
// neither is present — callers use that as a signal to fall back to returning
// the full, unpaginated list, so any consumer that doesn't yet ask for a page
// (e.g. the public site's course list) keeps working unchanged.
export function parsePageParams(searchParams: URLSearchParams): PageParams | null {
  if (!searchParams.has("page") && !searchParams.has("pageSize")) return null;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const rawPageSize = parseInt(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE), 10);
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawPageSize)
    ? rawPageSize
    : DEFAULT_PAGE_SIZE;

  return { page, pageSize, skip: (page - 1) * pageSize };
}

export function paginationMeta(total: number, page: number, pageSize: number) {
  return { total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}
