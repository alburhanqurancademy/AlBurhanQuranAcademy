import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { imageResponse } from "@/lib/imageStore";

export const dynamic = "force-dynamic";

// GET /api/blogs/[id]/image — serves a blog's uploaded image (stored as binary
// on the blog document) as a real image file. Pages link here with
// `?v=<updatedAt>`, so a replaced image gets a new URL and the long cache is safe.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return new NextResponse(null, { status: 404 });

    await connectDB();
    const blog = await Blog.findById(id).select("+imageFile image");
    return imageResponse(req, blog);
  } catch (error) {
    console.error("Failed to serve blog image", error);
    return new NextResponse(null, { status: 500 });
  }
}
