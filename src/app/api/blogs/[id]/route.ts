import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { requireAdmin, escapeRegex } from "@/lib/courses";
import { parseBlogForm, computeReadTime } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    await connectDB();
    const blog = await Blog.findById(id).lean();
    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Failed to fetch blog", error);
    return NextResponse.json({ message: "Failed to fetch blog" }, { status: 500 });
  }
}

// PUT /api/blogs/[id] — update a blog (admin only, multipart form data).
// The image is replaced only when a new file is sent; the slug stays stable.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    const parsed = await parseBlogForm(await req.formData());
    if (!parsed.ok)
      return NextResponse.json({ message: parsed.message }, { status: 400 });

    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    const duplicate = await Blog.findOne({
      _id: { $ne: id },
      title: new RegExp(`^${escapeRegex(parsed.data.title)}$`, "i"),
    });
    if (duplicate)
      return NextResponse.json({ message: "A blog with this heading already exists" }, { status: 409 });

    blog.title = parsed.data.title;
    blog.excerpt = parsed.data.excerpt;
    blog.category = parsed.data.category;
    blog.status = parsed.data.status;
    // Clear any legacy intro so the description reliably becomes the article
    // opening once a post is saved through the current editor.
    blog.intro = "";
    blog.set("sections", parsed.data.sections);
    blog.readTime = computeReadTime(parsed.data.excerpt, parsed.data.sections);
    if (parsed.imageDataUri) blog.image = parsed.imageDataUri;
    await blog.save();

    return NextResponse.json({ message: "Blog updated", blog });
  } catch (error) {
    console.error("Failed to update blog", error);
    return NextResponse.json({ message: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    await connectDB();
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Failed to delete blog", error);
    return NextResponse.json({ message: "Failed to delete blog" }, { status: 500 });
  }
}
