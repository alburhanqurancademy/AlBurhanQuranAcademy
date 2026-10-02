"use client";

import { useSiteContactContext } from "@/components/SiteContactProvider";

// Returns the site contact details managed from the admin dashboard. The value
// is server-rendered by the public layout, so it is normally correct on first
// paint; `contact` is null (and `loading` true) only while it is still being
// fetched. Render <ContactValue /> for the text so that shows a placeholder.
export function useSiteContact() {
  return useSiteContactContext();
}
