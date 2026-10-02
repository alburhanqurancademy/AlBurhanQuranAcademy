"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { SiteContactInfo } from "@/lib/siteContact";

type SiteContactState = {
  contact: SiteContactInfo | null;
  loading: boolean;
};

// Seeded from the server in the public layout, so every consumer (top bar,
// footer, floating buttons, contact page) renders the saved details straight
// away instead of defaults-then-swap.
const SiteContactContext = createContext<SiteContactState>({ contact: null, loading: true });

export function SiteContactProvider({
  value,
  children,
}: {
  value: SiteContactInfo | null;
  children: React.ReactNode;
}) {
  const [contact, setContact] = useState<SiteContactInfo | null>(value);

  // `value` is null only when the server read failed, or when the singleton
  // hasn't been created yet. Retrying from the client covers both: the GET
  // handler seeds the document, so the numbers fill in without a reload.
  useEffect(() => {
    if (contact) return;

    let cancelled = false;
    fetch("/api/site-contact")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const next = d.contact;
        if (next?.phone && next?.whatsapp && next?.email) {
          setContact({ phone: next.phone, whatsapp: next.whatsapp, email: next.email });
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [contact]);

  const state = useMemo(() => ({ contact, loading: contact === null }), [contact]);

  return <SiteContactContext.Provider value={state}>{children}</SiteContactContext.Provider>;
}

export function useSiteContactContext() {
  return useContext(SiteContactContext);
}
