"use client";

import { useState } from "react";
import { useSiteContact } from "@/hooks/useSiteContact";
import { telHref, waHref } from "@/lib/siteContact";

const courses = [
  "Quranic Qaidah",
  "Quran Gateway",
  "Quran Memorizing",
  "Translation of The Holy Quran",
  "Women Quranic Course",
  "Tajweed Course",
];

export default function ContactSection() {
  const { contact } = useSiteContact();
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
        </svg>
      ),
      color: "sky",
      label: "Call — USA",
      value: contact.phone,
      href: telHref(contact.phone),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.492a.5.5 0 0 0 .6.6l5.699-1.484A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.502-5.17-1.378l-.371-.214-3.384.881.9-3.312-.229-.381A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      ),
      color: "whatsapp",
      label: "WhatsApp",
      value: contact.whatsapp,
      href: waHref(contact.whatsapp),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 7 10 7 10-7" />
        </svg>
      ),
      color: "accent",
      label: "Email",
      value: contact.email,
      href: "/contact",
    },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", course: "", message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // The form's own submit just validates and opens the confirmation modal —
  // the actual request only fires once the user confirms there.
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setError(null);
    setConfirmOpen(true);
  }

  async function handleConfirmSubmit() {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          course: form.course,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Unable to submit your request right now.");
      }

      setConfirmOpen(false);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", course: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit your request right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-[var(--color-black)] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Left — info cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Info cards */}
            {contactInfo.map(({ icon, color, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-[var(--color-surface)] border border-white/5 rounded-2xl p-5 hover:border-[var(--color-sky)]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(9,148,144,0.08)]"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    color === "sky"
                      ? "bg-[var(--color-sky)]/10 text-[var(--color-sky)] group-hover:bg-[var(--color-sky)]/20"
                      : color === "whatsapp"
                      ? "bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366]/20"
                      : "bg-[var(--color-accent)]/10 text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/20"
                  } transition-colors duration-300`}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-white font-semibold text-sm">{value}</p>
                </div>
                <svg className="w-4 h-4 text-gray-600 group-hover:text-[var(--color-sky)] ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            ))}

            {/* Why us strip */}
            <div className="bg-gradient-to-br from-[var(--color-sky)]/10 to-[var(--color-accent)]/5 border border-[var(--color-sky)]/15 rounded-2xl p-6 flex flex-col gap-4 mt-2">
              <p className="text-white font-bold text-sm">Why choose us?</p>
              {[
                "Qualified male & female teachers",
                "Flexible scheduling — any timezone",
                "Classes via Zoom, Teams & Skype",
                "Trial — no commitment",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-sky)]/15 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[var(--color-sky)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <div className="bg-[var(--color-surface)] border border-white/5 rounded-2xl p-8 md:p-10 relative overflow-hidden">

              {/* Subtle glow top-right */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-[var(--color-sky)]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[var(--color-accent)]/8 rounded-full blur-3xl pointer-events-none" />

              {submitted ? (
                <div className="relative z-10 flex flex-col items-center justify-center gap-5 py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-sky)]/15 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[var(--color-sky)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-white font-black text-2xl">Request Received!</h3>
                  <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                    JazakAllah Khair! We&apos;ll contact you shortly to confirm your trial class.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", course: "", message: "" }); }}
                    className="mt-2 px-6 py-2.5 rounded-xl border border-[var(--color-sky)]/30 text-[var(--color-sky)] text-sm font-semibold hover:bg-[var(--color-sky)]/10 transition-colors"
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="relative z-10 flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Full Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="bg-[var(--color-black)] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[var(--color-sky)]/50 focus:ring-1 focus:ring-[var(--color-sky)]/30 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Email Address *</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="bg-[var(--color-black)] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[var(--color-sky)]/50 focus:ring-1 focus:ring-[var(--color-sky)]/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Phone / WhatsApp</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1 000 000 0000"
                        className="bg-[var(--color-black)] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[var(--color-sky)]/50 focus:ring-1 focus:ring-[var(--color-sky)]/30 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Course Interested In</label>
                      <select
                        name="course"
                        value={form.course}
                        onChange={handleChange}
                        className="bg-[var(--color-black)] border border-white/8 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-sky)]/50 focus:ring-1 focus:ring-[var(--color-sky)]/30 transition-all appearance-none cursor-pointer text-gray-300"
                      >
                        <option value="" className="text-gray-600">Select a course</option>
                        {courses.map((c) => (
                          <option key={c} value={c} className="text-white bg-[var(--color-surface)]">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your learning goals or any questions you have..."
                      className="bg-[var(--color-black)] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[var(--color-sky)]/50 focus:ring-1 focus:ring-[var(--color-sky)]/30 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full py-4 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-sm tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 group"
                  >
                    Book a Trial Class
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>

                  <p className="text-center text-gray-600 text-xs">
                    No payment required. We&apos;ll reach out within 24 hours.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => !isSubmitting && setConfirmOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[var(--color-black-soft)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 flex flex-col gap-5">
              <div>
                <h3 className="text-white font-black text-xl">Confirm Your Trial Request</h3>
                <p className="text-gray-400 text-sm mt-1">Please review your details before submitting.</p>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[var(--color-black)] p-4">
                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-gray-500 shrink-0">Full Name</span>
                  <span className="text-white font-medium text-right">{form.name}</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-gray-500 shrink-0">Email</span>
                  <span className="text-white font-medium text-right break-all">{form.email}</span>
                </div>
                {form.phone && (
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-gray-500 shrink-0">Phone</span>
                    <span className="text-white font-medium text-right">{form.phone}</span>
                  </div>
                )}
                {form.course && (
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-gray-500 shrink-0">Course</span>
                    <span className="text-white font-medium text-right">{form.course}</span>
                  </div>
                )}
                {form.message && (
                  <div className="flex flex-col gap-1 text-sm border-t border-white/10 pt-3">
                    <span className="text-gray-500">Message</span>
                    <span className="text-gray-300 leading-relaxed">{form.message}</span>
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
