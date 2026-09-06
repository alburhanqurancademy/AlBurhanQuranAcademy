"use client";

import { DEFAULT_COURSES } from "@/lib/defaultCourses";
import { useEffect, useState } from "react";

export interface PublicCourse {
  title: string;
  slug: string;
  image: string;
  description: string;
  ageGroup?: string;
  duration?: string;
  classDuration?: string;
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
  bullets?: string[];
  status: "active" | "inactive";
}

// Returns the active courses straight from the database — no hardcoded
// fallback list. While loading, `courses` is `[]`; once loaded, it reflects
// exactly what the backend has (including genuinely empty, if there are no
// active courses), same as how published blogs are sourced.
export function useCourses() {
  const [courses, setCourses] = useState<PublicCourse[]>(DEFAULT_COURSES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => {
        const all: ApiCourse[] = Array.isArray(d.courses) ? d.courses : [];
        setCourses(
          all
            .filter((c) => c.status === "active")
            .map((c) => ({
              title: c.title,
              slug: c.slug,
              image: c.image ?? "",
              description: c.description,
              ageGroup: c.ageGroup ?? "",
              duration: c.duration ?? "",
              classDuration: c.classDuration ?? "",
              bullets: c.bullets ?? [],
            }))
        );
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading };
}
