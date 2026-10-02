import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { SiteContact } from "@/models/SiteContact";
import type { SiteContactInfo } from "@/lib/siteContact";

// Busted by the admin PUT handler so saved numbers show up site-wide
// immediately, without waiting for the cache to expire or a redeploy.
export const SITE_CONTACT_TAG = "site-contact";

// Throws rather than falling back, so a failed read is never cached — and so
// the caller can tell "not loaded yet" apart from a real value.
const loadSiteContact = unstable_cache(
  async (): Promise<SiteContactInfo> => {
    await connectDB();
    const doc = await SiteContact.findOne().lean<SiteContactInfo | null>();
    if (!doc?.phone || !doc?.whatsapp || !doc?.email) {
      throw new Error("Site contact info has not been created yet");
    }
    return { phone: doc.phone, whatsapp: doc.whatsapp, email: doc.email };
  },
  ["site-contact"],
  { tags: [SITE_CONTACT_TAG], revalidate: 3600 }
);

// Read on the server so the real numbers are already in the HTML on first
// paint. `null` means "couldn't load" — the provider then retries from the
// client and the UI shows placeholders until it resolves, rather than
// flashing a stale hardcoded number.
export async function getSiteContact(): Promise<SiteContactInfo | null> {
  try {
    return await loadSiteContact();
  } catch (error) {
    console.error("Failed to load site contact info", error);
    return null;
  }
}
