import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { posts as defaultPosts, getPost as getDefaultPost, type BlogPost } from "@/lib/blogData";

interface BlogDoc {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  category: string;
  intro?: string;
  sections?: {
    heading?: string;
    body: string;
    list?: string[];
    arabic?: string;
    arabicRef?: string;
    translation?: string;
  }[];
  readTime?: string;
  createdAt: Date;
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

  const sections = (doc.sections ?? []).map((s) => ({
    heading: s.heading || undefined,
    body: s.body,
    list: s.list && s.list.length > 0 ? s.list : undefined,
    arabic: s.arabic || undefined,
    arabicRef: s.arabicRef || undefined,
    translation: s.translation || undefined,
  }));

  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    image: doc.image || "",
    category: doc.category,
    readTime: doc.readTime || "1 min read",
    date: new Date(doc.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    sections: [...introSections, ...sections],
  };
}

// Published posts, newest first. Falls back to the built-in static articles
// when the blogs collection is empty (not seeded yet) or the DB is unreachable.
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    await connectDB();
    const total = await Blog.countDocuments();
    if (total === 0) return defaultPosts;

    const docs = await Blog.find({ status: "published" }).sort({ createdAt: -1 }).lean<BlogDoc[]>();
    return docs.map(mapDbPost);
  } catch (error) {
    console.error("Failed to fetch published blogs, using defaults", error);
    return defaultPosts;
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    await connectDB();
    const total = await Blog.countDocuments();
    if (total === 0) return getDefaultPost(slug);

    const doc = await Blog.findOne({ slug, status: "published" }).lean<BlogDoc | null>();
    return doc ? mapDbPost(doc) : undefined;
  } catch (error) {
    console.error("Failed to fetch blog by slug, using defaults", error);
    return getDefaultPost(slug);
  }
}
