"use client";

import { useState } from "react";
import { buildEnrollmentPayload, getEnrollmentFieldErrors } from "@/lib/enrollment";
import { useCourses } from "@/hooks/useCourses";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  country: "",
  gender: "",
  age: "",
  guardianName: "",
  guardianPhone: "",
  convenientTimeFrom: "",
  convenientTimeTo: "",
  course: "",
  message: "",
};

export default function EnrollForm() {
  const { courses } = useCourses();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const setField = (key: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const inputClass = (field: keyof typeof EMPTY_FORM) =>
    `w-full bg-[var(--color-black)] border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)]/60 transition-colors ${
      errors[field] ? "border-red-500" : "border-[var(--color-border)]"
    }`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const validationErrors = getEnrollmentFieldErrors(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildEnrollmentPayload(form, form.course);
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setFormError(errorData.message || "Unable to submit enrollment. Please try again.");
        return;
      }

      setSubmitted(true);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">Get Started</span>
        <h1 className="text-3xl font-black text-white mt-2">Enroll Now</h1>
        <p className="text-gray-400 text-sm mt-2">Fill in your details and we will get back to you shortly.</p>
      </div>

      {submitted ? (
        <div className="rounded-2xl bg-[var(--color-green)]/10 border border-[var(--color-green)]/30 p-6 text-white">
          <h2 className="text-2xl font-black">Enrollment Submitted!</h2>
          <p className="mt-2 text-gray-200">Thank you! Your enrollment request has been received. We will contact you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Enter your full name"
              className={inputClass("name")}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Email Address *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="your@email.com"
              className={inputClass("email")}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Phone *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="+1 234 567 8900"
              className={inputClass("phone")}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Country *</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setField("country", e.target.value)}
              placeholder="Country"
              className={inputClass("country")}
            />
            {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
          </div>

          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Gender *</label>
            <select
              value={form.gender}
              onChange={(e) => setField("gender", e.target.value)}
              className={inputClass("gender")}
            >
              <option value="">Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Age</label>
            <input
              type="number"
              min={4}
              max={99}
              value={form.age}
              onChange={(e) => setField("age", e.target.value)}
              placeholder="e.g. 25"
              className={inputClass("age")}
            />
          </div>

          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Guardian Name</label>
            <input
              type="text"
              value={form.guardianName}
              onChange={(e) => setField("guardianName", e.target.value)}
              placeholder="Parent / Guardian"
              className={inputClass("guardianName")}
            />
          </div>

          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Guardian Phone</label>
            <input
              type="tel"
              value={form.guardianPhone}
              onChange={(e) => setField("guardianPhone", e.target.value)}
              placeholder="+1 234 567 8900"
              className={inputClass("guardianPhone")}
            />
          </div>

          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Convenient Time From *</label>
            <input
              type="time"
              value={form.convenientTimeFrom}
              onChange={(e) => setField("convenientTimeFrom", e.target.value)}
              className={inputClass("convenientTimeFrom")}
            />
            {errors.convenientTimeFrom && <p className="text-red-400 text-xs mt-1">{errors.convenientTimeFrom}</p>}
          </div>

          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Convenient Time To *</label>
            <input
              type="time"
              value={form.convenientTimeTo}
              onChange={(e) => setField("convenientTimeTo", e.target.value)}
              className={inputClass("convenientTimeTo")}
            />
            {errors.convenientTimeTo && <p className="text-red-400 text-xs mt-1">{errors.convenientTimeTo}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Course *</label>
            <select
              value={form.course}
              onChange={(e) => setField("course", e.target.value)}
              className={inputClass("course")}
            >
              <option value="">Select a Course</option>
              {courses.map(({ title }) => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
            {errors.course && <p className="text-red-400 text-xs mt-1">{errors.course}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Additional Message</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setField("message", e.target.value)}
              placeholder="Any special requirements or questions..."
              className="w-full bg-[var(--color-black)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)]/60 transition-colors resize-none"
            />
          </div>

          {formError && (
            <div className="md:col-span-2 rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-200 text-sm">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Enrollment"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
