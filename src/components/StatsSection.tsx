"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 500, suffix: "+", label: "Students", desc: "Active learners worldwide" },
  { target: 50, suffix: "+", label: "Teachers", desc: "Qualified Quran educators" },
  { target: 10, suffix: "+", label: "Courses", desc: "Structured learning programs" },
];

function useCounter(target: number, duration = 2000, triggered: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [triggered, target, duration]);

  return count;
}

function StatCard({ target, suffix, label, desc, triggered }: (typeof stats)[0] & { triggered: boolean }) {
  const count = useCounter(target, 2000, triggered);
  return (
    <div className="group flex flex-col items-center text-center py-10 px-6 rounded-2xl border border-[var(--color-sky)]/20 bg-[var(--color-sky)]/5 cursor-pointer transition-all duration-300 hover:border-orange-500/60 hover:bg-orange-500/10 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:-translate-y-1">
      <div className="text-5xl font-black text-[var(--color-sky)] mb-1 transition-colors duration-300 group-hover:text-orange-400">
        {count}{suffix}
      </div>
      <div className="text-white font-bold text-lg mb-1 transition-colors duration-300 group-hover:text-orange-300">{label}</div>
      <div className="text-gray-400 text-sm transition-colors duration-300 group-hover:text-orange-200/70">{desc}</div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[var(--color-black)] py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} triggered={triggered} />
        ))}
      </div>
    </section>
  );
}
