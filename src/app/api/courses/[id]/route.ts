import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";
import { requireAdmin, parseCourseForm, escapeRegex } from "@/lib/courses";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ message: "Course not found" }, { status: 404 });

    await connectDB();
    const course = await Course.findById(id).lean();
    if (!course)
      return NextResponse.json({ message: "Course not found" }, { status: 404 });

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Failed to fetch course", error);
    return NextResponse.json({ message: "Failed to fetch course" }, { status: 500 });
  }
}

// PUT /api/courses/[id] — update a course (admin only, multipart form data).
// The image is replaced only when a new file is sent; the slug stays stable.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ message: "Course not found" }, { status: 404 });

    const parsed = await parseCourseForm(await req.formData());
    if (!parsed.ok)
      return NextResponse.json({ message: parsed.message }, { status: 400 });

    await connectDB();

    const course = await Course.findById(id);
    if (!course)
      return NextResponse.json({ message: "Course not found" }, { status: 404 });

    const duplicate = await Course.findOne({
      _id: { $ne: id },
      title: new RegExp(`^${escapeRegex(parsed.title)}$`, "i"),
    });
    if (duplicate)
      return NextResponse.json({ message: "A course with this name already exists" }, { status: 409 });

    course.title = parsed.title;
    course.description = parsed.description;
    course.status = parsed.status;
    course.ageGroup = parsed.ageGroup;
    course.duration = parsed.duration;
    course.classDuration = parsed.classDuration;
    course.set("bullets", parsed.bullets);
    if (parsed.imageDataUri) course.image = parsed.imageDataUri;
    await course.save();

    return NextResponse.json({ message: "Course updated", course });
  } catch (error) {
    console.error("Failed to update course", error);
    return NextResponse.json({ message: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ message: "Course not found" }, { status: 404 });

    await connectDB();
    const course = await Course.findByIdAndDelete(id);
    if (!course)
      return NextResponse.json({ message: "Course not found" }, { status: 404 });

    return NextResponse.json({ message: "Course deleted" });
  } catch (error) {
    console.error("Failed to delete course", error);
    return NextResponse.json({ message: "Failed to delete course" }, { status: 500 });
  }
}
