"use client";

import { useState } from "react";

const categories = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    label: "Kids' Quran Classes",
    color: "accent",
    faqs: [
      { q: "What is the right age for my child to start Quran classes?", a: "Children can start as early as 5 years old, beginning with Noorani Qaida. Our teachers are trained to make learning fun and engaging for young learners." },
      { q: "Do you offer Quran classes for kids in Canada, USA, UK, Australia, and UAE?", a: "Yes! We teach students worldwide, with schedules adjusted to local time zones so your child can learn at a convenient time." },
      { q: "Can you help children who are complete beginners?", a: "Absolutely. Our teachers specialize in teaching beginners step by step, ensuring a strong foundation before moving forward." },
      { q: "Do you teach Quran memorization (Hifz) to kids?", a: "Yes, we offer a structured Hifz program with regular revision sessions to help children memorize the Quran accurately and confidently." },
      { q: "How do you keep young children engaged in online classes?", a: "We use interactive methods, short focused lessons, and positive reinforcement to keep young learners motivated and attentive throughout each session." },
      { q: "Do you teach Tajweed to kids?", a: "Yes, Tajweed is introduced from the very beginning to help kids develop correct pronunciation and recitation habits early on." },
      { q: "Can siblings take classes together?", a: "We recommend one-on-one sessions for better focus and personalized attention. However, we do offer sibling discounts and flexible scheduling options." },
      { q: "How long are kids' Quran classes?", a: "Each session is usually 30 minutes, which is perfectly suited to children's attention spans while still covering meaningful progress." },
      { q: "Do you offer a trial session for kids?", a: "Yes, we provide a free trial session so parents can evaluate the teaching style and quality before making any commitment." },
      { q: "Can my child switch programs (e.g., Quran Reading to Hifz)?", a: "Yes, students can switch programs at any time with teacher guidance and recommendation based on their current level and progress." },
    ],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    label: "About Teachers",
    color: "sky",
    faqs: [
      { q: "Are your Quran teachers qualified?", a: "Yes, all our teachers are experienced, certified, and thoroughly trained in Tajweed and Quranic sciences before they begin teaching." },
      { q: "Can I choose a male or female teacher for my child?", a: "Yes, parents can request either a male or female tutor based on their preference and comfort." },
      { q: "Do your teachers speak English?", a: "Yes, our teachers communicate fluently in English and Urdu, making it easier for students in Western countries to learn effectively." },
      { q: "Are your teachers trained to handle shy or slow learners?", a: "Yes, our teachers are patient, kind, and experienced in adapting their teaching style to suit every child's unique learning pace." },
      { q: "Where are your teachers from?", a: "Most of our teachers are based in Pakistan, with strong backgrounds in Islamic studies and Tajweed from reputable institutions." },
      { q: "Do your teachers teach adults too?", a: "Yes, our tutors provide Quran classes for adults as well, with programs tailored to adult learning styles and schedules." },
      { q: "Can parents talk to the teacher directly?", a: "Yes, parents are encouraged to discuss their child's progress, learning goals, and any concerns with teachers at any time." },
      { q: "Do teachers give homework?", a: "Yes, teachers assign light practice tasks to reinforce learning between classes and help students retain what they've learned." },
      { q: "How do you monitor teacher quality?", a: "We conduct regular performance reviews and actively collect parent feedback to maintain the highest teaching standards." },
      { q: "Do you train new teachers?", a: "Yes, all new teachers go through a comprehensive training program before they begin teaching any students." },
    ],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    label: "Online Classes & Scheduling",
    color: "green",
    faqs: [
      { q: "How do online Quran classes work?", a: "We use Zoom or Microsoft Teams for live one-on-one sessions, providing a personal and interactive learning experience from home." },
      { q: "Do you provide flexible class timings?", a: "Yes, classes are scheduled according to parents' and children's availability, including early mornings, evenings, and weekends." },
      { q: "What if my child misses a class?", a: "We offer make-up classes if you inform us in advance. We understand that life gets busy and we accommodate accordingly." },
      { q: "Can we change class timing?", a: "Yes, timings can be adjusted with prior notice, subject to the tutor's availability. We aim to be as flexible as possible." },
      { q: "What devices are needed for online Quran classes?", a: "A laptop, tablet, or smartphone with a stable internet connection is all you need to get started." },
      { q: "Do you record classes?", a: "No, we do not record classes in order to protect the privacy of students and teachers. However, parents are welcome to sit in on sessions." },
      { q: "How do you ensure focus during online learning?", a: "Our classes are one-on-one and highly interactive, which naturally keeps students attentive and engaged throughout the session." },
      { q: "Are online Quran classes effective for kids?", a: "Yes, with trained teachers and parental support at home, children progress quickly and effectively through online learning." },
      { q: "How long is each Quran class?", a: "Each class is 30 minutes, carefully designed to keep kids focused and engaged without overwhelming them." },
      { q: "How can parents track their child's progress?", a: "Teachers regularly update parents on their child's progress, highlighting achievements and areas that need more attention." },
      { q: "How does Al Burhan ensure safety and comfort for girls during online sessions?", a: "We offer female tutors who teach from the comfort and privacy of your home. Our tutors worldwide are committed to delivering high-quality education in a respectful and supportive environment." },
      { q: "What if I am online but my tutor hasn't joined yet?", a: "Please contact our coordinator or call us on the phone number provided on the website. We will resolve the issue promptly." },
    ],
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  accent: {
    border: "border-[var(--color-accent)]/30",
    bg: "bg-[var(--color-accent)]/10",
    text: "text-[var(--color-accent)]",
    dot: "bg-[var(--color-accent)]",
  },
  sky: {
    border: "border-[var(--color-sky)]/30",
    bg: "bg-[var(--color-sky)]/10",
    text: "text-[var(--color-sky)]",
    dot: "bg-[var(--color-sky)]",
  },
  green: {
    border: "border-[var(--color-green-light)]/40",
    bg: "bg-[var(--color-green)]/10",
    text: "text-[var(--color-green-light)]",
    dot: "bg-[var(--color-green-light)]",
  },
};

function AccordionItem({ q, a, index, color }: { q: string; a: string; index: number; color: string }) {
  const [open, setOpen] = useState(false);
  const c = colorMap[color];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${open ? c.border : "border-[var(--color-border)]"}`}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-200 ${open ? c.bg : "bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)]"}`}
      >
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${open ? `${c.dot} text-white` : "bg-[var(--color-border)] text-gray-400"}`}>
          {index}
        </span>
        <span className={`flex-1 text-sm font-semibold leading-snug transition-colors duration-200 ${open ? "text-white" : "text-gray-300"}`}>
          {q}
        </span>
        <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${open ? `${c.border} ${c.text}` : "border-[var(--color-border)] text-gray-500"}`}>
          <svg className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 pt-3 text-gray-400 text-sm leading-relaxed border-t border-[var(--color-border)]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [activeTab, setActiveTab] = useState(0);
  const active = categories[activeTab];
  const c = colorMap[active.color];

  return (
    <section className="relative overflow-hidden bg-[var(--color-black)] py-20 px-4">
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-1.5 rounded-full mb-4">
            Got Questions?
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Frequently Asked <span className="text-[var(--color-accent)]">Questions</span>
          </h2>
          <p className="text-gray-400 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our courses, teachers, and online classes. Can&apos;t find an answer?{" "}
            <a href="/contact" className="text-[var(--color-accent)] hover:underline">Contact us</a>.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          {categories.map(({ label, icon, color }, i) => {
            const tc = colorMap[color];
            const isActive = activeTab === i;
            return (
              <button
                key={label}
                onClick={() => setActiveTab(i)}
                className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? `${tc.border} ${tc.bg} ${tc.text}`
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-gray-400 hover:text-white"
                }`}
              >
                <span className={isActive ? tc.text : "text-gray-500"}>{icon}</span>
                {label}
              </button>
            );
          })}
        </div>

        {/* Count badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-1 h-6 rounded-full ${c.dot}`} />
          <p className="text-gray-400 text-sm">
            <span className={`font-bold ${c.text}`}>{active.faqs.length} questions</span> in this category
          </p>
        </div>

        {/* Accordion list */}
        <div className="flex flex-col gap-3">
          {active.faqs.map(({ q, a }, i) => (
            <AccordionItem key={`${activeTab}-${i}`} q={q} a={a} index={i + 1} color={active.color} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-2xl border border-[var(--color-border)] bg-gradient-to-r from-[var(--color-green)]/20 via-[var(--color-surface)] to-[var(--color-accent)]/10 px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-white font-bold text-lg">Still have questions?</p>
            <p className="text-gray-400 text-sm mt-1">Our team is happy to help you get started on your Quran journey.</p>
          </div>
          <a
            href="/contact"
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-sm transition-colors shadow-[0_4px_20px_rgba(250,132,30,0.3)]"
          >
            Contact Us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
