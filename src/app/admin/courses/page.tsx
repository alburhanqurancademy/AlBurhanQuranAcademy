"use client";

import { useEffect, useRef, useState } from "react";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import TableSkeleton from "@/components/admin/TableSkeleton";

interface CourseRow {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  ageGroup?: string;
  duration?: string;
  classDuration?: string;
  bullets?: string[];
  status: "active" | "inactive";
  createdAt: string;
  enrollmentCount: number;
}

const statusColors: Record<string, string> = {
  active:   "text-green-400 bg-green-400/10 border border-green-400/30",
  inactive: "text-gray-400 bg-gray-400/10 border border-gray-400/30",
};

const inputClass =
  "w-full bg-[var(--color-black)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)]/60";

const labelClass = "text-gray-400 text-xs font-semibold uppercase tracking-wider";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [listError, setListError] = useState("");
  const [modal, setModal] = useState<{ mode: "create" } | { mode: "edit"; course: CourseRow } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CourseRow | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/courses?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load courses");
      setCourses(data.courses ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setListError("");
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever the page, page size, or search changes. Search is
  // debounced so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(loadCourses, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search]);

  // A search change should jump back to page 1 rather than staying on a page
  // that may no longer exist for the new result set.
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete._id);
    try {
      const res = await fetch(`/api/courses/${confirmDelete._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete course");
      setConfirmDelete(null);
      await loadCourses();
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Courses</h2>
          <p className="text-gray-400 text-sm mt-1">Manage all courses</p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-bold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New Course
        </button>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)]/60"
        />
      </div>

      {listError && (
        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{listError}</p>
      )}

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {loading ? (
          <TableSkeleton rows={pageSize} columns={4} />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Image</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Course Name</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Duration</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Enrollments</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                    {total === 0 && !search ? "No courses yet. Click “New Course” to add one." : "No courses match your search."}
                  </td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-[var(--color-black)] border border-[var(--color-border)] flex items-center justify-center">
                        {c.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white font-medium">{c.title}</td>
                    <td className="px-5 py-3.5 text-gray-400">{c.duration || "—"}</td>
                    <td className="px-5 py-3.5 text-white font-semibold">{c.enrollmentCount}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal({ mode: "edit", course: c })}
                          title="Edit course"
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => setConfirmDelete(c)}
                          disabled={deletingId === c._id}
                          title="Delete course"
                          className="text-gray-400 hover:text-red-400 transition-colors p-1 disabled:opacity-40"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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

      {modal && (
        <CourseModal
          course={modal.mode === "edit" ? modal.course : undefined}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            loadCourses();
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          title="Delete Course?"
          message={`Delete "${confirmDelete.title}"? This cannot be undone.`}
          loading={deletingId === confirmDelete._id}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function CourseModal({ course, onClose, onSaved }: { course?: CourseRow; onClose: () => void; onSaved: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — course details
  const [title, setTitle] = useState(course?.title ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [ageGroup, setAgeGroup] = useState(course?.ageGroup ?? "");
  const [duration, setDuration] = useState(course?.duration ?? "");
  const [classDuration, setClassDuration] = useState(course?.classDuration ?? "");
  const [status, setStatus] = useState<"active" | "inactive">(course?.status ?? "active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(course?.image ?? "");

  // Step 2 — detail bullets
  const [bullets, setBullets] = useState<string[]>(course?.bullets?.length ? course.bullets : [""]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Only JPG, PNG, WEBP or GIF images are allowed.");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const updateBullet = (i: number, value: string) =>
    setBullets((prev) => prev.map((b, idx) => (idx === i ? value : b)));

  const removeBullet = (i: number) =>
    setBullets((prev) => prev.filter((_, idx) => idx !== i));

  const validateStep1 = () => {
    if (!course && !imageFile) return "Course image is required.";
    if (!title.trim()) return "Course name is required.";
    if (!description.trim()) return "Description is required.";
    if (!ageGroup.trim()) return "Age group is required.";
    if (!duration.trim()) return "Course duration is required.";
    if (!classDuration.trim()) return "Class time duration is required.";
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("status", status);
      formData.append("ageGroup", ageGroup.trim());
      formData.append("duration", duration.trim());
      formData.append("classDuration", classDuration.trim());
      formData.append("bullets", JSON.stringify(bullets.map((b) => b.trim()).filter(Boolean)));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(course ? `/api/courses/${course._id}` : "/api/courses", {
        method: course ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save course");

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[var(--color-black-soft)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-black text-lg">{course ? "Edit Course" : "New Course"}</h2>
              <p className="text-gray-400 text-xs mt-0.5">
                {step === 1 ? "Step 1 of 2 — Course Details" : "Step 2 of 2 — Course Highlights"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-gray-400 hover:text-white hover:border-[var(--color-accent)]/40 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step indicator */}
          <div className="mt-4 flex items-center gap-3">
            {([1, 2] as const).map((s) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`flex items-center gap-2 ${s <= step ? "opacity-100" : "opacity-40"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                    s < step ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                      : s === step ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent"
                      : "border-gray-600 text-gray-500 bg-transparent"
                  }`}>
                    {s < step ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s}
                  </div>
                  <span className={`text-xs font-medium ${s === step ? "text-white" : "text-gray-500"}`}>
                    {s === 1 ? "Course Details" : "Highlights"}
                  </span>
                </div>
                {s < 2 && <div className={`flex-1 h-px transition-all duration-500 ${step > 1 ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          {step === 1 ? (
            <div className="flex flex-col gap-4">
              {/* Image */}
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Course Image</label>
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-[var(--color-black)] border border-[var(--color-border)] flex items-center justify-center">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Course" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-600">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">No image selected</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-gray-300 hover:text-white hover:border-[var(--color-accent)]/50 text-sm font-semibold transition-all"
                  >
                    {preview ? "Change Image" : "Upload Image"}
                  </button>
                  <p className="text-gray-500 text-xs">JPG, PNG, WEBP or GIF.</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFile}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tajweed Course"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Age group / durations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Age Group</label>
                  <input
                    type="text"
                    placeholder="e.g. 5+ Years"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Course Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Months"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Class Time Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 30 Minutes"
                    value={classDuration}
                    onChange={(e) => setClassDuration(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the course..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Status</label>
                <div className="flex gap-2">
                  {(["active", "inactive"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize border transition-all ${
                        status === s
                          ? s === "active"
                            ? "border-green-400/60 bg-green-400/10 text-green-400"
                            : "border-gray-400/60 bg-gray-400/10 text-gray-300"
                          : "border-[var(--color-border)] text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Description from step 1 (read-only) */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Description (from Step 1)</label>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                  <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
                </div>
              </div>

              {/* Bullets */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Course Detail Bullets</label>
                <p className="text-gray-500 text-xs -mt-0.5">
                  Key points shown with the course details — add as many as you need.
                </p>
              </div>

              {bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0" />
                  <input
                    type="text"
                    placeholder={`Bullet point ${i + 1}...`}
                    value={b}
                    onChange={(e) => updateBullet(i, e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeBullet(i)}
                    title="Remove bullet"
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setBullets((prev) => [...prev, ""])}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[var(--color-border)] text-gray-400 hover:text-white hover:border-[var(--color-accent)]/50 text-sm font-semibold transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Bullet
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-border)] shrink-0 flex flex-col gap-3">
          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="flex items-center justify-between gap-3">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => { setStep(1); setError(""); }}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-gray-400 hover:text-white text-sm font-medium transition-colors disabled:opacity-40"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-gray-400 hover:text-white text-sm font-medium transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-bold transition-colors"
              >
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
              >
                {saving ? "Saving..." : course ? "Save Changes" : "Create Course"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
