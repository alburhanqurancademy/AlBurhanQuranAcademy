import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = (await req.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    const current = String(currentPassword || "").trim();
    const next = String(newPassword || "").trim();

    if (!current || !next)
      return NextResponse.json({ message: "Current and new password are required" }, { status: 400 });

    if (next.length < 8)
      return NextResponse.json({ message: "New password must be at least 8 characters" }, { status: 400 });

    if (next === current)
      return NextResponse.json({ message: "New password must be different from the current password" }, { status: 400 });

    await connectDB();

    const user = await User.findById(session.id);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    let isMatch = false;
    const passwordIsHashed = /^\$2[aby]\$/.test(user.password);
    if (passwordIsHashed) {
      isMatch = await bcrypt.compare(current, user.password);
    }

    if (!isMatch)
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 401 });

    user.password = next;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
