import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";
import { Trial } from "@/models/Trial";
import { parsePageParams, paginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

interface StudentRow {
  id: string;
  docId: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  type: "Enrollment" | "Trial";
  status: "pending" | "approved" | "rejected" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

// "Students" merges two separate collections (enrollments + trials) into one
// list. There is no single collection to run a Mongo skip/limit query against,
// so both collections are loaded in full and merged/filtered/sorted here, then
// sliced for the requested page — the client only ever receives that one page,
// which is what matters for a table this size (an academy admin panel, not a
// high-volume dataset).
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const pageParams = parsePageParams(searchParams);
    const page = pageParams?.page ?? 1;
    const pageSize = pageParams?.pageSize ?? 5;
    const status = searchParams.get("status")?.trim() ?? "all";
    const search = searchParams.get("search")?.trim().toLowerCase() ?? "";

    const [enrollments, trials] = await Promise.all([
      Enrollment.find({}).sort({ createdAt: -1 }).lean(),
      Trial.find({}).sort({ createdAt: -1 }).lean(),
    ]);

    let rows: StudentRow[] = [
      ...enrollments.map((e: any) => ({
        id: `enrollment-${e._id}`,
        docId: String(e._id),
        name: e.name,
        email: e.email,
        phone: e.phone,
        course: e.course,
        type: "Enrollment" as const,
        status: e.status as "pending" | "approved" | "rejected" | "completed",
        createdAt: e.createdAt,
      })),
      ...trials.map((t: any) => ({
        id: `trial-${t._id}`,
        docId: String(t._id),
        name: t.name,
        email: t.email,
        phone: t.phone,
        course: t.course || "—",
        type: "Trial" as const,
        status: t.status as "confirmed" | "pending" | "cancelled" | "completed",
        createdAt: t.createdAt,
      })),
    ];

    if (status !== "all") {
      rows = rows.filter((r) => {
        if (status === "pending") return r.status === "pending";
        if (status === "approved") return r.status === "approved" || r.status === "confirmed";
        if (status === "rejected") return r.status === "rejected" || r.status === "cancelled";
        if (status === "completed") return r.status === "completed";
        return true;
      });
    }

    if (search) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.email.toLowerCase().includes(search) ||
          r.course.toLowerCase().includes(search)
      );
    }

    rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = rows.length;
    const skip = (page - 1) * pageSize;
    const students = rows.slice(skip, skip + pageSize);

    return NextResponse.json({ students, ...paginationMeta(total, page, pageSize) });
  } catch (error) {
    console.error("Failed to fetch students", error);
    return NextResponse.json({ message: "Failed to fetch students" }, { status: 500 });
  }
}
