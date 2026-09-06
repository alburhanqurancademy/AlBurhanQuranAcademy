import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";
import { buildContactEmailHtml, sendMail } from "@/lib/mail";

// GET /api/contacts — list all contacts
export async function GET(req: NextRequest) {
  // TODO: implement fetch all contacts
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

// POST /api/contacts — create contact message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, course, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Name, email, and message are required" }, { status: 400 });
    }

    await connectDB();

    const contact = await Contact.create({
      name,
      email,
      subject: course || "Contact request",
      message,
    });

    const adminEmail = process.env.ADMIN_EMAIL || "admin@alburhanquranacademy.org";
    const mailResult = await sendMail({
      to: adminEmail,
      subject: `New contact request from ${name}`,
      html: buildContactEmailHtml({
        name,
        email,
        phone,
        course,
        message,
      }),
    });

    return NextResponse.json({
      message: "Contact request received",
      contact,
      mail: mailResult,
    }, { status: 201 });
  } catch (error) {
    console.error("Contact submission failed", error);
    return NextResponse.json({ message: "Failed to submit contact request" }, { status: 500 });
  }
}
