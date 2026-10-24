"use client";

import { useEffect, useState } from "react";

export interface PublicCourse {
  title: string;
  slug: string;
  image: string;
  description: string;
  ageGroup?: string;
  duration?: string;
  classDuration?: string;
  detailHeading?: string;
  detailText?: string;
  bullets?: string[];
}

interface ApiCourse {
  title: string;
  slug: string;
  image?: string;
  description: string;
  ageGroup?: string;
  duration?: string;
  classDuration?: string;
  detailHeading?: string;
  detailText?: string;
  bullets?: string[];
  status: "active" | "inactive";
}

// Returns the active courses straight from the database — no hardcoded
// fallback list. While loading, `courses` is `[]`; once loaded, it reflects
// exactly what the backend has (including genuinely empty, if there are no
// active courses), same as how published blogs are sourced.
//
// Several components on one page (the list and the enroll modal it renders)
// use this hook, so the request is shared: every caller gets the same
// in-flight promise instead of firing its own, and the result is reused for a
// few seconds so quick re-mounts don't refetch either.
const CACHE_MS = 10_000;
let shared: { promise: Promise<PublicCourse[]>; at: number } | null = null;

function fetchCourses(): Promise<PublicCourse[]> {
  if (shared && Date.now() - shared.at < CACHE_MS) return shared.promise;

  const promise = fetch("/api/courses?status=active")
    .then((r) => r.json())
    .then((d) => {
      const all: ApiCourse[] = Array.isArray(d.courses) ? d.courses : [];
      return all
        .filter((c) => c.status === "active")
        .map((c) => ({
          title: c.title,
          slug: c.slug,
          image: c.image ?? "",
          description: c.description,
          ageGroup: c.ageGroup ?? "",
          duration: c.duration ?? "",
          classDuration: c.classDuration ?? "",
          detailHeading: c.detailHeading ?? "",
          detailText: c.detailText ?? "",
          bullets: c.bullets ?? [],
        }));
    })
    .catch(() => {
      shared = null; // don't cache a failure
      return [] as PublicCourse[];
    });

  shared = { promise, at: Date.now() };
  return promise;
}

export function useCourses() {
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchCourses().then((list) => {
      if (!active) return;
      setCourses(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { courses, loading };
}
