import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";

export const dynamic = "force-dynamic";

// GET /api/courses/[id]/image — serves a course's uploaded image as a real
// image file. Images are stored as base64 data URIs on the course document;
// the course list links here instead of embedding them, so the list stays tiny
// and the browser can cache each image. The list adds `?v=<updatedAt>` to the
// URL, so a replaced image gets a new URL and the long cache is safe.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return new NextResponse(null, { status: 404 });

    await connectDB();
    const course = await Course.findById(id).select("image").lean<{ image?: string } | null>();
    const image = course?.image;
    if (!image) return new NextResponse(null, { status: 404 });

    const match = /^data:([^;]+);base64,([\s\S]*)$/.exec(image);
    if (!match) {
      // A plain path or URL (e.g. "/Quran Gateway.png") — just send the browser there.
      return NextResponse.redirect(new URL(image, _req.url));
    }

    return new NextResponse(Buffer.from(match[2], "base64"), {
      headers: {
        "Content-Type": match[1],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Failed to serve course image", error);
    return new NextResponse(null, { status: 500 });
  }
}
