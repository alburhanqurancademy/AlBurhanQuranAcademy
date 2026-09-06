import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { Trial } from "@/models/Trial";
import { escapeRegex } from "@/lib/courses";
import { parsePageParams, paginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

// GET /api/trials — list trial requests, newest first. Paginated when
// `page`/`pageSize` are given (the admin table); otherwise returns the full list.
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const pageParams = parsePageParams(searchParams);
    const status = searchParams.get("status")?.trim() ?? "";
    const search = searchParams.get("search")?.trim() ?? "";

    const filter: Record<string, unknown> = {};
    if (status && status !== "all") filter.status = status;
    if (search) {
      const re = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: re }, { course: re }];
    }

    if (!pageParams) {
      const trials = await Trial.find(filter).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ trials });
    }

    const { page, pageSize, skip } = pageParams;
    const [trials, total] = await Promise.all([
      Trial.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      Trial.countDocuments(filter),
    ]);

    return NextResponse.json({ trials, ...paginationMeta(total, page, pageSize) });
  } catch (error) {
    console.error("Failed to fetch trials", error);
    return NextResponse.json({ message: "Failed to fetch trials" }, { status: 500 });
  }
}
