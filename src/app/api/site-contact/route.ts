import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteContact } from "@/models/SiteContact";
import { requireAdmin } from "@/lib/courses";
import { DEFAULT_SITE_CONTACT, PHONE_PATTERN, EMAIL_PATTERN } from "@/lib/siteContact";

export const dynamic = "force-dynamic";

// The site contact info is a singleton document, created from the frontend
// defaults the first time it is requested.
async function getOrCreateContact() {
  let contact = await SiteContact.findOne();
  if (!contact) contact = await SiteContact.create(DEFAULT_SITE_CONTACT);
  return contact;
}

export async function GET() {
  try {
    await connectDB();
    const contact = await getOrCreateContact();
    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Failed to fetch site contact info", error);
    return NextResponse.json({ message: "Failed to fetch contact info" }, { status: 500 });
  }
}

// PUT /api/site-contact — update contact details (admin only, partial updates allowed)
export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => ({}))) as {
      phone?: string;
      whatsapp?: string;
      email?: string;
    };

    const updates: Record<string, string> = {};

    if (body.phone !== undefined) {
      const phone = String(body.phone).trim();
      if (!PHONE_PATTERN.test(phone))
        return NextResponse.json({ message: "Please enter a valid phone number" }, { status: 400 });
      updates.phone = phone;
    }

    if (body.whatsapp !== undefined) {
      const whatsapp = String(body.whatsapp).trim();
      if (!PHONE_PATTERN.test(whatsapp))
        return NextResponse.json({ message: "Please enter a valid WhatsApp number" }, { status: 400 });
      updates.whatsapp = whatsapp;
    }

    if (body.email !== undefined) {
      const email = String(body.email).trim().toLowerCase();
      if (!EMAIL_PATTERN.test(email))
        return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 });
      updates.email = email;
    }

    if (Object.keys(updates).length === 0)
      return NextResponse.json({ message: "Nothing to update" }, { status: 400 });

    await connectDB();

    const contact = await getOrCreateContact();
    Object.assign(contact, updates);
    await contact.save();

    return NextResponse.json({ message: "Contact info updated", contact });
  } catch (error) {
    console.error("Failed to update site contact info", error);
    return NextResponse.json({ message: "Failed to update contact info" }, { status: 500 });
  }
}
