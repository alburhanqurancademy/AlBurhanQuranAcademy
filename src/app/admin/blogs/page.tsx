"use client";

import { useEffect, useRef, useState } from "react";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import TableSkeleton from "@/components/admin/TableSkeleton";

interface BlogSection {
  heading?: string;
  body: string;
  list?: string[];
  arabic?: string;
  arabicRef?: string;
  translation?: string;
}

interface BlogRow {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  category: string;
  sections: BlogSection[];
  readTime: string;
  status: "draft" | "published";
  createdAt: string;
}

interface SectionForm {
  heading: string;
  body: string;
  bullets: string[];
  hadees: boolean;
  arabic: string;
  arabicRef: string;
  translation: string;
}

const CATEGORY_SUGGESTIONS = ["Spirituality", "Online Learning", "Faith & Guidance", "Islamic Knowledge"];

const statusColors: Record<string, string> = {
  published: "text-green-400 bg-green-400/10 border border-green-400/30",
  draft:     "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30",
};

const inputClass =
  "w-full bg-[var(--color-black)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)]/60";

const labelClass = "text-gray-400 text-xs font-semibold uppercase tracking-wider";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function emptySection(): SectionForm {
  return { heading: "", body: "", bullets: [], hadees: false, arabic: "", arabicRef: "", translation: "" };
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [listError, setListError] = useState("");
  const [modal, setModal] = useState<{ mode: "create" } | { mode: "edit"; blog: BlogRow } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BlogRow | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search.trim()) params.set("search", search.trim());
      if (categoryFilter) params.set("category", categoryFilter);

      const res = await fetch(`/api/blogs?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load blogs");
      setBlogs(data.blogs ?? []);
      setCategories(data.categories ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setListError("");
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever the page, page size, or filters change. Search is
  // debounced so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(loadBlogs, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, categoryFilter]);

  // Any filter/search change should jump back to page 1 rather than staying
  // on a page that may no longer exist for the new result set.
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete._id);
    try {
      const res = await fetch(`/api/blogs/${confirmDelete._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete blog");
      setConfirmDelete(null);
      await loadBlogs();
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Blogs</h2>
          <p className="text-gray-400 text-sm mt-1">Manage all blog posts</p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-bold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New Blog
        </button>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)]/60"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-gray-400 text-sm focus:outline-none"
        >
          <option value="">All Types</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {listError && (
        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{listError}</p>
      )}

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {loading ? (
          <TableSkeleton rows={pageSize} columns={3} />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Image</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    {total === 0 && !search && !categoryFilter ? "No blogs yet. Click “New Blog” to write one." : "No blogs match your filters."}
                  </td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-[var(--color-black)] border border-[var(--color-border)] flex items-center justify-center">
                        {b.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white font-medium max-w-xs truncate">{b.title}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-[var(--color-accent)]">{b.category}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">{formatDate(b.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal({ mode: "edit", blog: b })}
                          title="Edit blog"
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => setConfirmDelete(b)}
                          disabled={deletingId === b._id}
                          title="Delete blog"
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
        <BlogModal
          blog={modal.mode === "edit" ? modal.blog : undefined}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            loadBlogs();
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          title="Delete Blog?"
          message={`Delete "${confirmDelete.title}"? This cannot be undone.`}
          loading={deletingId === confirmDelete._id}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function BlogModal({ blog, onClose, onSaved }: { blog?: BlogRow; onClose: () => void; onSaved: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — blog card details
  const [title, setTitle] = useState(blog?.title ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [category, setCategory] = useState(blog?.category ?? "");
  const [status, setStatus] = useState<"draft" | "published">(blog?.status ?? "published");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(blog?.image ?? "");

  // Step 2 — article content
  const [sections, setSections] = useState<SectionForm[]>(
    blog?.sections?.length
      ? blog.sections.map((s) => ({
          heading: s.heading ?? "",
          body: s.body,
          bullets: s.list ?? [],
          hadees: Boolean(s.arabic || s.translation),
          arabic: s.arabic ?? "",
          arabicRef: s.arabicRef ?? "",
          translation: s.translation ?? "",
        }))
      : [emptySection()]
  );

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

  const updateSection = (i: number, patch: Partial<SectionForm>) =>
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const removeSection = (i: number) =>
    setSections((prev) => prev.filter((_, idx) => idx !== i));

  const moveSection = (i: number, dir: -1 | 1) =>
    setSections((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const validateStep1 = () => {
    if (!category.trim()) return "Blog type is required.";
    if (!blog && !imageFile) return "Blog image is required.";
    if (!title.trim()) return "Heading is required.";
    if (!excerpt.trim()) return "Short description is required.";
    return null;
  };

  const validateStep2 = () => {
    for (let i = 0; i < sections.length; i++) {
      if (!sections[i].body.trim()) return `Section ${i + 1} needs a description.`;
    }
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
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("excerpt", excerpt.trim());
      formData.append("category", category.trim());
      formData.append("status", status);
      formData.append(
        "sections",
        JSON.stringify(
          sections.map((s) => ({
            heading: s.heading.trim(),
            body: s.body.trim(),
            list: s.bullets.map((b) => b.trim()).filter(Boolean),
            arabic: s.hadees ? s.arabic.trim() : "",
            arabicRef: s.hadees ? s.arabicRef.trim() : "",
            translation: s.hadees ? s.translation.trim() : "",
          }))
        )
      );
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(blog ? `/api/blogs/${blog._id}` : "/api/blogs", {
        method: blog ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save blog");

      onSaved();
    } catch (err2) {
      setError(err2 instanceof Error ? err2.message : "Failed to save blog.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[var(--color-black-soft)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-black text-lg">{blog ? "Edit Blog" : "New Blog"}</h2>
              <p className="text-gray-400 text-xs mt-0.5">
                {step === 1 ? "Step 1 of 2 — Blog Card Details" : "Step 2 of 2 — Article Content"}
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
                    {s === 1 ? "Card Details" : "Article Content"}
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
              {/* Blog type */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Blog Type</label>
                <input
                  type="text"
                  list="blog-categories"
                  placeholder="e.g. Online Learning"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                />
                <datalist id="blog-categories">
                  {CATEGORY_SUGGESTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              {/* Image */}
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Blog Image</label>
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[var(--color-black)] border border-[var(--color-border)] flex items-center justify-center">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Blog" className="w-full h-full object-cover" />
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

              {/* Heading */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Heading</label>
                <input
                  type="text"
                  placeholder="Blog title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Description</label>
                <textarea
                  rows={4}
                  placeholder="Shown on the blog card and as the opening paragraph of the article..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className={`${inputClass} resize-y`}
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Status</label>
                <div className="flex gap-2">
                  {(["published", "draft"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize border transition-all ${
                        status === s
                          ? s === "published"
                            ? "border-green-400/60 bg-green-400/10 text-green-400"
                            : "border-yellow-400/60 bg-yellow-400/10 text-yellow-400"
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
            <div className="flex flex-col gap-5">
              {/* Sections */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Article Sections</label>
                <p className="text-gray-500 text-xs -mt-0.5">
                  Each section has a heading and description, with optional bullets and an optional Ayah / Hadees block.
                </p>
              </div>

              {sections.map((s, i) => (
                <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Section {i + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveSection(i, -1)}
                        disabled={i === 0}
                        title="Move up"
                        className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(i, 1)}
                        disabled={i === sections.length - 1}
                        title="Move down"
                        className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSection(i)}
                        title="Remove section"
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Section heading (optional)"
                    value={s.heading}
                    onChange={(e) => updateSection(i, { heading: e.target.value })}
                    className={inputClass}
                  />
                  <textarea
                    rows={3}
                    placeholder="Section description..."
                    value={s.body}
                    onChange={(e) => updateSection(i, { body: e.target.value })}
                    className={`${inputClass} resize-y`}
                  />

                  {/* Bullets */}
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Bullets (optional)</span>
                    {s.bullets.map((bullet, j) => (
                      <div key={j} className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0" />
                        <input
                          type="text"
                          placeholder={`Bullet ${j + 1}...`}
                          value={bullet}
                          onChange={(e) =>
                            updateSection(i, { bullets: s.bullets.map((b, idx) => (idx === j ? e.target.value : b)) })
                          }
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => updateSection(i, { bullets: s.bullets.filter((_, idx) => idx !== j) })}
                          title="Remove bullet"
                          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => updateSection(i, { bullets: [...s.bullets, ""] })}
                      className="flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-lg border border-dashed border-[var(--color-border)] text-gray-400 hover:text-white hover:border-[var(--color-accent)]/50 text-xs font-semibold transition-all"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Add Bullet
                    </button>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                    <input
                      type="checkbox"
                      checked={s.hadees}
                      onChange={(e) => updateSection(i, { hadees: e.target.checked })}
                      className="w-4 h-4 accent-[var(--color-accent)]"
                    />
                    <span className="text-gray-300 text-xs font-semibold">Include Ayah / Hadees (optional)</span>
                  </label>

                  {s.hadees && (
                    <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-sky)]/30 bg-[var(--color-sky)]/5 p-3.5">
                      <textarea
                        rows={2}
                        dir="rtl"
                        placeholder="النص العربي..."
                        value={s.arabic}
                        onChange={(e) => updateSection(i, { arabic: e.target.value })}
                        className={`${inputClass} resize-y text-right text-base`}
                      />
                      <input
                        type="text"
                        dir="rtl"
                        placeholder="المرجع — e.g. الرعد: 28"
                        value={s.arabicRef}
                        onChange={(e) => updateSection(i, { arabicRef: e.target.value })}
                        className={`${inputClass} text-right`}
                      />
                      <textarea
                        rows={2}
                        placeholder="English translation..."
                        value={s.translation}
                        onChange={(e) => updateSection(i, { translation: e.target.value })}
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => setSections((prev) => [...prev, emptySection()])}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[var(--color-border)] text-gray-400 hover:text-white hover:border-[var(--color-accent)]/50 text-sm font-semibold transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Section
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
                {saving ? "Saving..." : blog ? "Save Changes" : "Create Blog"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
