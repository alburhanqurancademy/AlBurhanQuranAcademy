import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { requireAdmin, parseCourseForm, generateUniqueSlug, escapeRegex } from "@/lib/courses";
import { parsePageParams, paginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

// Course images are stored as base64 data URIs, which can be over a megabyte
// each. The list never ships them: the query swaps a stored image for a flag
// (so it isn't even transferred from MongoDB) and the response links to
// /api/courses/[id]/image instead, which the browser can cache.
const STRIP_STORED_IMAGE = {
  $addFields: {
    hasStoredImage: { $regexMatch: { input: "$image", regex: /^data:/ } },
    image: { $cond: [{ $regexMatch: { input: "$image", regex: /^data:/ } }, "", "$image"] },
  },
};

function withImageUrl(c: any) {
  const { hasStoredImage, ...rest } = c;
  return {
    ...rest,
    image: hasStoredImage
      ? `/api/courses/${c._id}/image?v=${new Date(c.updatedAt).getTime()}`
      : c.image ?? "",
  };
}

// GET /api/courses — list courses, newest first.
// Paginated, with enrollment totals, when `page`/`pageSize` are given (the
// admin table). Otherwise it returns the full list without totals — the
// public site's course list/enroll modal depend on getting every course back
// in one call (`?status=active` narrows it to what visitors should see).
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const pageParams = parsePageParams(searchParams);
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (search) filter.title = new RegExp(escapeRegex(search), "i");
    if (status === "active" || status === "inactive") filter.status = status;

    async function withEnrollmentCounts(courseDocs: any[]) {
      const counts = await Enrollment.aggregate([{ $group: { _id: "$course", count: { $sum: 1 } } }]);
      const countByTitle = new Map(
        counts.map((c: { _id: string; count: number }) => [String(c._id).trim().toLowerCase(), c.count])
      );
      return courseDocs.map((c) => ({
        ...c,
        enrollmentCount: countByTitle.get(String(c.title).trim().toLowerCase()) ?? 0,
      }));
    }

    if (!pageParams) {
      const courses = await Course.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        STRIP_STORED_IMAGE,
      ]);
      return NextResponse.json({ courses: courses.map(withImageUrl) });
    }

    const { page, pageSize, skip } = pageParams;
    const [courses, total] = await Promise.all([
      Course.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: pageSize },
        STRIP_STORED_IMAGE,
      ]),
      Course.countDocuments(filter),
    ]);

    return NextResponse.json({
      courses: await withEnrollmentCounts(courses.map(withImageUrl)),
      ...paginationMeta(total, page, pageSize),
    });
  } catch (error) {
    console.error("Failed to fetch courses", error);
    return NextResponse.json({ message: "Failed to fetch courses" }, { status: 500 });
  }
}

// POST /api/courses — create a course (admin only, multipart form data)
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const parsed = await parseCourseForm(await req.formData());
    if (!parsed.ok)
      return NextResponse.json({ message: parsed.message }, { status: 400 });

    if (!parsed.imageDataUri)
      return NextResponse.json({ message: "Course image is required" }, { status: 400 });

    await connectDB();

    const duplicate = await Course.findOne({
      title: new RegExp(`^${escapeRegex(parsed.title)}$`, "i"),
    });
    if (duplicate)
      return NextResponse.json({ message: "A course with this name already exists" }, { status: 409 });

    const slug = await generateUniqueSlug(parsed.title);

    const course = await Course.create({
      title: parsed.title,
      slug,
      description: parsed.description,
      status: parsed.status,
      ageGroup: parsed.ageGroup,
      duration: parsed.duration,
      classDuration: parsed.classDuration,
      detailHeading: parsed.detailHeading,
      detailText: parsed.detailText,
      bullets: parsed.bullets,
      image: parsed.imageDataUri,
    });

    return NextResponse.json({ message: "Course created", course }, { status: 201 });
  } catch (error) {
    console.error("Failed to create course", error);
    return NextResponse.json({ message: "Failed to create course" }, { status: 500 });
  }
}
