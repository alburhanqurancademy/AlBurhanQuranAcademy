import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(session.id).select("name email role image");
    if (!user) return NextResponse.json({ user: session });

    return NextResponse.json({
      user: {
        id: session.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image ?? "",
      },
    });
  } catch {
    return NextResponse.json({ user: session });
  }
}
