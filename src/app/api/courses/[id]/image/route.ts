import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";
import { imageResponse } from "@/lib/imageStore";

export const dynamic = "force-dynamic";

// GET /api/courses/[id]/image — serves a course's uploaded image (stored as
// binary on the course document) as a real image file. The course list links
// here instead of embedding the image, so the list stays tiny and the browser
// can cache each image. The list adds `?v=<updatedAt>` to the URL, so a
// replaced image gets a new URL and the long cache is safe.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return new NextResponse(null, { status: 404 });

    await connectDB();
    const course = await Course.findById(id).select("+imageFile image");
    return imageResponse(req, course);
  } catch (error) {
    console.error("Failed to serve course image", error);
    return new NextResponse(null, { status: 500 });
  }
}
