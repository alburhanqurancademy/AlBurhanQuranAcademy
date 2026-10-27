import { Blog } from "@/models/Blog";
import { slugify, ALLOWED_IMAGE_TYPES } from "@/lib/courses";
import { validateImageBytes } from "@/lib/imageRules";

export interface BlogHadeesInput {
  arabic: string;
  arabicRef: string;
  translation: string;
  note: string;
}

export interface BlogSectionInput {
  heading?: string;
  body: string;
  list?: string[];
  hadees?: BlogHadeesInput[];
}

export interface BlogFormData {
  title: string;
  excerpt: string;
  category: string;
  writer: string;
  status: "draft" | "published";
  sections: BlogSectionInput[];
}

export async function generateUniqueBlogSlug(title: string) {
  const base = slugify(title) || "blog";
  let slug = base;
  let n = 2;
  while (await Blog.exists({ slug })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export function computeReadTime(description: string, sections: BlogSectionInput[]) {
  const text = [
    description,
    ...sections.flatMap((s) => [
      s.heading ?? "",
      s.body,
      ...(s.list ?? []),
      ...(s.hadees ?? []).flatMap((h) => [h.translation, h.note]),
    ]),
  ].join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export type BlogFormResult =
  | { ok: true; data: BlogFormData; imageDataUri: string | null }
  | { ok: false; message: string };

export async function parseBlogForm(formData: FormData): Promise<BlogFormResult> {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const status = String(formData.get("status") ?? "published").trim();
  const writer = String(formData.get("writer") ?? "").trim();

  if (!title) return { ok: false, message: "Blog heading is required" };
  if (!excerpt) return { ok: false, message: "Description is required" };
  if (!category) return { ok: false, message: "Blog type is required" };
  if (status !== "draft" && status !== "published")
    return { ok: false, message: "Status must be draft or published" };

  let rawSections: unknown;
  try {
    rawSections = JSON.parse(String(formData.get("sections") ?? "[]"));
  } catch {
    return { ok: false, message: "Invalid sections data" };
  }
  if (!Array.isArray(rawSections))
    return { ok: false, message: "Invalid sections data" };

  const sections: BlogSectionInput[] = [];
  for (const raw of rawSections as Record<string, unknown>[]) {
    const body = String(raw?.body ?? "").trim();
    if (!body) return { ok: false, message: "Every section needs a description" };

    const list = Array.isArray(raw?.list)
      ? (raw.list as unknown[]).map((i) => String(i).trim()).filter(Boolean)
      : [];

    // Drop empty blocks so a stray "Add Ayah / Hadees" click doesn't render a hollow card.
    const hadees = Array.isArray(raw?.hadees)
      ? (raw.hadees as Record<string, unknown>[])
          .map((h) => ({
            arabic: String(h?.arabic ?? "").trim(),
            arabicRef: String(h?.arabicRef ?? "").trim(),
            translation: String(h?.translation ?? "").trim(),
            note: String(h?.note ?? "").trim(),
          }))
          .filter((h) => h.arabic || h.translation || h.note)
      : [];

    sections.push({
      heading: String(raw?.heading ?? "").trim(),
      body,
      list: list.length > 0 ? list : undefined,
      hadees: hadees.length > 0 ? hadees : undefined,
    });
  }

  let imageDataUri: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type))
      return { ok: false, message: "Only JPG, PNG, WEBP or GIF images are allowed" };
    const buffer = Buffer.from(await file.arrayBuffer());
    const imageError = validateImageBytes(buffer);
    if (imageError) return { ok: false, message: imageError };
    imageDataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  return { ok: true, data: { title, excerpt, category, writer, status, sections }, imageDataUri };
}
