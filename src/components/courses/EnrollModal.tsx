"use client";

import { useEffect, useState } from "react";

import { buildEnrollmentPayload, getEnrollmentFieldErrors } from "@/lib/enrollment";
import { useCourses } from "@/hooks/useCourses";

const FREQUENCY_COURSES = ["Quranic Qaidah", "Quran Gateway", "Quran Memorizing", "Women Quranic Course"];
const DAY_COURSES = ["Translation of The Holy Quran", "Tajweed Course"];

const FREQUENCY_OPTIONS = [
  { label: "5 Days a Week", sub: "Regular Class" },
  { label: "3 Days a Week", sub: "" },
  { label: "Weekend Classes", sub: "Sat & Sun" },
];

const DAY_OPTIONS = [
  { label: "Monday to Tuesday", days: "Mon – Tue" },
  { label: "Wednesday to Thursday", days: "Wed – Thu" },
  { label: "Saturday to Sunday", days: "Sat & Sun" },
];

interface Props {
  open: boolean;
  selectedCourse: string;
  onClose: () => void;
}

interface FormData {
  [key: string]: string | undefined;
  name: string;
  email: string;
  phone: string;
  country: string;
  gender: string;
  age: string;
  guardianName: string;
  guardianPhone: string;
  convenientTimeFrom: string;
  convenientTimeTo: string;
  frequency: string;
  daySlot: string;
  message: string;
}

const EMPTY: FormData = {
  name: "", email: "", phone: "", country: "",
  gender: "", age: "", guardianName: "", guardianPhone: "",
  convenientTimeFrom: "", convenientTimeTo: "", frequency: "", daySlot: "", message: "",
};

type FieldKey = keyof FormData | "course";

export default function EnrollModal({ open, selectedCourse, onClose }: Props) {
  const { courses: availableCourses } = useCourses();
  const [step, setStep] = useState(1);
  const [course, setCourse] = useState(selectedCourse);
  const [form, setForm] = useState<FormData>({ ...EMPTY });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (open) {
      setCourse(selectedCourse);
      setForm({ ...EMPTY });
      setStep(1);
      setSubmitted(false);
      setErrors({});
      setIsSubmitting(false);
      setFormError("");
    }
  }, [open, selectedCourse]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const set = (key: keyof FormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleNext = () => {
    if (!course) { setErrors({ course: "Please select a course to continue" }); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async () => {
    setFormError("");

    // Same schema (and same minimum-length rules) the API route validates against, so a
    // value that passes here is guaranteed to pass on the server too — no more short values
    // like phone="1" slipping through the client only to bounce back from the server with
    // an error the UI didn't know how to attach to the right field.
    const e: Partial<Record<keyof FormData, string>> = getEnrollmentFieldErrors({ ...form, course });
    if (FREQUENCY_COURSES.includes(course) && !form.frequency) e.frequency = "Please select class frequency";
    if (DAY_COURSES.includes(course) && !form.daySlot) e.daySlot = "Please select preferred days";
    setErrors(e);

    if (Object.keys(e).length > 0) return;

    setIsSubmitting(true);
    try {
      const payload = buildEnrollmentPayload(form, course);
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormError(data.message || "Unable to submit enrollment. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setFormError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (key: keyof FormData) =>
    `w-full bg-[var(--color-surface-raised)] border ${errors[key] ? "border-red-500" : "border-[var(--color-border)]"} rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] transition-colors`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-[var(--color-black-soft)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-[var(--color-green)]/40 via-[var(--color-surface)] to-[var(--color-accent)]/20 px-6 py-5 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-white font-black text-xl">Enroll Now</h2>
              <p className="text-gray-400 text-xs mt-0.5">
                {submitted ? "Enrollment Complete" : step === 1 ? "Step 1 of 2 — Select Your Course" : "Step 2 of 2 — Your Information"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-gray-400 hover:text-white hover:border-[var(--color-accent)]/40 transition-all shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!submitted && (
            <div className="mt-4 flex items-center gap-3">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-3 flex-1">
                  <div className={`flex items-center gap-2 ${s <= step ? "opacity-100" : "opacity-40"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                      s < step ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                        : s === step ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent"
                        : "border-gray-600 text-gray-500 bg-transparent"
                    }`}>
                      {s < step ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : s}
                    </div>
                    <span className={`text-xs font-medium ${s === step ? "text-white" : "text-gray-500"}`}>
                      {s === 1 ? "Select Course" : "Your Info"}
                    </span>
                  </div>
                  {s < 2 && <div className={`flex-1 h-px transition-all duration-500 ${step > 1 ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-6">

          {/* Success */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-green)]/20 border border-[var(--color-green)]/40 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white font-black text-xl">Enrollment Submitted!</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Thank you, <span className="text-[var(--color-accent)]">{form.name}</span>! We&apos;ve received your enrollment for{" "}
                <span className="text-white font-semibold">{course}</span>. Our team will contact you within 24 hours.
              </p>
              <button onClick={onClose} className="mt-2 px-6 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold transition-colors">
                Close
              </button>
            </div>

          ) : step === 1 ? (
            /* ── Step 1: Course Selection — list on the left, details on the right ── */
            <div className="flex flex-col gap-4">
              <p className="text-gray-400 text-sm">Choose the course you&apos;d like to enroll in. You can change this on the next step.</p>

              <div className="grid lg:grid-cols-[260px_1fr] gap-4 items-start">
                {/* Left — all courses */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:max-h-[440px] lg:overflow-y-auto lg:pr-1">
                  {availableCourses.map(({ title, image }) => {
                    const active = course === title;
                    return (
                      <button
                        key={title}
                        type="button"
                        onClick={() => { setCourse(title); setErrors({}); }}
                        className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left shrink-0 lg:shrink lg:w-full transition-all duration-200 ${
                          active
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-[0_0_16px_rgba(250,132,30,0.15)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-[var(--color-accent)]/40"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface)] flex items-center justify-center">
                          {image ? (
                            // Plain <img>: admin-uploaded course images are data URIs,
                            // which next/image does not support.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-4 h-4 text-[var(--color-accent)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                          )}
                        </div>
                        <span className={`flex-1 text-xs font-semibold leading-tight transition-colors ${active ? "text-[var(--color-accent)]" : "text-gray-300"}`}>
                          {title}
                        </span>
                        {active && (
                          <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right — selected course details */}
                {(() => {
                  const selected = availableCourses.find((c) => c.title === course);
                  if (!selected) {
                    return (
                      <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-raised)] flex flex-col items-center justify-center gap-2 py-16 text-gray-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        <p className="text-sm">Select a course to see its details</p>
                      </div>
                    );
                  }
                  return (
                    <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-surface-raised)] overflow-hidden">
                      <div className="relative h-40 w-full overflow-hidden bg-[var(--color-surface)]">
                        {selected.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={selected.image} alt={selected.title} className="absolute inset-0 w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        <h3 className="absolute bottom-3 left-4 right-4 text-white font-black text-lg leading-tight">{selected.title}</h3>
                      </div>

                      <div className="p-4 sm:p-5 flex flex-col gap-4">
                        {/* Meta — Age Group / Course Duration / Class Time */}
                        {(selected.ageGroup || selected.duration || selected.classDuration) && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {selected.ageGroup && (
                              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-[var(--color-accent)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div className="min-w-0">
                                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">Age Group</p>
                                  <p className="text-white text-xs font-semibold truncate">{selected.ageGroup}</p>
                                </div>
                              </div>
                            )}
                            {selected.duration && (
                              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-[var(--color-accent)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div className="min-w-0">
                                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">Course Duration</p>
                                  <p className="text-white text-xs font-semibold truncate">{selected.duration}</p>
                                </div>
                              </div>
                            )}
                            {selected.classDuration && (
                              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-[var(--color-accent)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="min-w-0">
                                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">Class Time</p>
                                  <p className="text-white text-xs font-semibold truncate">{selected.classDuration}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed">{selected.description}</p>

                        {/* Bullets */}
                        {selected.bullets && selected.bullets.length > 0 && (
                          <ul className="flex flex-col gap-2">
                            {selected.bullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {errors.course && <p className="text-red-400 text-xs">{errors.course}</p>}
            </div>

          ) : (
            /* ── Step 2: Personal Info Form ── */
            <div className="flex flex-col gap-4">

              {/* Selected course pill */}
              <div className="flex items-center gap-3 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-[var(--color-accent)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-xs">Enrolling in</p>
                  <p className="text-white font-semibold text-sm truncate">{course}</p>
                </div>
                <button type="button" onClick={() => setStep(1)} className="text-[var(--color-accent)] text-xs hover:underline shrink-0">Change</button>
              </div>

              {/* Name */}
              <div>
                <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Full Name *</label>
                <input type="text" placeholder="Enter your full name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls("name")} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Email Address *</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls("email")} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone + Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Phone *</label>
                  <input type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls("phone")} />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Country *</label>
                  <input type="text" placeholder="USA, UK, etc." value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls("country")} />
                  {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>

              {/* Age + Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Age</label>
                  <input type="number" placeholder="e.g. 25" min={4} max={99} value={form.age} onChange={(e) => set("age", e.target.value)} className={inputCls("age")} />
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Gender *</label>
                  <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={`${inputCls("gender")} appearance-none`}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
                </div>
              </div>

              {/* Guardian Name + Guardian Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Guardian Name</label>
                  <input type="text" placeholder="Parent / Guardian" value={form.guardianName} onChange={(e) => set("guardianName", e.target.value)} className={inputCls("guardianName")} />
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Guardian Phone</label>
                  <input type="tel" placeholder="+1 234 567 8900" value={form.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} className={inputCls("guardianPhone")} />
                </div>
              </div>

              {/* Convenient Time */}
              <div>
                <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2 block">Convenient Time *</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-500 text-xs mb-1 block">From</label>
                    <input
                      type="time"
                      value={form.convenientTimeFrom}
                      onChange={(e) => set("convenientTimeFrom", e.target.value)}
                      className={`w-full bg-[var(--color-surface-raised)] border ${errors.convenientTimeFrom ? "border-red-500" : "border-[var(--color-border)]"} rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors [color-scheme:dark]`}
                    />
                    {errors.convenientTimeFrom && <p className="text-red-400 text-xs mt-1">{errors.convenientTimeFrom}</p>}
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs mb-1 block">To</label>
                    <input
                      type="time"
                      value={form.convenientTimeTo}
                      onChange={(e) => set("convenientTimeTo", e.target.value)}
                      className={`w-full bg-[var(--color-surface-raised)] border ${errors.convenientTimeTo ? "border-red-500" : "border-[var(--color-border)]"} rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors [color-scheme:dark]`}
                    />
                    {errors.convenientTimeTo && <p className="text-red-400 text-xs mt-1">{errors.convenientTimeTo}</p>}
                  </div>
                </div>
              </div>

              {/* Class Frequency — only for frequency-based courses */}
              {FREQUENCY_COURSES.includes(course) && (
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2 block">Class Frequency *</label>
                  <div className="flex flex-col gap-2">
                    {FREQUENCY_OPTIONS.map(({ label, sub }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => set("frequency", label)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left ${
                          form.frequency === label
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-white"
                            : "border-[var(--color-border)] bg-[var(--color-surface-raised)] text-gray-400 hover:border-[var(--color-accent)]/40 hover:text-white"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${form.frequency === label ? "border-[var(--color-accent)]" : "border-gray-600"}`}>
                          {form.frequency === label && <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />}
                        </span>
                        <span className="flex-1">{label}</span>
                        {sub && <span className="text-xs text-gray-500">{sub}</span>}
                      </button>
                    ))}
                  </div>
                  {errors.frequency && <p className="text-red-400 text-xs mt-1">{errors.frequency}</p>}
                </div>
              )}

              {/* Preferred Days — only for day-based courses */}
              {DAY_COURSES.includes(course) && (
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2 block">Preferred Days *</label>
                  <div className="flex flex-col gap-2">
                    {DAY_OPTIONS.map(({ label, days }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => set("daySlot", label)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left ${
                          form.daySlot === label
                            ? "border-[var(--color-sky)] bg-[var(--color-sky)]/10 text-white"
                            : "border-[var(--color-border)] bg-[var(--color-surface-raised)] text-gray-400 hover:border-[var(--color-sky)]/40 hover:text-white"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${form.daySlot === label ? "border-[var(--color-sky)]" : "border-gray-600"}`}>
                          {form.daySlot === label && <span className="w-2 h-2 rounded-full bg-[var(--color-sky)]" />}
                        </span>
                        <span className="flex-1">{label}</span>
                        <span className="text-xs text-gray-500">{days}</span>
                      </button>
                    ))}
                  </div>
                  {errors.daySlot && <p className="text-red-400 text-xs mt-1">{errors.daySlot}</p>}
                </div>
              )}

              {/* Message */}
              <div>
                <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Additional Message <span className="text-gray-500 normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Any special requirements or questions..."
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-[var(--color-border)] shrink-0 flex flex-col gap-3">
            {formError && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{formError}</p>
            )}
            <div className="flex items-center justify-between gap-3">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-gray-400 hover:text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back
              </button>
            ) : <div />}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-bold transition-colors shadow-[0_4px_20px_rgba(250,132,30,0.3)]"
              >
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-bold transition-colors shadow-[0_4px_20px_rgba(250,132,30,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Enrollment
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
