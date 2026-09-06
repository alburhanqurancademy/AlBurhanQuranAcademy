"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SITE_CONTACT, type SiteContactInfo } from "@/lib/siteContact";

// Returns the site contact details managed from the admin dashboard,
// falling back to the built-in defaults while loading or on error.
export function useSiteContact() {
  const [contact, setContact] = useState<SiteContactInfo>(DEFAULT_SITE_CONTACT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-contact")
      .then((r) => r.json())
      .then((d) => {
        if (d.contact?.phone && d.contact?.whatsapp && d.contact?.email) {
          setContact({
            phone: d.contact.phone,
            whatsapp: d.contact.whatsapp,
            email: d.contact.email,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { contact, loading };
}
