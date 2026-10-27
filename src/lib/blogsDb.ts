import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { IMAGE_LIST_STAGES, withImageUrl } from "@/lib/imageStore";

export interface BlogHadees {
  arabic?: string;
  arabicRef?: string;
  translation?: string;
  note?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  writer?: string;
  readTime: string;
  date: string;
  sections: {
    heading?: string;
    body: string;
    list?: string[];
    hadees?: BlogHadees[];
  }[];
}

interface BlogDoc {
  _id: unknown;
  updatedAt?: Date;
  // Set by IMAGE_LIST_STAGES: the document has an uploaded image to link to.
  hasStoredImage?: boolean;
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  category: string;
  intro?: string;
  writer?: string;
  sections?: {
    heading?: string;
    body: string;
    list?: string[];
    hadees?: BlogHadees[];
    // Legacy single-block shape, folded into `hadees` by mapDbPost.
    arabic?: string;
    arabicRef?: string;
    translation?: string;
  }[];
  readTime?: string;
  createdAt: Date;
}

// A section's Ayah/Hadees blocks: the `hadees` list, or — for posts saved before
// multiple blocks existed — the single legacy arabic/arabicRef/translation block.
function normalizeHadees(s: NonNullable<BlogDoc["sections"]>[number]): BlogHadees[] {
  if (s.hadees && s.hadees.length > 0) return s.hadees;
  if (s.arabic || s.translation) {
    return [{ arabic: s.arabic, arabicRef: s.arabicRef, translation: s.translation }];
  }
  return [];
}

// Maps a DB blog into the BlogPost shape the public pages render. The blog's
// description (excerpt) doubles as the article's opening paragraph(s); legacy
// seeded posts that still carry a separate `intro` keep using it instead.
function mapDbPost(doc: BlogDoc): BlogPost {
  const opening = String(doc.intro || "").trim() || doc.excerpt;
  const introSections = opening
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((body) => ({ body }));

  const sections = (doc.sections ?? []).map((s) => {
    const hadees = normalizeHadees(s);
    return {
      heading: s.heading || undefined,
      body: s.body,
      list: s.list && s.list.length > 0 ? s.list : undefined,
      hadees: hadees.length > 0 ? hadees : undefined,
    };
  });

  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    image: withImageUrl(doc, "/api/blogs").image,
    category: doc.category,
    writer: doc.writer || undefined,
    readTime: doc.readTime || "1 min read",
    date: new Date(doc.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    sections: [...introSections, ...sections],
  };
}

// Published posts, newest first. No hardcoded fallback — an empty or
// unreachable database yields an empty list.
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    await connectDB();
    const docs = await Blog.aggregate<BlogDoc>([
      { $match: { status: "published" } },
      { $sort: { createdAt: -1 } },
      ...IMAGE_LIST_STAGES,
    ]);
    return docs.map(mapDbPost);
  } catch (error) {
    console.error("Failed to fetch published blogs", error);
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    await connectDB();
    const [doc] = await Blog.aggregate<BlogDoc>([
      { $match: { slug, status: "published" } },
      { $limit: 1 },
      ...IMAGE_LIST_STAGES,
    ]);
    return doc ? mapDbPost(doc) : undefined;
  } catch (error) {
    console.error("Failed to fetch blog by slug", error);
    return undefined;
  }
}
