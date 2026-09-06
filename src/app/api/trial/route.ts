import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { validateTrialInput } from "@/lib/trial";
import { Trial } from "@/models/Trial";
import { sendMail } from "@/lib/mail";
import { buildTrialAdminEmail, buildAutoReplyEmail } from "@/lib/notificationEmails";

// POST /api/trial — book a trial class
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validation = validateTrialInput(body);

    if (!validation.ok) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    await connectDB();

    const existing = await Trial.findOne({ email: validation.data.email }).lean();
    if (existing) {
      return NextResponse.json({ message: "A trial request already exists for this email" }, { status: 409 });
    }

    const trial = await Trial.create({
      ...validation.data,
      status: "pending",
    });

    // Notify the academy and confirm to the applicant. Email failures are
    // logged but never block the submission — the trial request is already saved.
    const adminEmail = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
    const adminMail = buildTrialAdminEmail(validation.data);
    const replyMail = buildAutoReplyEmail({
      name: validation.data.name,
      type: "trial",
      course: validation.data.course,
    });

    const emailResults = await Promise.allSettled([
      ...(adminEmail
        ? [sendMail({ to: adminEmail, subject: adminMail.subject, html: adminMail.html })]
        : []),
      sendMail({ to: validation.data.email, subject: replyMail.subject, html: replyMail.html }),
    ]);
    emailResults.forEach((r) => {
      if (r.status === "rejected") console.error("Trial email failed", r.reason);
      else if (!r.value.ok) console.warn("Trial email not sent:", r.value.status);
    });

    return NextResponse.json({ message: "Trial class request submitted", trial }, { status: 201 });
  } catch (error) {
    console.error("Trial booking failed", error);
    return NextResponse.json({ message: "Failed to submit trial request" }, { status: 500 });
  }
}
