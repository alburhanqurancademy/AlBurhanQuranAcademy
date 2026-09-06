"use client";

import { useEffect, useState } from "react";

interface SessionUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  image?: string;
}

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch("/api/auth/me")
        .then((r) => r.json())
        .then((d) => setUser(d.user ?? null))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    };

    load();
    window.addEventListener("auth:refresh", load);
    return () => window.removeEventListener("auth:refresh", load);
  }, []);

  return { user, loading };
}
