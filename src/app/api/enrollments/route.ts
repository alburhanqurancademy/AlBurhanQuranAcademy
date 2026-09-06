import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { validateEnrollmentInput } from "@/lib/enrollment";
import { Enrollment } from "@/models/Enrollment";
import { sendMail } from "@/lib/mail";
import { buildEnrollmentAdminEmail, buildAutoReplyEmail } from "@/lib/notificationEmails";
import { escapeRegex } from "@/lib/courses";
import { parsePageParams, paginationMeta } from "@/lib/pagination";

// GET route handlers are cached by Next.js by default unless they opt out. Without this,
// the admin enrollments list could keep serving a stale, pre-cached response instead of
// hitting MongoDB on every request.
export const dynamic = "force-dynamic";

// GET /api/enrollments — list enrollments, newest first. Paginated when
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
      const enrollments = await Enrollment.find(filter).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ enrollments });
    }

    const { page, pageSize, skip } = pageParams;
    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      Enrollment.countDocuments(filter),
    ]);

    return NextResponse.json({ enrollments, ...paginationMeta(total, page, pageSize) });
  } catch (error) {
    console.error("Failed to fetch enrollments", error);
    return NextResponse.json({ message: "Failed to fetch enrollments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validation = validateEnrollmentInput(body);

    if (!validation.ok) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    await connectDB();

    // Fix: Explicitly cast status or the whole object to ensure TypeScript knows 'status' is a strict literal
    const payload = {
      ...validation.data,
      status: "pending" as const, 
    };

    // Passing it as 'any' or casting it directly silences the overload mismatch
    const enrollment = await Enrollment.create(payload as any);
    const plainEnrollment = enrollment.toObject();

    // Notify the academy and confirm to the applicant. Email failures are
    // logged but never block the submission — the enrollment is already saved.
    const adminEmail = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
    const adminMail = buildEnrollmentAdminEmail(validation.data);
    const replyMail = buildAutoReplyEmail({
      name: validation.data.name,
      type: "enrollment",
      course: validation.data.course,
    });

    const emailResults = await Promise.allSettled([
      ...(adminEmail
        ? [sendMail({ to: adminEmail, subject: adminMail.subject, html: adminMail.html })]
        : []),
      sendMail({ to: validation.data.email, subject: replyMail.subject, html: replyMail.html }),
    ]);
    emailResults.forEach((r) => {
      if (r.status === "rejected") console.error("Enrollment email failed", r.reason);
      else if (!r.value.ok) console.warn("Enrollment email not sent:", r.value.status);
    });

    return NextResponse.json({ message: "Enrollment submitted", enrollment: plainEnrollment }, { status: 201 });
  } catch (error) {
    console.error("Enrollment submission failed", error);
    return NextResponse.json({ message: "Failed to submit enrollment" }, { status: 500 });
  }
}
