import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "").trim();

    if (!normalizedName || !normalizedEmail || !normalizedPassword)
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });

    if (normalizedPassword.length < 6)
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });

    // Only admins can create admin/superadmin accounts
    const requestedRole = role ?? "user";
    if (requestedRole !== "user") {
      const token = req.cookies.get("token")?.value;
      if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      try {
        const payload = await verifyToken(token);
        if (payload.role !== "admin" && payload.role !== "superadmin")
          return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }

    await connectDB();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing)
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });

    await User.create({ name: normalizedName, email: normalizedEmail, password: normalizedPassword, role: requestedRole });

    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
