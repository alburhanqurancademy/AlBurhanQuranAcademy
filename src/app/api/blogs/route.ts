import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { requireAdmin, escapeRegex } from "@/lib/courses";
import { parseBlogForm, generateUniqueBlogSlug, computeReadTime } from "@/lib/blogs";
import { parsePageParams, paginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

// GET /api/blogs — list blogs, newest first. Paginated when `page`/`pageSize`
// are given (the admin table); otherwise returns the full list unfiltered,
// for backward compatibility with any future non-paginated consumer.
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const pageParams = parsePageParams(searchParams);
    const search = searchParams.get("search")?.trim() ?? "";
    const category = searchParams.get("category")?.trim() ?? "";

    const filter: Record<string, unknown> = {};
    if (search) filter.title = new RegExp(escapeRegex(search), "i");
    if (category) filter.category = category;

    if (!pageParams) {
      const blogs = await Blog.find(filter).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ blogs });
    }

    const { page, pageSize, skip } = pageParams;
    const [blogs, total, categories] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      Blog.countDocuments(filter),
      Blog.distinct("category"),
    ]);

    return NextResponse.json({ blogs, categories, ...paginationMeta(total, page, pageSize) });
  } catch (error) {
    console.error("Failed to fetch blogs", error);
    return NextResponse.json({ message: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST /api/blogs — create a blog (admin only, multipart form data)
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const parsed = await parseBlogForm(await req.formData());
    if (!parsed.ok)
      return NextResponse.json({ message: parsed.message }, { status: 400 });

    if (!parsed.imageDataUri)
      return NextResponse.json({ message: "Blog image is required" }, { status: 400 });

    await connectDB();

    const duplicate = await Blog.findOne({
      title: new RegExp(`^${escapeRegex(parsed.data.title)}$`, "i"),
    });
    if (duplicate)
      return NextResponse.json({ message: "A blog with this heading already exists" }, { status: 409 });

    const slug = await generateUniqueBlogSlug(parsed.data.title);

    const blog = await Blog.create({
      ...parsed.data,
      slug,
      image: parsed.imageDataUri,
      readTime: computeReadTime(parsed.data.excerpt, parsed.data.sections),
    });

    return NextResponse.json({ message: "Blog created", blog }, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog", error);
    return NextResponse.json({ message: "Failed to create blog" }, { status: 500 });
  }
}
