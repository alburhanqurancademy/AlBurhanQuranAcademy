"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import TableSkeleton from "@/components/admin/TableSkeleton";

const statusColors: Record<string, string> = {
  pending:   "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30",
  approved:  "text-green-400 bg-green-400/10 border border-green-400/30",
  rejected:  "text-red-400 bg-red-400/10 border border-red-400/30",
  completed: "text-violet-400 bg-violet-400/10 border border-violet-400/30",
};

type EnrollmentStatus = "pending" | "approved" | "rejected" | "completed";

type EnrollmentRecord = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  country?: string;
  gender?: string;
  age?: string;
  guardianName?: string;
  guardianPhone?: string;
  convenientTimeFrom?: string;
  convenientTimeTo?: string;
  frequency?: string;
  daySlot?: string;
  message?: string;
  status: string;
  createdAt: string;
};

const FILTERS = ["All", "Pending", "Approved", "Rejected", "Completed"] as const;

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<EnrollmentRecord | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        status: filter.toLowerCase(),
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/enrollments?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to load enrollments");
      setEnrollments(data.enrollments ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever the page, page size, filter, or search changes. Search
  // is debounced so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(loadEnrollments, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filter, search]);

  // A filter/search change should jump back to page 1 rather than staying on
  // a page that may no longer exist for the new result set.
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const updateStatus = async (id: string, status: EnrollmentStatus) => {
    setUpdatingId(id);
    setError("");
    try {
      const res = await fetch(`/api/enrollments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      // Refetch rather than patch locally — under an active status filter, the
      // row may no longer belong on this page/filter once its status changes.
      await loadEnrollments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setUpdatingId(confirmDelete._id);
    setError("");
    try {
      const res = await fetch(`/api/enrollments/${confirmDelete._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete enrollment");
      setConfirmDelete(null);
      await loadEnrollments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete enrollment");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Enrollments</h2>
          <p className="text-gray-400 text-sm mt-1">Manage student enrollment requests</p>
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                f === filter
                  ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                  : "border-[var(--color-border)] text-gray-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by name or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)]/60"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {loading ? (
          <TableSkeleton rows={pageSize} columns={4} />
        ) : enrollments.length === 0 ? (
          <p className="px-5 py-6 text-gray-400">
            {total === 0 && filter === "All" && !search ? "No enrollments yet." : "No enrollments match your filters."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Student</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Course</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Details</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => {
                const updating = updatingId === e._id;
                return (
                  <tr key={e._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium">{e.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{e.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">{e.course}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      <div className="space-y-1">
                        <p>Phone: {e.phone}</p>
                        <p>Country: {e.country || "-"}</p>
                        <p>Gender: {e.gender || "-"}</p>
                        {e.age && <p>Age: {e.age}</p>}
                        {e.guardianName && <p>Guardian: {e.guardianName}</p>}
                        {e.guardianPhone && <p>Guardian Phone: {e.guardianPhone}</p>}
                        {(e.convenientTimeFrom || e.convenientTimeTo) && <p>Time: {e.convenientTimeFrom || "-"} to {e.convenientTimeTo || "-"}</p>}
                        {e.frequency && <p>Frequency: {e.frequency}</p>}
                        {e.daySlot && <p>Days: {e.daySlot}</p>}
                        {e.message && <p>Message: {e.message}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[e.status] || statusColors.pending}`}>{e.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateStatus(e._id, "approved")}
                          disabled={updating || e.status === "approved" || e.status === "completed"}
                          title={e.status === "completed" ? "Completed enrollments are managed from the Students tab" : "Approve enrollment"}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-400/40 text-green-400 hover:bg-green-400/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(e._id, "rejected")}
                          disabled={updating || e.status === "rejected" || e.status === "completed"}
                          title={e.status === "completed" ? "Completed enrollments are managed from the Students tab" : "Reject enrollment"}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                        <button
                          onClick={() => setConfirmDelete(e)}
                          disabled={updating}
                          title="Delete enrollment"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
      </div>

      {confirmDelete && (
        <ConfirmDeleteModal
          title="Delete Enrollment?"
          message={`Delete the enrollment for "${confirmDelete.name}"? This cannot be undone.`}
          loading={updatingId === confirmDelete._id}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
