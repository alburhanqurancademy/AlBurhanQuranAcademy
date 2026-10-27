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
    const user = await User.findById(session.id).select("name email role image updatedAt").lean();
    if (!user) return NextResponse.json({ user: session });

    // The picture is never sent inline: it is linked to /api/auth/profile-picture
    // so the browser can cache it. `exists` checks for the stored bytes without
    // reading them.
    const legacy = user.image ?? "";
    const hasPicture =
      legacy.startsWith("data:") || Boolean(await User.exists({ _id: session.id, "imageFile.contentType": { $exists: true } }));
    const image = hasPicture
      ? `/api/auth/profile-picture?v=${new Date(user.updatedAt as Date).getTime()}`
      : legacy;

    return NextResponse.json({
      user: {
        id: session.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image,
      },
    });
  } catch {
    return NextResponse.json({ user: session });
  }
}
