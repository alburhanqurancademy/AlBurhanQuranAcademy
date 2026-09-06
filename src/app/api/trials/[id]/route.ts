import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { Trial } from "@/models/Trial";
import { requireAdmin } from "@/lib/courses";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const status = body.status;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    const trial = await Trial.findByIdAndUpdate(id, { status }, { new: true }).lean();

    if (!trial) {
      return NextResponse.json({ message: "Trial request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Trial request updated", trial });
  } catch (error) {
    console.error("Trial status update failed", error);
    return NextResponse.json({ message: "Failed to update trial request" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ message: "Trial request not found" }, { status: 404 });

    await connectDB();
    const trial = await Trial.findByIdAndDelete(id);
    if (!trial)
      return NextResponse.json({ message: "Trial request not found" }, { status: 404 });

    return NextResponse.json({ message: "Trial request deleted" });
  } catch (error) {
    console.error("Failed to delete trial request", error);
    return NextResponse.json({ message: "Failed to delete trial request" }, { status: 500 });
  }
}
