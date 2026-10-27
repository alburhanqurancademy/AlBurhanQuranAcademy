import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { User } from "@/models/User";
import { imageResponse } from "@/lib/imageStore";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// GET /api/auth/profile-picture — serves the signed-in user's own picture as a
// real image file. Private cache only: it's tied to the session. Callers add
// `?v=<updatedAt>` so a new upload gets a fresh URL.
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return new NextResponse(null, { status: 401 });

    await connectDB();
    const user = await User.findById(session.id).select("+imageFile image");
    return imageResponse(req, user, "private, max-age=31536000, immutable");
  } catch (err) {
    console.error("Profile picture fetch error:", err);
    return new NextResponse(null, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File))
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });

    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ message: "Only JPG, PNG, WEBP or GIF images are allowed" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    await connectDB();

    // `$set` + `$unset` also clears any legacy base64 copy of the picture.
    const user = await User.findByIdAndUpdate(
      session.id,
      { $set: { imageFile: { data: buffer, contentType: file.type } }, $unset: { image: "" } },
      { new: true }
    ).select("updatedAt");

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({
      message: "Profile picture updated",
      image: `/api/auth/profile-picture?v=${new Date(user.updatedAt).getTime()}`,
    });
  } catch (err) {
    console.error("Profile picture update error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
