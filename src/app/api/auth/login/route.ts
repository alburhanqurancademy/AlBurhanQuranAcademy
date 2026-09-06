import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { signToken } from "@/lib/auth";
import { User } from "@/models/User";

const COOKIE_MAX_AGE = Number(process.env.COOKIE_MAX_AGE) || 60 * 60 * 24 * 30;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string };
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "").trim();

    if (!normalizedEmail || !normalizedPassword)
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user)
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });

    let isMatch = false;
    const passwordIsHashed = /^\$2[aby]\$/.test(user.password);
    if (passwordIsHashed) {
      isMatch = await bcrypt.compare(normalizedPassword, user.password);
    } 
    
    if (!isMatch)
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });

    const token = await signToken({ id: user._id.toString(), email: user.email, role: user.role });

    const res = NextResponse.json({ message: "Login successful", user: { name: user.name, email: user.email, role: user.role } });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
