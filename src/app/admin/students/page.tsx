"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import TableSkeleton from "@/components/admin/TableSkeleton";

// "confirmed"/"cancelled" are the trial status values stored in the database —
// displayed as "Approved"/"Rejected" to match the enrollment wording, so both
// use the same styling here. "completed" is a shared terminal status set from
// this page only, for either record type.
const statusColors: Record<string, string> = {
  pending:   "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30",
  approved:  "text-green-400 bg-green-400/10 border border-green-400/30",
  rejected:  "text-red-400 bg-red-400/10 border border-red-400/30",
  confirmed: "text-green-400 bg-green-400/10 border border-green-400/30",
  cancelled: "text-red-400 bg-red-400/10 border border-red-400/30",
  completed: "text-violet-400 bg-violet-400/10 border border-violet-400/30",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  confirmed: "Approved",
  cancelled: "Rejected",
  completed: "Completed",
};

const typeColors: Record<string, string> = {
  Enrollment: "text-[var(--color-accent)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30",
  Trial:      "text-[var(--color-sky)] bg-[var(--color-sky)]/10 border border-[var(--color-sky)]/30",
};

interface StudentRow {
  id: string;
  docId: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  type: "Enrollment" | "Trial";
  status: "pending" | "approved" | "rejected" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

const FILTERS = ["All", "Pending", "Approved", "Rejected", "Completed"] as const;

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<StudentRow | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        status: filter.toLowerCase(),
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load students");
      setStudents(data.students ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever the page, page size, filter, or search changes. Search
  // is debounced so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(loadStudents, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filter, search]);

  // A filter/search change should jump back to page 1 rather than staying on
  // a page that may no longer exist for the new result set.
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  // Marks an approved enrollment or trial as completed. This is the only
  // place "completed" is set from — Enrollments/Trials only ever approve/reject.
  const markComplete = async (s: StudentRow) => {
    setUpdatingId(s.id);
    setError("");
    try {
      const endpoint = s.type === "Enrollment" ? `/api/enrollments/${s.docId}` : `/api/trials/${s.docId}`;
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to mark as completed");
      await loadStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as completed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const kind = confirmDelete.type === "Enrollment" ? "enrollment" : "trial request";
    setUpdatingId(confirmDelete.id);
    setError("");
    try {
      const endpoint =
        confirmDelete.type === "Enrollment" ? `/api/enrollments/${confirmDelete.docId}` : `/api/trials/${confirmDelete.docId}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to delete ${kind}`);
      setConfirmDelete(null);
      await loadStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete ${kind}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-white">Students</h2>
          <p className="text-gray-400 text-sm mt-1">Pending, approved, rejected &amp; completed enrollments and trial students</p>
        </div>
        <div className="flex gap-2 flex-wrap">
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
          placeholder="Search by name, email or course..."
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
          <TableSkeleton rows={pageSize} columns={5} />
        ) : students.length === 0 ? (
          <p className="px-5 py-6 text-gray-400">
            {total === 0 && filter === "All" && !search
              ? "No students yet — submit an enrollment or trial request to see them here."
              : "No students match your filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Course</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Phone</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const canComplete = s.status === "approved" || s.status === "confirmed";
                  const updating = updatingId === s.id;
                  return (
                    <tr key={s.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-white font-medium">{s.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{s.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400">{s.course}</td>
                      <td className="px-5 py-3.5 text-gray-400">{s.phone}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeColors[s.type]}`}>{s.type}</span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[s.status]}`}>
                          {statusLabels[s.status] ?? s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {canComplete && (
                            <button
                              onClick={() => markComplete(s)}
                              disabled={updating}
                              title="Mark as completed"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-violet-400/40 text-violet-400 hover:bg-violet-400/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {updating ? "Updating..." : "Complete"}
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmDelete(s)}
                            disabled={updating}
                            title={`Delete ${s.type.toLowerCase()}`}
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
          </div>
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
          title={confirmDelete.type === "Enrollment" ? "Delete Enrollment?" : "Delete Trial Request?"}
          message={`Delete the ${confirmDelete.type === "Enrollment" ? "enrollment" : "trial request"} for "${confirmDelete.name}"? This cannot be undone.`}
          loading={updatingId === confirmDelete.id}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
