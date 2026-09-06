"use client";

import { useEffect, useState } from "react";
import EnrollModal from "./EnrollModal";
import { useCourses } from "@/hooks/useCourses";

export default function CoursesList() {
  const { courses, loading } = useCourses();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [highlightedSlug, setHighlightedSlug] = useState("");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    setHighlightedSlug(hash);
    const timer = setTimeout(() => setHighlightedSlug(""), 3000);
    return () => clearTimeout(timer);
  }, []);

  const openEnroll = (title: string) => {
    setSelectedCourse(title);
    setModalOpen(true);
  };

  return (
    <>
      <section className="bg-[var(--color-black)] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Our <span className="text-[var(--color-accent)]">Courses</span>
            </h2>
          </div>

          {!loading && courses.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-16">There are no active courses right now. Please check back soon!</p>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(({ image, title, slug, description, ageGroup, duration, classDuration }) => {
              const highlighted = highlightedSlug === slug;
              return (
                <div
                  id={slug}
                  key={slug}
                  className={`bg-[var(--color-surface)] rounded-2xl flex flex-col group cursor-pointer transition-all duration-300 scroll-mt-24 border-2 ${
                    highlighted
                      ? "border-[var(--color-accent)] shadow-[0_0_32px_rgba(250,132,30,0.25)]"
                      : "border-[var(--color-sky)]/20 hover:border-orange-500/60"
                  }`}
                >
                  <div className="relative h-52 w-full overflow-hidden rounded-t-2xl bg-[var(--color-black-soft)]">
                    {image ? (
                      // Plain <img>: course images uploaded from the admin panel are
                      // data URIs, which next/image does not support.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-12 h-12 text-[var(--color-accent)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />

                    {/* Highlighted badge */}
                    {highlighted && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[var(--color-accent)] rounded-full px-3 py-1 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-white text-xs font-bold">Selected</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <h3 className={`font-black text-xl transition-colors duration-300 ${highlighted ? "text-[var(--color-accent)]" : "text-white group-hover:text-orange-400"}`}>
                      {title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed flex-1">{description}</p>

                    {(ageGroup || duration || classDuration) && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1">
                        {ageGroup && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {ageGroup}
                          </span>
                        )}
                        {duration && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {duration}
                          </span>
                        )}
                        {classDuration && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {classDuration} / class
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => openEnroll(title)}
                      className="mt-4 self-start px-5 py-2 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold transition-colors"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </section>

      <EnrollModal
        open={modalOpen}
        selectedCourse={selectedCourse}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
