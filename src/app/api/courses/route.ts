import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { requireAdmin, parseCourseForm, generateUniqueSlug, escapeRegex } from "@/lib/courses";
import { parsePageParams, paginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

// GET /api/courses — list courses with their enrollment totals, newest first.
// Paginated when `page`/`pageSize` are given (the admin table); otherwise
// returns the full list — the public site's course list/enroll modal depend
// on getting every active course back in one call.
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const pageParams = parsePageParams(searchParams);
    const search = searchParams.get("search")?.trim() ?? "";

    const filter: Record<string, unknown> = {};
    if (search) filter.title = new RegExp(escapeRegex(search), "i");

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
      const courses = await Course.find(filter).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ courses: await withEnrollmentCounts(courses) });
    }

    const { page, pageSize, skip } = pageParams;
    const [courses, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      Course.countDocuments(filter),
    ]);

    return NextResponse.json({
      courses: await withEnrollmentCounts(courses),
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
      bullets: parsed.bullets,
      image: parsed.imageDataUri,
    });

    return NextResponse.json({ message: "Course created", course }, { status: 201 });
  } catch (error) {
    console.error("Failed to create course", error);
    return NextResponse.json({ message: "Failed to create course" }, { status: 500 });
  }
}
