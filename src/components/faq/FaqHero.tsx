import IslamicPatternOverlay from "@/components/IslamicPatternOverlay";

export default function FaqHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-black-soft)] py-20 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-accent)]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-sky)]/8 rounded-full blur-3xl" />
      </div>

      {/* Shared Islamic line pattern */}
      <IslamicPatternOverlay opacity={0.1} size={76} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-1.5 rounded-full mb-4">
          Got Questions?
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white">
          Frequently Asked <span className="text-[var(--color-accent)]">Questions</span>
        </h1>
        <p className="text-gray-400 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
          Everything you need to know about our courses, teachers, and online classes. Can&apos;t find an answer?{" "}
          <a href="/contact" className="text-[var(--color-accent)] hover:underline">Contact us</a>.
        </p>
      </div>
    </section>
  );
}
