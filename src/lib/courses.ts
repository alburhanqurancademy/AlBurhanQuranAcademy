import { getSession } from "@/lib/auth";
import { Course } from "@/models/Course";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function requireAdmin() {
  const session = await getSession();
  if (!session || !["admin", "superadmin"].includes(session.role)) return null;
  return session;
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(title: string) {
  const base = slugify(title) || "course";
  let slug = base;
  let n = 2;
  while (await Course.exists({ slug })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type CourseFormResult =
  | {
      ok: true;
      title: string;
      description: string;
      status: "active" | "inactive";
      ageGroup: string;
      duration: string;
      classDuration: string;
      bullets: string[];
      imageDataUri: string | null;
    }
  | { ok: false; message: string };

export async function parseCourseForm(formData: FormData): Promise<CourseFormResult> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "active").trim();
  const ageGroup = String(formData.get("ageGroup") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const classDuration = String(formData.get("classDuration") ?? "").trim();

  if (!title) return { ok: false, message: "Course name is required" };
  if (!description) return { ok: false, message: "Description is required" };
  if (!ageGroup) return { ok: false, message: "Age group is required" };
  if (!duration) return { ok: false, message: "Course duration is required" };
  if (!classDuration) return { ok: false, message: "Class time duration is required" };
  if (status !== "active" && status !== "inactive")
    return { ok: false, message: "Status must be active or inactive" };

  let bullets: string[] = [];
  try {
    const raw = JSON.parse(String(formData.get("bullets") ?? "[]"));
    if (!Array.isArray(raw)) throw new Error("not an array");
    bullets = raw.map((b) => String(b).trim()).filter(Boolean);
  } catch {
    return { ok: false, message: "Invalid course details data" };
  }

  let imageDataUri: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type))
      return { ok: false, message: "Only JPG, PNG, WEBP or GIF images are allowed" };
    const buffer = Buffer.from(await file.arrayBuffer());
    imageDataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  return { ok: true, title, description, status, ageGroup, duration, classDuration, bullets, imageDataUri };
}
