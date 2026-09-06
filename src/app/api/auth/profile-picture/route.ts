import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.id,
      { image: dataUri },
      { new: true }
    );

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Profile picture updated", image: user.image });
  } catch (err) {
    console.error("Profile picture update error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
