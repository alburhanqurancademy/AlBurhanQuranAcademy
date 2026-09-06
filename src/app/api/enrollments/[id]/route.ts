import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";
import { requireAdmin } from "@/lib/courses";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "approved", "rejected", "completed"] as const;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });

    await connectDB();
    const enrollment = await Enrollment.findById(id).lean();
    if (!enrollment)
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error("Failed to fetch enrollment", error);
    return NextResponse.json({ message: "Failed to fetch enrollment" }, { status: 500 });
  }
}

// PATCH /api/enrollments/[id] — update the status (admin only)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });

    const body = (await req.json().catch(() => ({}))) as { status?: string };
    const status = String(body.status ?? "").trim();
    if (!STATUSES.includes(status as (typeof STATUSES)[number]))
      return NextResponse.json({ message: "Status must be pending, approved, rejected or completed" }, { status: 400 });

    await connectDB();
    const enrollment = await Enrollment.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!enrollment)
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });

    return NextResponse.json({ message: "Status updated", enrollment });
  } catch (error) {
    console.error("Failed to update enrollment", error);
    return NextResponse.json({ message: "Failed to update enrollment" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });

    await connectDB();
    const enrollment = await Enrollment.findByIdAndDelete(id);
    if (!enrollment)
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });

    return NextResponse.json({ message: "Enrollment deleted" });
  } catch (error) {
    console.error("Failed to delete enrollment", error);
    return NextResponse.json({ message: "Failed to delete enrollment" }, { status: 500 });
  }
}
