"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import TableSkeleton from "@/components/admin/TableSkeleton";

// "confirmed"/"cancelled" are the status values stored in the database —
// displayed as "Approved"/"Rejected" to match the enrollment wording.
const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30",
  confirmed: "text-green-400 bg-green-400/10 border border-green-400/30",
  cancelled: "text-red-400 bg-red-400/10 border border-red-400/30",
  completed: "text-violet-400 bg-violet-400/10 border border-violet-400/30",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Approved",
  cancelled: "Rejected",
  completed: "Completed",
};

type TrialStatus = "pending" | "confirmed" | "cancelled" | "completed";

type TrialRecord = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course?: string;
  status: string;
  createdAt: string;
};

const FILTERS = ["All", "Pending", "Approved", "Rejected", "Completed"] as const;

// Maps the filter chip label to the actual status value stored in the
// database ("Approved" chip -> "confirmed" status, "Rejected" -> "cancelled").
const FILTER_STATUS: Record<(typeof FILTERS)[number], string> = {
  All: "all",
  Pending: "pending",
  Approved: "confirmed",
  Rejected: "cancelled",
  Completed: "completed",
};

export default function AdminTrialsPage() {
  const [trials, setTrials] = useState<TrialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<TrialRecord | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadTrials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        status: FILTER_STATUS[filter],
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/trials?${params.toString()}`);
      if (!res.ok) throw new Error("Unable to load trial requests");
      const data = await res.json();
      setTrials(data.trials ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load trial requests");
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever the page, page size, filter, or search changes. Search
  // is debounced so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(loadTrials, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filter, search]);

  // A filter/search change should jump back to page 1 rather than staying on
  // a page that may no longer exist for the new result set.
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const updateStatus = async (id: string, status: TrialStatus) => {
    setUpdatingId(id);
    setError("");
    try {
      const res = await fetch(`/api/trials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      // Refetch rather than patch locally — under an active status filter, the
      // row may no longer belong on this page/filter once its status changes.
      await loadTrials();
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
      const res = await fetch(`/api/trials/${confirmDelete._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete trial request");
      setConfirmDelete(null);
      await loadTrials();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete trial request");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-white">Trial Class Requests</h2>
          <p className="text-gray-400 text-sm mt-1">Review and manage trial bookings submitted from the site.</p>
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
        ) : trials.length === 0 ? (
          <p className="px-5 py-6 text-gray-400">
            {total === 0 && filter === "All" && !search ? "No trial requests yet." : "No trial requests match your filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Course</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Phone</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trials.map((trial) => {
                  const updating = updatingId === trial._id;
                  return (
                    <tr key={trial._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-white font-medium">{trial.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{trial.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400">{trial.course || "—"}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">{trial.phone || "—"}</td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{new Date(trial.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[trial.status] || statusColors.pending}`}>
                          {statusLabels[trial.status] ?? trial.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateStatus(trial._id, "confirmed")}
                            disabled={updating || trial.status === "confirmed" || trial.status === "completed"}
                            title={trial.status === "completed" ? "Completed trials are managed from the Students tab" : "Approve trial request"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-400/40 text-green-400 hover:bg-green-400/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(trial._id, "cancelled")}
                            disabled={updating || trial.status === "cancelled" || trial.status === "completed"}
                            title={trial.status === "completed" ? "Completed trials are managed from the Students tab" : "Reject trial request"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                          <button
                            onClick={() => setConfirmDelete(trial)}
                            disabled={updating}
                            title="Delete trial request"
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
          title="Delete Trial Request?"
          message={`Delete the trial request for "${confirmDelete.name}"? This cannot be undone.`}
          loading={updatingId === confirmDelete._id}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
